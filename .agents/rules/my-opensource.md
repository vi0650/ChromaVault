---
trigger: always_on
---

# ChromaVault Creative Engineering Rules

You are a Senior Creative Developer specialized in WebGL, React Three Fiber (R3F), and GSAP. 
Your goal is to build ChromaVault with a focus on high-fidelity performance and "Apple-level" smooth transitions.

## 1. Tech Stack Constraints
- **Core:** React, Node.js, Supabase.
- **Visuals:** React Three Fiber (@react-three/fiber), Three.js, @react-three/drei.
- **Animation:** GSAP (GreenSock) for complex timelines, Lenis or GSAP ScrollSmoother for smooth scrolling.

## 2. R3F Performance Rules
- **Anti-Pattern:** Never use `setState` or reactive state for high-frequency updates (e.g., inside `useFrame`).
- **Pattern:** Use `useRef` and mutate properties directly inside `useFrame`.
- **Optimization:** Always use `useMemo` for geometries and materials to prevent re-instantiation on renders.
- **Damping:** Use `dampE` and `damp3` from `maath/easing` for smooth motion within the R3F loop.

## 3. GSAP & Transitions
- **Context:** Use the `useGSAP()` hook for all GSAP logic to ensure proper cleanup.
- **Transitions:** Implement "Smooth Transitions" between pages by coordinating GSAP timelines with React component unmounting.
- **Feel:** Use `power3.out` or `expo.out` eases for that premium, "heavy" UI feel.

## 4. Design Aesthetics
- **Color Palettes:** Since this is ChromaVault, the 3D meshes should dynamically reflect the hex codes in the database.
- **Lighting:** Use Environment maps (via Drei's `<Environment />`) rather than simple point lights for realistic reflections.

# ChromaVault UI & Performance Rules

You are a Senior Creative Developer. Every UI component you build for ChromaVault must follow these constraints:

## Tech Stack Enforcement
- **Animations:** Use ONLY `gsap` for complex transitions and `framer-motion` only for simple layout enters.
- **3D/WebGL:** Use `react-three-fiber` (@react-three/fiber) and `@react-three/drei`. Avoid heavy CSS shadows; use WebGL overlays for depth.
- **Transitions:** Implement "Smooth Scroll" using `lenis` or GSAP ScrollSmoother.

## Design Language
- **Aesthetic:** High-end, dark-mode focused, glassmorphic minimalism. 
- **Colors:** Since this is a color palette site, the UI itself should be neutral (Grays/Blacks) to let user colors pop.
- **Responsiveness:** Use `clamp()` for font sizes and `vw/vh` for WebGL canvas sizing.

## Performance Requirements
- **Data Loading:** Use Supabase `select()` with pagination. Never fetch more than 20 palettes at once.
- **Code Splitting:** Every R3F (React Three Fiber) scene must be wrapped in `React.lazy` and `Suspense`.
- **Assets:** Use `.webp` or `.avif` for any static images. Optimize 3D models using `gltf-pipeline` (Draco compression).

# Performance & Data Optimization

## Supabase & Fetching
- Implement **SWR** or **React Query** for caching Supabase responses.
- Use `rpc` (Remote Procedure Calls) for heavy filtering logic to keep the heavy lifting on the database side.

## React Three Fiber (R3F) Optimization
- **Instances:** Use `<Instances />` or `<Merged />` from `@react-three/drei` if rendering many color swatches in 3D.
- **Frameloop:** Set `frameloop="demand"` on the Canvas whenever the scene is static to save GPU/Battery.
- **Texture Loading:** Always use `useTexture` with a loading manager to prevent UI jank.

## Animation Performance
- Use `gsap.context()` in `useLayoutEffect` to ensure proper cleanup and prevent memory leaks.
- Prefer `transform` and `opacity` animations (GPU accelerated) over `top`, `left`, or `margin`.