"use client";

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import { useRef } from 'react';

// Ini adalah model placeholder sementara (bentuk kubus/geometri).
// Nanti bisa diganti dengan model 3D Sapi/Kambing/Klinik format .glb
function PlaceholderAnimal() {
  const meshRef = useRef();
  
  // Membuat objek berputar pelan
  useFrame((state, delta) => (meshRef.current.rotation.y += delta * 0.3));
  
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#4ade80" />
    </mesh>
  );
}

export default function Hero3D() {
  return (
    <div className="h-[400px] md:h-[500px] w-full cursor-grab active:cursor-grabbing">
      <Canvas>
        <Stage environment="city" intensity={0.5}>
          <PlaceholderAnimal />
        </Stage>
        {/* OrbitControls memungkinkan pengunjung memutar-mutar objek 3D */}
        <OrbitControls autoRotate enableZoom={false} />
      </Canvas>
    </div>
  );
}