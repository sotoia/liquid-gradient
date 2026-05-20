# Liquid Gradient — Preset recipes

Ten tested configurations. Pick one, paste, ship. If the user asks for something not on this list, **compose** from `tuning.md` rather than improvising — improvised presets are usually too saturated or too fast.

---

## 1. `vercel` — dark with brand-blue accent

Tech SaaS, developer tools, "we're serious" landing.

```json
{
  "colors": ["#000000", "#0a0a0a", "#0099ff", "#1a1a1a"],
  "speed": 0.18, "scale": 0.9, "turbAmp": 1.2, "turbFreq": 0.85, "turbIter": 6,
  "waveFreq": 1.6, "jellify": 1, "distBias": 0.0,
  "dither": 0.06, "ditherMode": 1,
  "exposure": 0.75, "contrast": 1.25, "saturation": 1.1,
  "seed": 12.5
}
```

---

## 2. `linear` — purple/pink aurora

App design, productivity, "calm and premium".

```json
{
  "colors": ["#0d0014", "#5b21b6", "#ec4899", "#1a0a2e"],
  "speed": 0.22, "scale": 1.1, "turbAmp": 1.3, "turbFreq": 0.9, "turbIter": 6,
  "waveFreq": 1.8, "jellify": 1, "distBias": 0.15,
  "dither": 0.08, "ditherMode": 2,
  "exposure": 0.82, "contrast": 1.2, "saturation": 1.25,
  "seed": 73.0
}
```

---

## 3. `framer` — official Workshop palette

For demos that want to look "exactly like Framer's site".

```json
{
  "colors": ["#0099ff", "#7c3aed", "#ec4899", "#f97316"],
  "speed": 0.8, "scale": 1.4, "turbAmp": 0.55, "turbFreq": 1.0, "turbIter": 9,
  "waveFreq": 2.4, "jellify": 1, "distBias": 0.0,
  "dither": 0.05, "ditherMode": 1,
  "exposure": 1.0, "contrast": 1.05, "saturation": 1.1,
  "seed": 42.0
}
```

---

## 4. `aurora` — multicolor pastel, dreamy

Creative portfolios, lifestyle brands, photography sites.

```json
{
  "colors": ["#8ec5fc", "#e0c3fc", "#fbc2eb", "#a6c1ee"],
  "speed": 0.3, "scale": 1.0, "turbAmp": 0.9, "turbFreq": 0.7, "turbIter": 5,
  "waveFreq": 1.4, "jellify": 1, "distBias": -0.2,
  "dither": 0.04, "ditherMode": 1,
  "exposure": 1.0, "contrast": 0.95, "saturation": 0.9,
  "seed": 8.0
}
```

---

## 5. `sunset` — warm orange/red, cinematic

Travel, food, fashion. Anything that needs warmth.

```json
{
  "colors": ["#1a0500", "#ff6b35", "#f7c59f", "#7a1a00"],
  "speed": 0.2, "scale": 0.85, "turbAmp": 1.4, "turbFreq": 0.95, "turbIter": 7,
  "waveFreq": 2.0, "jellify": 1, "distBias": 0.1,
  "dither": 0.12, "ditherMode": 2,
  "exposure": 0.85, "contrast": 1.35, "saturation": 1.4,
  "seed": 27.0
}
```

---

## 6. `mono` — pure black & white, brutalist

Editorial, magazines, "no color, no excuses".

```json
{
  "colors": ["#000000", "#404040", "#888888", "#1a1a1a"],
  "speed": 0.15, "scale": 0.8, "turbAmp": 1.5, "turbFreq": 1.0, "turbIter": 5,
  "waveFreq": 1.5, "jellify": 1, "distBias": 0.0,
  "dither": 0.15, "ditherMode": 2,
  "exposure": 0.8, "contrast": 1.45, "saturation": 0.0,
  "seed": 99.0
}
```

---

## 7. `cinematic` — sotoia default, dark electric blue with film grain

The default the Studio ships with. Premium, brand-neutral, cinematic.

```json
{
  "colors": ["#000000", "#2b2b2b", "#384fff", "#212121"],
  "speed": 0.24, "scale": 0.82, "turbAmp": 1.5, "turbFreq": 0.88, "turbIter": 5,
  "waveFreq": 1.73, "jellify": 1, "distBias": 0.21,
  "dither": 0.10, "ditherMode": 2,
  "exposure": 0.71, "contrast": 1.31, "saturation": 1.5,
  "seed": 50.55
}
```

---

## 8. `pastel` — soft mint & coral, kindergarten-friendly

Wellness, kids products, e-learning landings.

```json
{
  "colors": ["#fef9e7", "#a8e6cf", "#ffd3b6", "#ff8b94"],
  "speed": 0.18, "scale": 1.2, "turbAmp": 0.7, "turbFreq": 0.8, "turbIter": 5,
  "waveFreq": 1.2, "jellify": 1, "distBias": -0.1,
  "dither": 0.02, "ditherMode": 1,
  "exposure": 1.05, "contrast": 0.9, "saturation": 0.85,
  "seed": 16.0
}
```

---

## 9. `subtle` — very low energy, doesn't distract

For sections that have a lot of text on top (e.g. about pages, dashboards with a hero strip).

```json
{
  "colors": ["#0a0a0a", "#141414", "#1f1f1f", "#080808"],
  "speed": 0.1, "scale": 0.7, "turbAmp": 0.8, "turbFreq": 0.6, "turbIter": 4,
  "waveFreq": 1.2, "jellify": 0, "distBias": 0.0,
  "dither": 0.03, "ditherMode": 1,
  "exposure": 0.65, "contrast": 1.1, "saturation": 1.0,
  "seed": 3.0
}
```

---

## 10. `acid` — high saturation, neon, attention-grabbing

Gaming, music, NFT, web3. Use sparingly.

```json
{
  "colors": ["#000000", "#00ff88", "#ff00aa", "#0080ff"],
  "speed": 0.55, "scale": 1.5, "turbAmp": 1.2, "turbFreq": 1.2, "turbIter": 7,
  "waveFreq": 2.6, "jellify": 1, "distBias": 0.0,
  "dither": 0.08, "ditherMode": 2,
  "exposure": 0.95, "contrast": 1.4, "saturation": 1.7,
  "seed": 88.0
}
```

---

## How to apply

```tsx
import { LiquidGradient } from "./LiquidGradient";
import preset from "./presets/linear.json";

<LiquidGradient {...preset} />
```

Or in vanilla HTML, paste the preset object into the `CONFIG` block of `standalone.html`.

## Composing your own

When no preset fits exactly, start from the closest one and apply deltas from `tuning.md`. Don't start from scratch — the parameters interact non-linearly and improvised presets usually overshoot.
