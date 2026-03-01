/**
 * VaultRoute.tsx
 * ─────────────────────────────────────────────
 * Page wrapper for the Vault. Sets up correct top padding to
 * account for the fixed header (h-16 = 64px → pt-16).
 * min-h-screen ensures the background fills the full viewport.
 */

import { motion } from 'framer-motion';
import { VaultGrid } from '../components/dom/VaultGrid';

export const VaultRoute = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="pt-20 pb-16 min-h-screen relative z-20 px-4 md:px-10 lg:px-16"
        >
            <VaultGrid />
        </motion.div>
    );
};
