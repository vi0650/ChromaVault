import { useEffect } from 'react';
import { useLenis } from '@studio-freight/react-lenis';

export const SmoothScrollInit = () => {
    const lenis = useLenis();

    useEffect(() => {
        if (lenis) {
            // Setup Lenis specific side-effects here if needed
        }
    }, [lenis]);

    return null;
};
