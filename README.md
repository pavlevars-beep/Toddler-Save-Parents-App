# 🌸 Calm Little Learning World

A gentle, parent-controlled web app for toddlers aged 18 months – 3 years.
Designed to keep a child calmly engaged for a short, intentional session (5–20 min)
while parents eat, rest, or need a quiet moment.

---

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser or on your phone/tablet.

---

## Features

### Four Mini-Activities

| Activity | What the child does |
|---|---|
| 🐱 **Animal Sounds** | Tap an animal to hear its sound. Swipe left/right to see more animals. |
| 🎨 **Color Matching** | Find the matching color shape. Calm glow when correct. |
| 🔍 **Big & Small** | Tap the big one or the small one. New object pairs appear automatically. |
| 🌸 **Picture Explorer** | Tap objects in a peaceful scene. Each object says its name. |

### Parent Panel

Accessible from:
- The **⚙️ Parent Settings** button on the home screen
- A **long press (1.8 s) on the timer** in the top bar during a session

Parent controls:
- Session length: 5 / 10 / 15 / 20 minutes
- Sound on / off
- Activity mode: Mixed, Animals, Colors, Big & Small, Explorer
- Calm ending screen (recommended)
- 🍽 **Restaurant mode** — extra quiet visuals, no sound, no bright flashes

### Session End Screen

After the session timer runs out, a gentle "All done!" screen appears with a
suggestion for a real-world activity (e.g. "Give your toy a big hug!",
"Find something red in the room!").

---

## Design Philosophy

This app was built around three principles:

**1. Calm over engagement**
Every design decision prioritises the child's emotional state over screen-time
metrics. There are no streaks, levels, coins, scores, or reward loops.
Transitions are slow and soft. Colors are pastel. Sounds are quiet.

**2. Parent control, not algorithm control**
Sessions have a fixed length chosen by a parent. The app doesn't try to extend
the session or suggest "one more activity." When time is up, it gently says
goodbye.

**3. Real-world bridge**
The session-end screen always suggests a physical, offline activity — looking
around the room, hugging a toy, waving goodbye. The app is a bridge to the
real world, not a replacement for it.

---

## Adding Real Animal Sounds

The app uses synthesized Web Audio API tones as placeholders.
To replace them with real recordings:

1. Place audio files in `/public/sounds/` — e.g. `cat.mp3`, `dog.mp3`, etc.
2. Open `src/utils/sounds.ts`
3. Replace the individual `play*Sound()` functions with:

```ts
// Example for cat:
function playCatSound() {
  const audio = new Audio('/sounds/cat.mp3');
  audio.volume = 0.5;
  audio.play().catch(() => {}); // catch autoplay policy errors gracefully
}
```

Free, license-clear animal sounds: **freesound.org** (check individual licenses).

---

## Folder Structure

```
src/
├── components/
│   ├── activities/        # The four mini-activities
│   │   ├── AnimalSounds.tsx
│   │   ├── ColorMatching.tsx
│   │   ├── BigSmall.tsx
│   │   └── PictureExplorer.tsx
│   ├── animals/
│   │   └── AnimalSVGs.tsx  # Hand-drawn SVG animals
│   ├── parent/
│   │   └── ParentPanel.tsx # Parent settings slide-up panel
│   └── ui/
│       ├── ActivitySelector.tsx
│       └── SessionEndScreen.tsx
├── hooks/
│   ├── useSession.ts       # Timer + settings state
│   └── useSound.ts         # Sound helper with enabled guard
├── types/
│   └── index.ts
├── utils/
│   └── sounds.ts           # Web Audio API synthesis + docs for real audio
├── App.tsx
├── main.tsx
└── index.css
```

---

## Accessibility

- All interactive elements have `aria-label` attributes
- Minimum tap target size: 56×56 px (most are larger)
- `prefers-reduced-motion` CSS media query disables all animations
- Color is never the only indicator of state
- `aria-live` regions announce animal sounds and match results to screen readers

---

## Future Improvements

These are intentionally NOT in the current version (keeping it simple),
but are natural next steps:

| Feature | Notes |
|---|---|
| 🇷🇸 Serbian language | Add a language toggle. All text strings are already centralised — easy to extract to i18n. |
| 🎙 Parent-recorded voice | Replace synthesized sounds with recordings of the child's own parent/grandparents. Warm and developmental. |
| 📴 Offline PWA | Add a Vite PWA plugin (`vite-plugin-pwa`) to make the app installable and fully offline. |
| 📸 Custom family photos | Let parents upload photos of family members, pets, or favourite toys as activity objects. |
| 🌙 Dark/night mode | Dim the screen further and soften colors for evening sessions. |
| 🌍 More scenes | Additional Picture Explorer scenes: underwater, space, bedroom, kitchen. |
| 🎵 Lullaby mode | After the session ends, offer a gentle lullaby screen to help with nap transition. |
| 👶 Age adjustment | A "younger/older" toggle to simplify or add complexity (e.g. more animals, harder color matches). |

---

## Tech Stack

- **React 18** + **TypeScript** + **Vite**
- Zero runtime dependencies beyond React
- No tracking, no analytics, no external requests
- All sounds generated via the browser's built-in **Web Audio API**
- All visuals are pure **SVG** or **CSS** — no paid assets
