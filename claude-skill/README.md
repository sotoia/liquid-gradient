# Liquid Gradient — Claude Code skill

A [Claude Code](https://claude.ai/code) skill that teaches Claude to integrate the [Liquid Gradient](../) shader into any web project and tune it intelligently from vague briefs like *"more calm"*, *"like Vercel"*, *"more cinematic"*.

## Install

From the root of this cloned repo:

```sh
cp -r claude-skill ~/.claude/skills/liquid-gradient
```

Or directly without cloning:

```sh
mkdir -p ~/.claude/skills/liquid-gradient
curl -L https://github.com/sotoia/liquid-gradient/archive/main.tar.gz \
  | tar -xz --strip-components=2 -C ~/.claude/skills/liquid-gradient liquid-gradient-main/claude-skill
```

Restart Claude Code (or open a new session). To check it loaded, type `/help` and look for `liquid-gradient`.

## Trigger phrases

The skill activates explicitly — it will not fire by accident on generic gradient requests. Use any of:

- `/liquid-gradient`
- *"Liquid Gradient in the hero"*
- *"add the framer hero background"*
- *"liquid background for this landing"*

## What Claude will do

1. Ask where the hero goes and what brand vibe you want
2. Pick one of **10 named presets** (`vercel`, `linear`, `framer`, `aurora`, `sunset`, `mono`, `cinematic`, `pastel`, `subtle`, `acid`) or compose a custom one from a tuning table
3. Fetch the React component (or vanilla snippet) into the right place in your project
4. Wire it into your stack — Next.js, Astro, Vue 3, Svelte 5, vanilla HTML, or Framer Code Component
5. Set up the parent container CSS (the part most people get wrong: `position: relative` + explicit height)
6. Remind you to respect `prefers-reduced-motion`

## What's inside

| File | Purpose |
|------|---------|
| `SKILL.md` | Trigger description, decision flow, parameter quick-reference, craft rules |
| `references/presets.md` | 10 named, tested configurations (copy-paste JSON) |
| `references/integration.md` | Drop-in recipes for Next.js, vanilla HTML, Astro, Vue 3, Svelte 5, Framer |
| `references/tuning.md` | Translates vague briefs ("more calm", "more brand") into uniform deltas, plus a "common pitfalls" cheat-sheet |

## Example session

```
you   > /liquid-gradient

claude > I'll add the Liquid Gradient to your hero. Quick:
         1. Which vibe — Vercel (dark + blue), Aurora (multicolor pastel),
            or Mono (B&W brutalist)? Or describe what you want.
         2. Respect prefers-reduced-motion for accessibility?
         3. Hero is a full-bleed <section>, or inside a component?

you   > vercel-ish but more calm. yes to reduced-motion. full-bleed section.

claude > Applying `vercel` preset with speed × 0.6 for the calmer feel.
         Fetching LiquidGradient.tsx into src/components/...
         Wiring into app/page.tsx hero with prefers-reduced-motion guard.
         Setting position: relative + min-height: 100vh on the parent.
         Done. Run `npm run dev` to verify.
```

## License

MIT — same as the parent repo.
