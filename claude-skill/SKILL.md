---
name: liquid-gradient
description: This skill should be used when the user explicitly says "Liquid Gradient", "liquid background", "framer hero background", "/liquid-gradient", or asks to add an animated WebGL gradient hero to a section/page. NEVER trigger automatically for generic gradient or background requests.
version: 1.0.0
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash]
---

# Liquid Gradient — animated WebGL background

A skill that drops the `liquid-gradient` shader hero (port of Framer Workshop's `LiquidGradient`) into any web project: vanilla HTML, React/Next.js, Astro, Vue, or Framer code components. Pure WebGL2, no dependencies, MIT licensed.

**Source of truth:** https://github.com/sotoia/liquid-gradient
**Live Studio:** clone the repo and `open demo.html` to tune presets visually before coding.

---

## 1. WHEN TO USE

✅ User wants an animated hero/background for a marketing landing, a SaaS dashboard splash, a portfolio cover, a video thumbnail page.
✅ User specifically asks for "the Framer-style background", "Vercel-style gradient", "Linear-style aurora".
✅ User wants a high-fidelity animated background WITHOUT pulling in Three.js or large libraries.

❌ Don't use for static gradients — CSS `linear-gradient` is enough.
❌ Don't use over data-dense screens (tables, code, large charts). The shader competes with content.
❌ Don't use as a body background that spans pages with text content — only as a contained hero section.

---

## 2. DECISION FLOW — VANILLA vs REACT vs STANDALONE

| Project | Use |
|---------|-----|
| Plain HTML, Astro, Eleventy, Jekyll, vanilla site | `standalone.html` snippet (canvas + script block, copy into the page) |
| Next.js, Vite, Remix, any React app | `LiquidGradient.tsx` component (drop into `components/`) |
| Vue / Svelte / Solid | Adapt the vanilla code into the framework's effect hook (see `references/integration.md`) |
| Framer (the design tool) | "Code Component" in Framer with the React file |
| Quick prototype with just `<canvas>` | Tell user to run the Studio (`open demo.html`) to tune, then click **Download HTML** for a self-contained file |

---

## 3. WORKFLOW

### Step 1: Confirm placement
Ask the user where they want it. Default assumption is a **hero section above the fold**. Common variants:
- Full-bleed hero (default)
- Top 60vh of a landing
- Inside a card (`position: relative` container)
- Splash screen / login background

### Step 2: Translate brief → preset
The user rarely names uniforms. They say things like *"calmer"*, *"more energetic"*, *"like Vercel"*. Use the table in `references/presets.md` to pick a preset, or compose one from `references/tuning.md`. **Always tell the user which preset you picked and why.**

### Step 3: Drop the code
- Fetch the latest component from the repo if not already in the project (give the user a curl/git command).
- Use the **integration recipe** for their framework from `references/integration.md`.
- Make sure the parent container is `position: relative` and the gradient layer is `inset: 0; z-index: 0`. Content on top: `position: relative; z-index: 1`.

### Step 4: Set the palette
Pick 3–5 colors. Default uses 4. Always sample in Oklab (the shader does this for you — just give it hex values). When in doubt:
- One **anchor** color (the dominant brand color)
- One **deep** color (near-black or dark neutral for depth)
- One **accent** color (brighter / saturated for the highlight)
- Optional fourth: a **secondary accent** in a complementary hue

### Step 5: Verify in browser
For React, the dev server must be running. For HTML, open the file. If the canvas is black, check:
1. Browser supports WebGL2 (Chrome/Edge/Safari since 2022 ✓)
2. Parent has explicit `height` or content sets one
3. `position: relative` on parent
4. No CSS rule forcing `display: none` on the canvas

---

## 4. PARAMETERS — QUICK REFERENCE

| Uniform | Range | Default | What it does |
|---------|-------|---------|--------------|
| `colors` | 1-8 hex | `["#000","#2b2b2b","#384fff","#212121"]` | Palette (sampled in Oklab) |
| `speed` | 0–2 | `0.24` | Animation speed. <0.3 = calm, >1 = energetic |
| `scale` | 0.3–3 | `0.82` | Zoom of the field. Low = big blobs, high = detail |
| `turbAmp` | 0–1.5 | `1.5` | Turbulence amplitude. High = swirly |
| `turbFreq` | 0.3–3 | `0.88` | Turbulence frequency |
| `turbIter` | 2–13 | `5` | Octaves of detail (more = GPU heavier) |
| `waveFreq` | 0.5–6 | `1.73` | Wave count |
| `jellify` | 0/1 | `1` | Axis squash for "jelly" feel |
| `distBias` | -2 to 2 | `0.21` | Distribution bias |
| `dither` | 0–1 | `0.10` | Grain intensity |
| `ditherMode` | 0/1/2 | `2` | `0` off · `1` smooth IGN · `2` film grain |
| `exposure` | 0.3–2 | `0.71` | Brightness |
| `contrast` | 0.5–2 | `1.31` | Contrast |
| `saturation` | 0–2 | `1.5` | Saturation |
| `seed` | any float | `50.55` | Re-roll composition without changing other params |
| `loop` | 0 or seconds | `0` | `0` = continuous; `>0` = seamless loop period |

---

## 5. CRAFT RULES — DON'T BREAK THESE

1. **Always darken or tint text on top.** The gradient is busy. Use `mix-blend-mode: overlay` on h1/p, or wrap text in a card with subtle background.
2. **Never animate it forever for read-only content.** If the user is reading, use `loop: 8` with low `speed` so the motion is meditative.
3. **Set explicit `height`** on the hero container. WebGL canvases without a sized parent collapse to 150x300.
4. **Respect `prefers-reduced-motion`.** If the OS asks for less motion, set `speed: 0` or render a still frame (set `speed: 0` after first paint).
5. **Don't use 8 colors unless you mean it.** 3-4 colors gives the cleanest read; more = muddy banding even with Oklab.
6. **Keep `turbIter` at 5-7 for production.** 9+ doubles GPU cost with barely visible upgrade.

---

## 6. REFERENCES

- `references/presets.md` — 10 named recipes (Vercel, Linear, Framer, Aurora, Sunset, Mono, Cinematic, Pastel, Brutalist, Subtle). Copy-paste ready.
- `references/integration.md` — exact code to drop into Next.js, plain HTML, Astro, Vue, Svelte, Framer code components.
- `references/tuning.md` — how to translate vague briefs ("more calm", "more brand", "lower energy") into uniform deltas.

Always read the relevant reference before improvising — the presets are tested combinations.

---

## 7. WORKING SESSION SCRIPT

When user invokes the skill:

> "I'll add the Liquid Gradient to your [section]. Quick questions:
> 1. Which preset feels closest to your brand? (offer 3: e.g. Vercel/dark blue, Aurora/multicolor pastel, Mono/grayscale) — or describe the vibe and I'll compose.
> 2. Should it respect `prefers-reduced-motion` and freeze for accessibility-conscious users? (recommend yes)
> 3. Live in a `<section>` over the fold, or inside a specific component?"

Then drop the code, show the parent container CSS that's required, and remind the user to open `https://github.com/sotoia/liquid-gradient` for the Studio if they want to tune visually.
