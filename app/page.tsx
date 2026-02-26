"use client"; // Tambahkan baris ini di paling atas!

import dynamic from 'next/dynamic';

// Import komponen 3D secara dinamis dan matikan SSR
const Experience = dynamic(() => import('@/Components/Experience'), { 
  ssr: false,
  loading: () => <div className="flex h-screen w-screen items-center justify-center text-green-600 font-bold text-xl">Memuat Peternakan 3D...</div>
});

export default function Home() {
  return (
    <main className="w-full h-screen overflow-hidden bg-sky-100">
      <Experience />
    </main>
  );
}