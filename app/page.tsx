"use client";

import dynamic from 'next/dynamic';

// Import komponen 3D dengan mematikan SSR (Server-Side Rendering)
const Scene3D = dynamic(() => import('../Components/Experience'), {
  ssr: false,
  loading: () => (
    <div className="w-screen h-screen flex items-center justify-center bg-[#ffedd5] font-bold text-amber-700">
      Memuat Klinik 3D...
    </div>
  ),
});

export default function Home() {
  return (
    <main className="w-full h-full">
      <Scene3D />
    </main>
  );
}