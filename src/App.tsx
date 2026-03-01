import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ReactLenis } from '@studio-freight/react-lenis';
import { Toaster } from 'react-hot-toast';

import { Scene } from './components/canvas/Scene';
import { SmoothScrollInit } from './components/dom/SmoothScrollInit';
import { Header } from './components/dom/Header';

import { Home } from './pages/Home';
import { VaultRoute } from './pages/VaultRoute';
import { CreatePalette } from './pages/Create';

// AnimatedRoutes must be INSIDE BrowserRouter to use useLocation
const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/vault" element={<VaultRoute />} />
                <Route path="/create" element={<CreatePalette />} />
            </Routes>
        </AnimatePresence>
    );
};

const App = () => {
    return (
        /* Lenis wraps everything so smooth scroll works globally */
        <ReactLenis root options={{ lerp: 0.08, duration: 1.5, smoothWheel: true }}>
            <SmoothScrollInit />
            <BrowserRouter>
                {/* ── Toast notifications ────────────────────────────────────────── */}
                <Toaster
                    position="bottom-right"
                    toastOptions={{
                        style: {
                            background: '#1a1a1f',
                            color: '#fff',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '12px',
                            fontSize: '14px',
                        },
                    }}
                />

                {/* ── Fixed header (z-50) ────────────────────────────────────────── */}
                <Header />

                {/* ── DOM content layer (above glass overlay) ───────────────────── */}
                <div className="w-full min-h-screen relative z-20">
                    <AnimatedRoutes />
                </div>

                {/* ── Global glass / frosted blur overlay over WebGL blobs ──────── */}
                <div className="fixed inset-0 z-10 pointer-events-none backdrop-blur-[60px] bg-black/10" />

                {/* ── WebGL layer (z-0, fixed, full-screen) ─────────────────────── */}
                <Scene>{null}</Scene>
            </BrowserRouter>
        </ReactLenis>
    );
};

export default App;
