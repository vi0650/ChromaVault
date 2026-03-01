import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { ColorPalette } from '../../types';
import * as THREE from 'three';
import { dampE } from 'maath/easing';

interface PaletteNodeProps {
    palette: ColorPalette;
    itemRef: React.RefObject<HTMLDivElement>;
}

export const PaletteNode = ({ palette, itemRef }: PaletteNodeProps) => {
    const groupRef = useRef<THREE.Group>(null);
    const meshRefs = [
        useRef<THREE.Mesh>(null),
        useRef<THREE.Mesh>(null),
        useRef<THREE.Mesh>(null),
        useRef<THREE.Mesh>(null),
    ];

    /* 
     * This logic connects the DOM element's bounding rect to the WebGL Canvas.
     * On resize/scroll, the 3D meshes map directly behind the HTML elements.
     * For the initial step, we will use a relative layout grid,
     * but structure the component to easily support 'useFrame' syncing later.
     */

    useFrame((state, delta) => {
        if (!groupRef.current || !itemRef.current) return;

        // Gentle hover animation independent of DOM
        const t = state.clock.getElapsedTime();
        const yRotation = Math.sin(t * 0.5 + parseFloat(palette.id)) * 0.05;
        const xRotation = Math.cos(t * 0.3 + parseFloat(palette.id)) * 0.05;

        dampE(groupRef.current.rotation, [xRotation, yRotation, 0], 0.25, delta);
    });

    // Calculate generic position - this will be heavily expanded when linking
    // the DOM exact rects using react-spring or tunnel in a later step.
    return (
        <group ref={groupRef}>
            {palette.colors.map((color, i) => (
                <group key={i} position={[0, 1.5 - i * 1, 0]}>
                    <RoundedBox
                        ref={meshRefs[i]}
                        args={[3.8, 0.9, 0.2]}
                        radius={0.05}
                        smoothness={4}
                    >
                        <meshPhysicalMaterial
                            color={color}
                            roughness={0.1}
                            metalness={0.3}
                            clearcoat={1}
                            clearcoatRoughness={0.1}
                        />
                    </RoundedBox>
                </group>
            ))}
        </group>
    );
};
