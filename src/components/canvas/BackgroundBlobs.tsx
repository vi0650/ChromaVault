import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

export const BackgroundBlobs = () => {
    const blob1 = useRef<THREE.Mesh>(null);
    const blob2 = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (blob1.current) {
            blob1.current.position.y = Math.sin(time * 0.5) * 2;
            blob1.current.rotation.x = time * 0.2;
            blob1.current.rotation.y = time * 0.3;
        }
        if (blob2.current) {
            blob2.current.position.y = Math.cos(time * 0.4) * 2;
            blob2.current.position.x = Math.sin(time * 0.3) * 2;
        }
    });

    return (
        <group>
            <Sphere ref={blob1} args={[5, 64, 64]} position={[-4, -2, -10]}>
                <MeshDistortMaterial
                    color="#581c87"
                    attach="material"
                    distort={0.4}
                    speed={1.5}
                    roughness={0.2}
                    metalness={0.8}
                />
            </Sphere>

            <Sphere ref={blob2} args={[4, 64, 64]} position={[5, 3, -15]}>
                <MeshDistortMaterial
                    color="#c026d3"
                    attach="material"
                    distort={0.5}
                    speed={2}
                    roughness={0.4}
                    metalness={0.5}
                />
            </Sphere>
        </group>
    );
};
