#version 300 es
precision highp float;
precision highp int;

in vec2 v_uv;
out vec4 fragColor;

// === UNIFORMS ===
#define MAX_COLORS 8
uniform vec4  u_colors[MAX_COLORS];   // palette, alpha unused
uniform int   u_colors_length;        // 1..MAX_COLORS
uniform vec2  u_resolution;           // canvas size in physical pixels
uniform float u_time;                 // seconds
uniform float u_pixelRatio;           // devicePixelRatio (clamped <=2 recommended)
uniform float u_seed;                 // any float, varies composition
uniform float u_speed;                // animation speed multiplier (~0.5–1.5)
uniform float u_scale;                // zoom of the field (~0.5–3.0)
uniform float u_turbAmp;              // turbulence amplitude (~0.0–1.0)
uniform float u_turbFreq;             // turbulence frequency (~0.3–3.0)
uniform float u_turbIter;             // turbulence iterations (2..13)
uniform float u_waveFreq;             // wave frequency (~0.5–6.0)
uniform float u_jellify;              // 0 or 1, squashes axes
uniform float u_distBias;             // distribution bias (-2..2)
uniform float u_dither;               // grain intensity (0..1)
uniform float u_ditherMode;           // 0 off, 1 IGN smooth, 2 quickNoise grain
uniform float u_exposure;             // ~0.3–2.0
uniform float u_contrast;             // ~0.5–2.0
uniform float u_saturation;           // ~0.0–2.0
uniform float u_loop;                 // 0 = continuous; >0 = loop period in seconds

const float GOLDEN_ANGLE = 2.3999632;
const float TAU = 6.28318530;

// PCG hash — https://www.jcgt.org/published/0009/03/02/
uvec3 hash3(uvec3 v) {
    v = v * 1664525u + 1013904223u;
    v.x += v.y * v.z; v.y += v.z * v.x; v.z += v.x * v.y;
    v ^= v >> 16u;
    v.x += v.y * v.z; v.y += v.z * v.x; v.z += v.x * v.y;
    return v;
}
vec3 seedRandom(float s) {
    uvec3 u = uvec3(floatBitsToUint(s), floatBitsToUint(s*1.5+7.31), floatBitsToUint(s*2.7+13.37));
    u = hash3(u);
    return vec3(u) / float(0xFFFFFFFFu);
}

// === Color space utils (sRGB / Linear / Oklab / Lch) ===
vec3 toLinear(vec3 c) { return pow(c, vec3(2.2)); }
vec3 toSrgb(vec3 c)   { return pow(clamp(c, 0.0, 1.0), vec3(0.4545)); }

vec3 linearToOklab(vec3 c) {
    float l=0.4122214708*c.r+0.5363325363*c.g+0.0514459929*c.b;
    float m=0.2119034982*c.r+0.6806995451*c.g+0.1073969566*c.b;
    float s=0.0883024619*c.r+0.2817188376*c.g+0.6299787005*c.b;
    l=pow(max(l,0.0),1.0/3.0); m=pow(max(m,0.0),1.0/3.0); s=pow(max(s,0.0),1.0/3.0);
    return vec3(0.2104542553*l+0.7936177850*m-0.0040720468*s,
                1.9779984951*l-2.4285922050*m+0.4505937099*s,
                0.0259040371*l+0.7827717662*m-0.8086757660*s);
}
vec3 oklabToLinear(vec3 c) {
    float l=c.x+0.3963377774*c.y+0.2158037573*c.z;
    float m=c.x-0.1055613458*c.y-0.0638541728*c.z;
    float s=c.x-0.0894841775*c.y-1.2914855480*c.z;
    l=l*l*l; m=m*m*m; s=s*s*s;
    return vec3(+4.0767416621*l-3.3077115913*m+0.2309699292*s,
                -1.2684380046*l+2.6097574011*m-0.3413193965*s,
                -0.0041960863*l-0.7034186147*m+1.7076147010*s);
}
vec3 oklabToLch(vec3 lab) { return vec3(lab.x, length(lab.yz), atan(lab.z, lab.y)); }
vec3 lchToOklab(vec3 lch) { return vec3(lch.x, lch.y*cos(lch.z), lch.y*sin(lch.z)); }
vec3 mixLch(vec3 a, vec3 b, float t) {
    vec3 la=oklabToLch(a), lb=oklabToLch(b);
    if (la.y<0.05) la.z=lb.z;
    if (lb.y<0.05) lb.z=la.z;
    float dh=lb.z-la.z;
    if (dh> 3.14159265) dh -= TAU;
    if (dh<-3.14159265) dh += TAU;
    return lchToOklab(vec3(mix(la.x,lb.x,t), mix(la.y,lb.y,t), la.z + dh*t));
}

vec3 getColor(int idx) {
    if (u_colors_length < 1) return vec3(0.0);
    int i = clamp(idx, 0, u_colors_length - 1);
    return u_colors[i].rgb;
}
vec3 paletteN(float t, int count) {
    if (count < 1) return vec3(0.0);
    if (count < 2) return toLinear(getColor(0));
    float seg = 1.0 / float(count - 1);
    t = clamp(t, 0.0, 1.0);
    int idx = min(int(floor(t/seg)), count - 2);
    float lt = clamp((t - float(idx)*seg) / seg, 0.0, 1.0);
    vec3 a = linearToOklab(toLinear(getColor(idx)));
    vec3 b = linearToOklab(toLinear(getColor(idx + 1)));
    return oklabToLinear(mixLch(a, b, lt));
}

// === Dither ===
float IGN(vec2 uv) { return fract(52.9829189 * fract(dot(uv, vec2(0.06711056, 0.00583715)))); }
float quickNoise(vec2 I) { return fract(sin(dot(I, vec2(12.9898, 78.233))) * 43758.5453); }
float getDither(vec2 I, float mode) {
    if (mode < 0.5) return 0.5;
    if (mode < 1.5) return IGN(I);
    return quickNoise(I);
}

// === Soft gamut + contrast/saturation ===
vec3 softGamutMap(vec3 rgb) {
    float mx=max(rgb.r,max(rgb.g,rgb.b)), mn=min(rgb.r,min(rgb.g,rgb.b));
    if (mn>=0.0 && mx<=1.0) return rgb;
    vec3 lab=linearToOklab(max(rgb,0.0));
    float L=clamp(lab.x,0.0,1.0), C=length(lab.yz), h=atan(lab.z,lab.y);
    float mc=0.4*(1.0-pow(abs(2.0*L-1.0),2.0));
    if (C > mc*0.7) { float k=mc*0.7; C = k + (mc-k)*tanh((C-k)/(mc-k+0.001)); }
    return clamp(oklabToLinear(vec3(L, C*cos(h), C*sin(h))), 0.0, 1.0);
}
vec3 applyContrastSat(vec3 rgb, float contrast, float sat) {
    vec3 lab=linearToOklab(rgb);
    float C=length(lab.yz), h=atan(lab.z,lab.y);
    lab.x = clamp((lab.x - 0.5) * contrast + 0.5, 0.0, 1.0);
    C *= sat;
    lab.y = C*cos(h); lab.z = C*sin(h);
    return oklabToLinear(lab);
}

void main() {
    vec2 fragCoord = v_uv * u_resolution;
    vec2 r = u_resolution;
    vec2 p = (fragCoord*2.0 - r) / r.y;
    int colorCount = u_colors_length;
    if (colorCount < 1) { fragColor = vec4(0.0, 0.0, 0.0, 1.0); return; }

    float t = u_time * 0.3;
    float looping = step(0.5, u_loop);
    float phase = TAU * u_time / max(u_loop, 0.01);
    float radius = u_loop * u_speed * 0.3 / TAU;
    float tA = sin(phase) * radius;
    float tB = (1.0 - cos(phase)) * radius;

    vec3 seedOffset  = seedRandom(u_seed);
    vec3 seedOffset2 = seedRandom(u_seed + 100.0);
    float seedAngle  = u_seed * GOLDEN_ANGLE;
    vec2 seedPhase   = (seedOffset2.xy - 0.5) * TAU;
    float cs = cos(seedAngle), sn = sin(seedAngle);
    p = mat2(cs, -sn, sn, cs) * p;

    float dither = getDither(floor(fragCoord / u_pixelRatio), u_ditherMode);

    float totalVal=0.0, totalWeight=0.0;
    int turbIter = int(u_turbIter);
    float freq = 1.0 / max(u_turbFreq, 0.01);

    for (float i = 0.0; i < 4.0; i++) {
        float eph = i / 4.0;
        vec2 q = p * u_scale;
        float sq = eph * eph;
        if (u_jellify > 0.5) { q.yx *= mix(1.0, 0.5, 1.0 - exp(-sq)); }
        float a = seedPhase.x; float d = seedPhase.y;
        for (int j = 2; j < 13; j++) {
            if (j >= turbIter) break;
            float fj = float(j);
            float t1 = mix(t*u_speed, tA, looping);
            float t2 = mix(t*u_speed, tB, looping);
            q += u_turbAmp * sin(q.yx / freq * fj + t1 + vec2(a,d) + seedOffset.xy * fj) / fj;
            a += cos(fj + d*1.2 + q.x*2.0 - t1 + seedOffset2.z + t2*0.3*looping);
            d += sin(fj*q.y + a + seedOffset.z + t1 + seedOffset2.y + t2*0.3*looping);
        }
        float v = 0.5 + 0.5 * sin(length(q.yx + vec2(a,d)*0.2) * u_waveFreq + i*i + seedOffset.x);
        float w = smoothstep(0.0, 0.5, eph) * smoothstep(1.0, 0.5, eph);
        totalVal += v * w; totalWeight += w;
    }
    float val = totalVal / totalWeight;
    val = clamp((val - 0.3) / 0.4, 0.0, 1.0);
    val = pow(val, exp(-u_distBias));
    val = clamp(val + (dither - 0.5) * u_dither, 0.0, 1.0);

    vec3 col = paletteN(val, colorCount);
    col *= u_exposure;
    col = applyContrastSat(col, u_contrast, u_saturation);
    col = softGamutMap(col);
    col = toSrgb(col);
    fragColor = vec4(col, 1.0);
}
