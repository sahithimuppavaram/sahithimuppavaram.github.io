# Anime Portfolio — Design Ideas

## Three Stylistic Approaches

### 1. Grand Line Navigator
**Theme:** A One Piece-first adventure portfolio where the entire site feels like sailing the Grand Line. Sections are "islands" you sail to, with a parallax ocean canvas and floating UI panels.
**Probability:** 0.07

### 2. Tri-World Portal (CHOSEN)
**Theme:** A theme-switcher portal where the entire world transforms between 3 anime universes. A persistent "World Selector" orb lets you switch between One Piece, Attack on Titan, and Sakura at any time — the background, particles, colors, fonts, and UI language all morph with a cinematic transition.
**Probability:** 0.04

### 3. Anime Scroll RPG
**Theme:** A vertical RPG-style scroll where each section is a different "chapter" with its own anime art style, like flipping through manga volumes.
**Probability:** 0.02

---

## CHOSEN: Tri-World Portal

### Design Movement
**Immersive World-Switching 3D Game UI** — inspired by open-world game HUDs (Genshin Impact, Zelda BOTW) combined with anime scene art. The portfolio IS the world, not a document about the world.

### Core Principles
1. **The World IS the UI** — backgrounds are not decorations, they are the environment. Content panels float in the world.
2. **Theme Coherence** — every color, font, particle, and label changes per theme. Nothing breaks immersion.
3. **Game-Like Navigation** — scroll or click to "travel" between sections. Side nav acts as a mini-map.
4. **Cinematic Transitions** — theme switches trigger a full-screen flash/wipe animation before the new world loads.

### Color Philosophy
- **One Piece:** Warm ocean blues (#0EA5E9), golden sunrise (#F59E0B), tropical green (#22C55E), bright white
- **Attack on Titan:** Military olive (#4D7C0F), stone grey (#6B7280), Survey Corps teal (#0D9488), blood red accent (#DC2626)
- **Sakura:** Soft pink (#F9A8D4), deep indigo night (#312E81), warm gold (#D97706), white blossom

### Layout Paradigm
Full-viewport parallax canvas with floating glass-morphism content panels. The 3D canvas uses CSS perspective transforms and layered parallax (sky, midground, foreground). Navigation is a vertical side-rail "mini-map" with section dots. A theme switcher floats in the top-right corner as an orb/button cluster.

### Signature Elements
1. **Floating World Elements** — ships bobbing, petals drifting, scouts swinging — CSS-animated sprites layered over the parallax background
2. **Theme Orb Switcher** — a glowing orb cluster in the corner showing 3 anime icons; clicking triggers a full-screen wipe transition
3. **Section Panels** — frosted glass cards with theme-colored borders that slide in from the side as you scroll

### Interaction Philosophy
Every interaction should feel like a game action. Hover = glow. Click = flash. Scroll = world movement. Theme switch = cinematic cut.

### Animation
- Parallax layers move at different speeds on scroll (sky 0.1x, mid 0.3x, foreground 0.6x)
- Floating sprites (ship, petals, scouts) animate on infinite loop
- Section panels slide in with spring physics (framer-motion)
- Theme transition: 300ms white/color flash → background swap → particle system change → 200ms fade in
- Particles: bubbles (OP), dust motes (AoT), sakura petals (Sakura) — canvas-based

### Typography System
- **One Piece:** `Bangers` (display) + `Nunito` (body) — bold, fun, adventurous
- **Attack on Titan:** `Oswald` (display) + `Source Sans Pro` (body) — military, sharp, urgent
- **Sakura:** `Noto Serif JP` (display) + `Lato` (body) — elegant, graceful, traditional

### Brand Essence
*A portfolio that doesn't just show your work — it takes you on an adventure through it.* Adventurous · Playful · Technical

### Brand Voice
- Headlines feel like quest names: "The Grand Line of Skills", "Beyond the Walls", "Beneath the Blossoms"
- CTAs are invitations: "Set Sail", "Join the Corps", "Enter the Garden"
- Ban: "Welcome to my portfolio", "Here are my projects"

### Signature Brand Color
One Piece gold: `#F59E0B` — the color of treasure, adventure, and Luffy's hat
