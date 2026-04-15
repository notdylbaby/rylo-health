---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, or applications. Generates creative, polished code that avoids generic AI aesthetics.
---

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.

The user provides frontend requirements: a component, page, application, or interface to build. They may include context about the purpose, audience, or technical constraints.

## Design Thinking

Before coding, understand the context and commit to a BOLD aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. Use these for inspiration but design one that is true to the aesthetic direction.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work — the key is intentionality, not intensity.

Then implement working code (HTML/CSS/JS, React, Vue, etc.) that is:
- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail

## Frontend Aesthetics Guidelines

- **Typography**: Avoid generic fonts (Arial, Inter, Roboto, system fonts). Pair a distinctive display font with a refined body font.
- **Color & Theme**: Commit to a cohesive aesthetic. Use CSS variables. Dominant colors with sharp accents outperform timid, evenly-distributed palettes.
- **Motion**: CSS-only for HTML; Motion library for React. One well-orchestrated page load with staggered reveals beats scattered micro-interactions. Surprise on scroll and hover.
- **Spatial Composition**: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density.
- **Backgrounds & Visual Details**: Gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, custom cursors, grain overlays.

NEVER: purple gradients on white, predictable layouts, cookie-cutter patterns, or converging on the same font choices (e.g. Space Grotesk) across builds.

Match implementation complexity to the vision — maximalist needs elaborate code, minimalist needs restraint and precision.

## Scroll-Driven Website Guidelines

When building scroll-driven animated sites:

### Typography Scale
- Hero headings: 6rem+, line-height 0.9–1.0, weight 700–800
- Section headings: 3rem+, weight 600–700
- Marquee text: 10–15vw, uppercase, letterspaced
- Section labels: 0.7rem, uppercase, letterspaced 0.15em+, muted — e.g. "001 / Features"
- Size, weight, and color ARE the structure — no card containers needed

### No Cards, No Boxes
- NEVER use glassmorphism cards, frosted glass, or visible containers around text
- Text sits directly on background — clean, confident, editorial
- Readability via font weight (600+) and text-shadow if needed

### Color Zones
- Background must shift between sections (light → dark → accent → light)
- CSS variables: `--bg-light`, `--bg-dark`, `--bg-accent`, `--text-on-light`, `--text-on-dark`
- Transitions via GSAP, not CSS transitions

### Layout Variety (minimum 3 per page)
1. Centered — hero, CTAs
2. Left-aligned — feature + product right
3. Right-aligned — alternating features
4. Full-width — marquee, stats rows
5. Split — text one side, visual the other

Never repeat the same layout in consecutive sections.

### Animation Choreography
- Every section uses a DIFFERENT entrance (fade-up, slide-left, slide-right, scale-up, clip-path reveal)
- Stagger delays: 0.08–0.12s between items
- Sequence: label → heading → body → CTA
- At least one pinned section with internal animation
- At least one oversized text element moving horizontally on scroll

### Stats & Numbers
- 4rem+ font size
- Count up via GSAP (never static)
- Suffix element (x, M, %) at smaller size
- Labels below in small caps or uppercase muted text
