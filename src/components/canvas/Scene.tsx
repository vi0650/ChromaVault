import { Canvas } from '@react-three/fiber';
import { Environment, Preload } from '@react-three/drei';
import { Suspense } from 'react';
import { BackgroundBlobs } from './BackgroundBlobs';

export const Scene = ({ children }: { children: React.ReactNode }) => {
    return (
        <Canvas
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                pointerEvents: 'none',
                zIndex: 0
            }}
            camera={{ position: [0, 0, 10], fov: 35 }}
            dpr={[1, 2]}
        >
            <Suspense fallback={null}>
                <Environment preset="city" />
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <BackgroundBlobs />
                {children}
                <Preload all />
            </Suspense>
        </Canvas>
    );
};
