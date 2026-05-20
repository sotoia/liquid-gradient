# Liquid Gradient — Tuning guide

How to translate vague user briefs into uniform deltas. Always start from the **closest preset** in `presets.md`, then apply small adjustments. Improvising from defaults usually overshoots.

---

## Brief → uniforms

| User says | Adjust |
|-----------|--------|
| "Calmer" / "more relaxed" | `speed × 0.5`, `turbAmp × 0.8`, `waveFreq × 0.85` |
| "More energetic" / "alive" | `speed × 1.6`, `turbAmp × 1.2`, `waveFreq × 1.2` |
| "More premium" / "expensive" | `ditherMode: 2`, `dither: 0.08–0.12`, `contrast: 1.25–1.4`, `saturation: 1.1` |
| "Cleaner" / "less noise" | `ditherMode: 1`, `dither: 0.02–0.04`, `turbIter: 4–5` |
| "Darker mood" | `exposure: 0.65–0.75`, add a near-black color to the palette as anchor |
| "Brighter / poppy" | `exposure: 1.0–1.1`, `saturation: 1.3–1.5` |
| "More monochrome" | `saturation: 0.0–0.4`, swap palette to grayscale variants of brand color |
| "More dramatic" | `contrast: 1.4–1.6`, `turbAmp: 1.3+`, dark anchor color |
| "Subtler" / "doesn't distract" | Apply `subtle` preset, then reduce `speed` further to 0.08 |
| "More cinematic" | `ditherMode: 2`, `dither: 0.12–0.15`, `loop: 8` for slow seamless cycle |
| "More glassy" / "modern" | Lower `turbAmp` to 0.5–0.8, raise `scale` to 1.5+, `dither: 0.02` |
| "Brand color X" | Put X as the 3rd color (the accent slot), put black/dark as 1st and 4th, neutral dark gray as 2nd |
| "I want movement but no motion sickness" | `speed: 0.15–0.25`, `jellify: 0`, `turbAmp ≤ 1.0` |

---

## Common pitfalls

### "Too saturated, looks AI-generated"
- Drop `saturation` to 0.9–1.1
- Reduce palette to 3 colors instead of 4
- Use one bright accent and two neutral darks, not three brights

### "Looks like a Windows screensaver"
- The default rainbow palette (azul/violet/pink/orange) is the culprit
- Use 2 colors of the same hue family + 1 neutral
- Drop `turbAmp` to 1.0 or below

### "Looks dead, no movement visible"
- `speed` is below 0.1, raise to 0.18+
- `turbAmp` below 0.5, raise to 1.0+
- Or palette has too-similar lightness — push contrast between colors

### "Banding visible / ugly stripes"
- `ditherMode: 0` is causing it — set to 1 or 2
- `dither` too low — raise to 0.05–0.10

### "GPU pegged at 100%"
- `turbIter` is at 11–13 — drop to 5–7
- Canvas is rendering at 4K+ — cap `dpr` in the resize function to 1.5
- The hero is full-screen on a 5K display — consider clamping max-width

---

## Picking a palette

The shader interpolates colors in **Oklab/Lch** (perceptually uniform), so unlike CSS gradients you don't get muddy mid-tones. Rules of thumb:

1. **Anchor first**: pick the darkest color (almost-black). This carries the depth.
2. **Brand color second**: the saturated brand hue, full intensity. This is the "wow" moment.
3. **Neutral bridge** between them: a mid-gray-but-tinted-toward-brand color. Smooths the transition.
4. **Optional accent**: a complementary or analogous hue, lower saturation than brand. Adds dimensionality.

Avoid:
- Two colors with same lightness — they blur into one band
- More than 5 colors — banding even in Oklab
- Pure primary colors (#ff0000, #00ff00) at full saturation unless you want acid/web3 vibe

---

## Animation entry choices (text on top)

When the hero has text overlaid, match the text-appear animation to the gradient mood:

| Gradient mood | Text animation |
|---------------|----------------|
| `vercel`, `framer`, `linear` (premium tech) | `blur` for title, `fade` for sub |
| `subtle`, `mono` (editorial) | `mask` for title, `fade` for sub |
| `aurora`, `pastel` (creative) | `slide` for title, `word` for sub |
| `sunset`, `cinematic` (drama) | `char` for title, `fade` for sub |
| `acid`, `framer` (poppy) | `scale` for title, `slide` for sub |

These are documented in the Studio (`demo.html`) and exported in the downloaded HTML.

---

## When in doubt — defer to the Studio

If you've adjusted 5+ uniforms and the user is still unhappy, tell them:

> "Let's tune this visually. Clone the repo, run `open demo.html`, you'll get a live panel with every slider. When it looks right, click **Download HTML** or **Copy CONFIG** and we'll wire that exact preset into your project."

The Studio exists precisely for this — don't iterate verbally on 16 numerical sliders.
