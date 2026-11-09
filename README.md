# ⚡ VIGNESHWARAN // DISTRIBUTED SYSTEMS & CYBERPUNK PORTFOLIO

A modern, responsive, high-performance dark-mode developer portfolio web application built with an immersive **Three.js 3D particle background**, **glassmorphic HUD cards**, **glowing crimson red accents**, and **Firebase Firestore real-time name verification & identity registry**.

🌐 **Live Application Preview:** [Launch Cyber Portfolio](https://antigravity.luch.dev/site/9ae2b0d4-cfdb-4773-85be-b254ec499038/22129fd0984a773f71a6dcb1/)

---

## 🚀 Key Features

### 1. 🌌 3D Interactive Particle Matrix (Three.js)
- **Volumetric Cyber Grid**: Over 2,600 floating crimson (`#ff2a4b`), ruby (`#e60000`), and spark-white particles generated with procedural radial glow maps.
- **Smooth Parallax Momentum**: Camera and particle cloud dynamically track mouse movements and mobile touch gestures with easing (`lerp`).
- **Holographic Geometries**: Rotating concentric wireframe icosahedrons and torus rings undulating in 3D depth space.
- **Hardware-Optimized**: Caps `devicePixelRatio` at `2` and scales particle counts on mobile devices to prevent GPU throttling.

### 2. 🛡️ User Registration & Name Verification System (Firebase)
- **Instant Firestore Verification**: Real-time debounce check queries Firestore to confirm if a handle is already taken or cleared for reservation.
- **Visual Status Banners**:
  - `IDLE`: Awaiting user input
  - `CHECKING`: Real-time query to Firestore index
  - `AVAILABLE`: Neon green confirmation `ACCESS CLEARED`
  - `CONFLICT`: Glowing red alert `ACCESS DENIED: Handle already provisioned`
- **Identity Provisioning**: Generates a cryptographic verification hash (e.g. `0x8f4c...d81a`), clearance level, and stores the identity record.
- **Interactive Database Registry Roster**: Glassmorphic live table displaying registered handles, roles, timestamps, and verification tokens with instant search filtering.
- **Dual-Mode Persistence**: Works out-of-the-box in **Zero-Config Sandbox Mode** (with pre-seeded handles like `vortex_core`, `synapse_9`) and seamlessly switches to **Live Firebase Cloud** when project keys are provided.

### 3. 💻 Interactive Cyber Terminal & Diagnostic Shell
- Mini terminal in the Hero section with live telemetry stream.
- Full interactive command shell supporting:
  - `help` — Lists available kernel instructions
  - `whoami` — Architect profile & background
  - `verify <handle>` — Tests handle availability in database
  - `register <handle> <passkey>` — Direct CLI identity provisioning
  - `projects` — Inspects flagship distributed systems
  - `stats` — Displays live engine benchmarks (<850µs latency, 1.4M ops/sec)
  - `audio on|off` — Toggles procedural audio feedback
  - `ping` — Measures round-trip execution latency
  - `clear` — Flushes terminal buffer

### 4. 🎛️ Procedural Web Audio Synthesizer
- Built using the native **Web Audio API** with zero external audio assets.
- Generates high-frequency hover ticks, crisp button clicks, rising arpeggiated success chimes, and warning alerts programmatically.
- Audio toggle located in the top telemetry HUD bar (muted by default).

### 5. 💎 High-End Cyberpunk Glassmorphic UI
- **Palette**: Dark void background (`#050508`), glowing crimson highlights (`#ff2a4b`, `#ff3333`), and cyan telemetry markers (`#00f0ff`).
- **Glassmorphism**: Multi-layered backdrop blurs (`backdrop-filter: blur(16px)`), semi-transparent surfaces, and cyber-angled polygon corners.
- **Responsive Layout**: Designed for seamless rendering across desktop monitors, tablets, and mobile devices.

---

## 🛠️ Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend Core** | HTML5, Modern CSS3 (Variables, Grid, Flexbox, Keyframes), ES6+ JavaScript |
| **3D Graphics** | Three.js (r128), WebGL, Procedural Canvas Textures |
| **Database & Auth** | Firebase SDK v10 (Firestore & Authentication) + Sandbox Persistence Engine |
| **Audio Synthesis**| Web Audio API (Sine, Square, Sawtooth procedural oscillators) |
| **Typography** | Orbitron, Space Grotesk, JetBrains Mono |
| **Icons** | Font Awesome 6.5.2 |

---

## 📂 File Structure

```
├── index.html                # Main application layout, HUD, sections, and modals
├── css/
│   └── style.css             # Glassmorphism, cyber neon accents, responsive layout
├── js/
│   ├── particles.js          # Three.js 3D particle background and parallax tracking
│   ├── firebase-service.js   # Firestore querying, name verification, identity store
│   ├── sound-fx.js           # Procedural Web Audio API sound generator
│   └── app.js                # Terminal REPL, roster filtering, UI orchestration
└── README.md                 # System documentation & architectural overview
```

---

## ⚙️ Connecting Your Live Firebase Project

1. Click **FIREBASE CONFIG** in the top HUD or registry section.
2. Enter your Firebase project details (`apiKey`, `projectId`, `authDomain`).
3. Click **CONNECT LIVE FIREBASE**. The top HUD status indicator will immediately turn green: `FIRESTORE: LIVE CLOUD`.
4. Ensure your Firestore security rules allow reading and writing to the `identities` collection:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /identities/{document=**} {
         allow read, write: if true; // Or configure your custom auth constraints
       }
     }
   }
   ```
