# Liquid Gradient — Integration recipes

How to drop the component into common stacks. Each recipe is copy-paste ready. **Always** install the file from the source repo first:

```sh
# React/TypeScript projects
curl -o src/components/LiquidGradient.tsx https://raw.githubusercontent.com/sotoia/liquid-gradient/main/react/LiquidGradient.tsx

# Vanilla HTML / Astro / 11ty
curl -o public/liquid-gradient.html https://raw.githubusercontent.com/sotoia/liquid-gradient/main/standalone.html
```

---

## 1. Next.js (App Router or Pages)

```tsx
// app/components/LiquidGradient.tsx
// (copy from https://raw.githubusercontent.com/sotoia/liquid-gradient/main/react/LiquidGradient.tsx)
"use client";
// ...component as published...
```

```tsx
// app/page.tsx
import { LiquidGradient } from "./components/LiquidGradient";

export default function Home() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        background: "#000",
      }}
    >
      <LiquidGradient
        colors={["#000000", "#2b2b2b", "#384fff", "#212121"]}
        dither={0.10}
        ditherMode={2}
        contrast={1.31}
        saturation={1.5}
        exposure={0.71}
        seed={50.55}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        <h1>Your hero text</h1>
        <p>Your subtitle</p>
      </div>
    </section>
  );
}
```

**Important:** the component must be a Client Component (uses `useRef` + WebGL). Add `"use client"` at the top.

---

## 2. Vanilla HTML / static site

Paste this into your page where the hero goes. Replace the `CONFIG` block with your preset.

```html
<section class="hero" style="position:relative;height:100vh;overflow:hidden;background:#000">
  <canvas id="liquid" style="position:absolute;inset:0;width:100%;height:100%"></canvas>
  <div style="position:relative;z-index:1;display:grid;place-items:center;height:100%;text-align:center;color:#fff">
    <h1>Your hero text</h1>
  </div>
</section>

<script>
const CONFIG = {
  /* paste preset from presets.md here */
  colors: ["#000000","#2b2b2b","#384fff","#212121"],
  speed: 0.24, scale: 0.82, turbAmp: 1.5, turbFreq: 0.88, turbIter: 5,
  waveFreq: 1.73, jellify: 1, distBias: 0.21,
  dither: 0.10, ditherMode: 2,
  exposure: 0.71, contrast: 1.31, saturation: 1.5,
  seed: 50.55, loop: 0,
};
/* Then paste the shader setup from standalone.html (canvas+gl init + render loop) here */
</script>
```

For a fully self-contained snippet, **direct user to download `standalone.html` from the Studio** — it inlines the entire shader (3 KB compressed) plus init code.

---

## 3. Astro

```astro
---
// src/components/LiquidGradient.astro
const { preset } = Astro.props;
---
<section class="hero">
  <canvas id="liquid"></canvas>
  <div class="content"><slot /></div>
</section>

<style>
  .hero { position: relative; min-height: 100vh; overflow: hidden; background: #000; }
  .hero canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
  .hero .content { position: relative; z-index: 1; }
</style>

<script is:inline define:vars={{ CONFIG: preset }}>
  /* paste shader setup from standalone.html here */
</script>
```

Usage:
```astro
---
import LiquidGradient from "../components/LiquidGradient.astro";
import linear from "../presets/linear.json";
---
<LiquidGradient preset={linear}>
  <h1>Hello</h1>
</LiquidGradient>
```

---

## 4. Vue 3 (Composition API)

```vue
<!-- LiquidGradient.vue -->
<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

const props = defineProps({
  colors: { type: Array, default: () => ["#000","#2b2b2b","#384fff","#212121"] },
  speed: { type: Number, default: 0.24 },
  /* ... all other props with defaults from SKILL.md table ... */
});

const canvas = ref(null);
let raf;

onMounted(() => {
  /* paste the WebGL init + render loop adapted from react/LiquidGradient.tsx */
  /* read uniforms from props.value */
});

onUnmounted(() => {
  cancelAnimationFrame(raf);
});
</script>

<template>
  <canvas ref="canvas" style="position:absolute;inset:0;width:100%;height:100%;display:block"></canvas>
</template>
```

The full Vue port is essentially the React file with `useEffect` → `onMounted`, `useRef` → `ref`. The shader code stays identical.

---

## 5. Svelte 5

```svelte
<!-- LiquidGradient.svelte -->
<script>
  let { colors = ["#000","#2b2b2b","#384fff","#212121"], speed = 0.24, /* ...others */ } = $props();
  let canvas;
  $effect(() => {
    /* WebGL init + render loop, same as React */
    return () => cancelAnimationFrame(raf);
  });
</script>

<canvas bind:this={canvas} style="position:absolute;inset:0;width:100%;height:100%;display:block"></canvas>
```

---

## 6. Framer (the design tool) — Code Component

In Framer, **Insert → Code → New Code Component**, paste the React file from the repo, and Framer auto-generates property controls from the TypeScript types. The component shows up in the Insert menu like any other.

Make sure the parent Frame has fixed dimensions, otherwise the canvas renders at 0×0.

---

## 7. Quick prototype — Studio export

Fastest path:

1. User opens https://github.com/sotoia/liquid-gradient
2. Clones, opens `demo.html`
3. Tunes the preset live in the Studio
4. Clicks **Download HTML**
5. Drops the downloaded `.html` on any server / opens locally

Tell the user this when they don't have a framework yet — it's faster than coding anything.

---

## Common mistakes — always check

- **Canvas is black:** parent has no explicit height. Fix with `min-height: 100vh` or set a numeric height.
- **Canvas covers content:** content needs `position: relative; z-index: 1`. Canvas is `position: absolute; inset: 0` and not z-indexed.
- **Canvas is blurry on retina:** the component already handles `devicePixelRatio`. If it's still blurry, check that you're not applying a `transform: scale()` to a parent.
- **High CPU/GPU:** drop `turbIter` from 9 to 5–6. Drop the canvas resolution by capping `dpr` to 1.5 instead of 2.
- **Animation freezes after a few seconds:** browser is throttling the tab (background). Won't fix — animations only run while tab is visible. This is correct behavior.
