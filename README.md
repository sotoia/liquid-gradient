# Framer Liquid Gradient

A standalone, dependency-free port of the [Framer Workshop](https://www.framer.com/workshop/) "Liquid Gradient" — the animated WebGL background you see on Framer's marketing pages. Now drop-in for any HTML/React/Vue project.

![Standalone](standalone.html)

> The original shader is by Framer. This repo packages it as plain WebGL2 + React, with the same uniforms exposed, plus an interactive demo to tune your own preset.

## What it is

A fragment shader that renders procedural turbulent gradients with:

- Perceptually-correct color blending in **Oklab/Lch** (not muddy mid-tones)
- Iterative turbulence (2–13 octaves) seeded by a single float
- Real film/grain dither (IGN smooth or noise grain)
- Soft gamut mapping, contrast + saturation post-process
- Pure WebGL2, no Three.js, no library

## Try it — Studio

Clone and open `demo.html` in your browser — it's a full Studio:

```sh
git clone https://github.com/sotoia/liquid-gradient.git
cd liquid-gradient
open demo.html
```

The panel on the right lets you:

- Edit the **hero title & subtitle** live, or hide the text completely
- Pick **4 palette colors** (sampled in Oklab)
- Tune every shader uniform — motion, grain (off / smooth / film), color grading, seed
- **📥 Download as HTML** — exports a self-contained, dependency-free file with your exact settings baked in. Ready to upload to any server, drop into a Framer code component, or attach to an email.
- **⧉ Copy CONFIG (JSON)** — for pasting into the React component or any framework

## Use it — vanilla HTML

Copy [`standalone.html`](standalone.html) into your project, drop the `<canvas>` + `<script>` block anywhere, and tweak the `CONFIG` object at the top of the script.

```html
<canvas id="liquid"></canvas>
<script>
  const CONFIG = {
    colors: ['#0099ff', '#7c3aed', '#ec4899', '#f97316'],
    dither: 0.05,
    ditherMode: 1,  // 0 off · 1 smooth · 2 grain
    /* ...all uniforms */
  };
  /* shader + render loop included */
</script>
```

## Use it — React / Next.js

Drop [`react/LiquidGradient.tsx`](react/LiquidGradient.tsx) into your project.

```tsx
import { LiquidGradient } from "./LiquidGradient";

export default function Hero() {
  return (
    <section style={{ position: "relative", height: "100vh" }}>
      <LiquidGradient
        colors={["#0099ff", "#7c3aed", "#ec4899", "#f97316"]}
        dither={0.05}
        ditherMode={1}
        speed={0.8}
      />
      <h1 style={{ position: "relative", zIndex: 1 }}>Build in seconds</h1>
    </section>
  );
}
```

The component mounts a full-bleed `<canvas>` (`position: absolute; inset: 0`) inside whichever parent you wrap it in — make sure that parent has `position: relative` (or any non-static position).

## Props (React) / CONFIG (vanilla)

| Key | Default | Range | What |
|---|---|---|---|
| `colors` | `["#0099ff","#7c3aed","#ec4899","#f97316"]` | 1–8 hex | Palette sampled in Oklab |
| `speed` | `0.8` | 0–2 | Animation speed |
| `scale` | `1.4` | 0.3–3 | Zoom of the field |
| `turbAmp` | `0.55` | 0–1.5 | Turbulence amplitude |
| `turbFreq` | `1.0` | 0.3–3 | Turbulence frequency |
| `turbIter` | `9` | 2–13 | Octaves (more = more detail, more GPU) |
| `waveFreq` | `2.4` | 0.5–6 | Wave frequency |
| `jellify` | `1` | 0 \| 1 | Squashes axes for "jelly" feel |
| `distBias` | `0` | -2 to 2 | Distribution bias |
| `dither` | `0.05` | 0–1 | **Grain intensity** |
| `ditherMode` | `1` | 0 \| 1 \| 2 | **0 off · 1 smooth IGN · 2 grain (film)** |
| `exposure` | `1.0` | 0.3–2 | Brightness |
| `contrast` | `1.05` | 0.5–2 | Contrast |
| `saturation` | `1.1` | 0–2 | Saturation |
| `seed` | `42` | any float | Varies composition |
| `loop` | `0` | 0 or seconds | `0` = continuous; `> 0` = seamless loop period |

## Files

| File | |
|------|---|
| `demo.html` | Full interactive demo with control panel |
| `standalone.html` | Drop-in vanilla version, no UI |
| `react/LiquidGradient.tsx` | React component (TypeScript, no deps) |
| `shader/liquid-gradient.frag` | The fragment shader, readable, fully commented |
| `shader/liquid-gradient.vert` | The (trivial) vertex shader |

## Browser support

Requires **WebGL2** (`#version 300 es`, `uvec3`, `floatBitsToUint`). All modern browsers since 2022. Older browsers fall back to a black canvas — wrap with your own static fallback if you need to.

## Attribution & "protection"

Honest answer: **MIT means anyone can fork this, use it commercially, and even paste it on their site.** What they *cannot* legally do is strip the copyright/license notice — that's a license violation and grounds for a DMCA takedown on GitHub.

What this repo does to make attribution sticky without being annoying:

1. **`LICENSE` (MIT)** — the legal layer. Anyone redistributing has to keep the copyright line.
2. **Header comment in every exported HTML** — when you click *Download* the file starts with `<!-- Original shader by Framer · packaged by @sotoia · https://github.com/sotoia/liquid-gradient -->`. Removable but visible to anyone who opens DevTools or the source.
3. **Footer link in every exported HTML** — a tiny `◆ liquid-gradient by @sotoia` in the bottom-left corner with `mix-blend-mode: overlay` so it blends in but is clickable. Easy to remove, but most people won't bother.
4. **Source comments** in `demo.html` and `react/LiquidGradient.tsx` with the same attribution.

If you find someone re-uploading this repo to their account verbatim and claiming authorship, you can [report via GitHub DMCA](https://github.com/contact/dmca). Forks with attribution kept are fair use and the whole point of MIT.

## Credits

- Original shader: [Framer](https://www.framer.com/) — `LiquidGradient.mjs` from the Workshop bundle. All credit for the algorithm goes to them.
- PCG hash: [Mark Jarzynski & Marc Olano](https://www.jcgt.org/published/0009/03/02/)
- Oklab color space: [Björn Ottosson](https://bottosson.github.io/posts/oklab/)
- This repackaging: [sotoia](https://github.com/sotoia)

## License

MIT
