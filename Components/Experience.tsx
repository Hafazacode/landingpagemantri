"use client";

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, useScroll, Environment, Float, useGLTF, Sparkles, Sky, ContactShadows } from '@react-three/drei';
import { useRef, useEffect, RefObject, Suspense, useState } from 'react';
import * as THREE from 'three';

// ==========================================
// 1. KOMPONEN LOAD MODEL 3D
// ==========================================

function ModelSapi(props: any) {
  const { scene } = useGLTF('/sapi.glb');
  return <primitive object={scene.clone()} {...props} castShadow />;
}
function ModelKambing(props: any) {
  const { scene } = useGLTF('/kambing.glb');
  return <primitive object={scene.clone()} {...props} castShadow />;
}
function ModelPagar(props: any) {
  const { scene } = useGLTF('/pagar.glb');
  return <primitive object={scene.clone()} {...props} castShadow />;
}
function ModelSuntikan(props: any) {
  const { scene } = useGLTF('/Syringe.glb');
  return <primitive object={scene.clone()} {...props} castShadow />;
}

useGLTF.preload('/sapi.glb');
useGLTF.preload('/kambing.glb');
useGLTF.preload('/pagar.glb');

// ==========================================
// DATA INSEMINASI
// ==========================================
const inseminasiData = {
  sapi: [
    { nama: "Sapi Simental", img: "https://placehold.co/400x300/d97706/ffffff?text=Simental", desc: "Bibit unggul pedaging. Pertumbuhan otot sangat cepat." },
    { nama: "Sapi Limousin", img: "https://placehold.co/400x300/d97706/ffffff?text=Limousin", desc: "Kualitas daging premium dengan perototan padat." }
  ],
  kambing: [
    { nama: "Kambing Boer", img: "https://placehold.co/400x300/16a34a/ffffff?text=Boer", desc: "Rajanya kambing pedaging. Badannya gempal." },
    { nama: "Kambing Etawa", img: "https://placehold.co/400x300/16a34a/ffffff?text=Etawa", desc: "Kambing dwiguna (perah & pedaging)." }
  ]
};

// ==========================================
// 2. KOMPONEN DUNIA PETERNAKAN
// ==========================================

function FarmWorld({ isMobile }: { isMobile: boolean }) {
  // Jarak X diatur lebih rapat jika di HP agar tidak keluar layar
  const xOffset = isMobile ? 3.5 : 6; 

  return (
    <>
      <Sky distance={450000} sunPosition={[5, 1, 8]} inclination={0.2} azimuth={0.25} rayleigh={1.5} turbidity={5} />
      <Sparkles count={isMobile ? 500 : 1000} scale={40} size={3} speed={0.2} opacity={0.6} color="#fcd34d" position={[0, 3, -40]} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[200, 400]} />
        <meshStandardMaterial color="#65a30d" roughness={0.9} /> 
      </mesh>

      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.1}>
        <ModelSuntikan position={[-7, 2, -20]} rotation={[0, 0, -Math.PI / 4]} scale={isMobile ? 4 : 7.0} />
      </Float>
      <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.1}>
        <ModelSapi position={[12, -2, -40]} rotation={[0, -Math.PI / 3, 0]} scale={isMobile ? 0.8 : 1.2} />
      </Float>

      {/* 1. SAPI (Kiri) */}
      <group position={[-xOffset, -2, -72]}>
        <mesh position={[0, 0.05, 0]} receiveShadow><cylinderGeometry args={[2.5, 2.5, 0.1, 32]} /><meshStandardMaterial color="#d97706" /></mesh>
        <Float speed={2} rotationIntensity={0.1} floatIntensity={0.1}>
          <ModelSapi rotation={[0, Math.PI / 6, 0]} scale={0.8} />
        </Float>
      </group>

      {/* 2. KAMBING (Kanan) */}
      <group position={[xOffset, -2, -72]}>
        <mesh position={[0, 0.05, 0]} receiveShadow><cylinderGeometry args={[2.5, 2.5, 0.1, 32]} /><meshStandardMaterial color="#16a34a" /></mesh>
        <Float speed={2} rotationIntensity={0.1} floatIntensity={0.1}>
          <ModelKambing rotation={[0, -Math.PI / 6, 0]} scale={0.8} /> 
        </Float>
      </group>

      {/* PAGAR */}
      <ModelPagar position={[-8, -2, -10]} rotation={[0, Math.PI / 2, 0]} scale={2} />
      <ModelPagar position={[-8, -2, -30]} rotation={[0, Math.PI / 2, 0]} scale={2} />
      <ModelPagar position={[8, -2, -15]} rotation={[0, Math.PI / 2, 0]} scale={2} />
      <ModelPagar position={[8, -2, -35]} rotation={[0, Math.PI / 2, 0]} scale={2} />

      <ContactShadows position={[0, -1.9, 0]} opacity={0.5} scale={150} blur={2.5} far={4} color="#000000" />
    </>
  );
}

// ==========================================
// 3. PENGENDALI KAMERA
// ==========================================

function SceneController({ htmlRefs, activeAnimal, isMobile }: { htmlRefs: RefObject<HTMLDivElement | null>[], activeAnimal: string, isMobile: boolean }) {
  const scroll = useScroll();
  const { scene } = useThree();

  useFrame((state, delta) => {
    const offset = scroll.offset;
    const targetZ = THREE.MathUtils.lerp(10, -130, offset);
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, targetZ, 4, delta);

    // Kamera geser menyesuaikan layout HP vs Desktop
    const xOffsetMobile = isMobile ? 3.5 : 6;
    const isCarouselSection = offset > 0.4 && offset < 0.7;
    let targetX = 0;
    
    if (isCarouselSection) {
      if (activeAnimal === 'sapi') targetX = -xOffsetMobile;
      if (activeAnimal === 'kambing') targetX = xOffsetMobile;
    }
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, targetX, 4, delta);

    const [ref1, ref2, ref3, ref4] = htmlRefs;

    // Animasi UI Layer 1-4
    if (ref1.current) {
      const opacity = 1 - scroll.range(0, 0.15); 
      ref1.current.style.opacity = `${opacity}`;
      ref1.current.style.transform = `translate(-50%, calc(-50% - ${scroll.range(0, 0.15) * 50}px)) scale(${1 + scroll.range(0, 0.15) * 0.1})`;
      ref1.current.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none';
    }
    if (ref2.current) {
      const opacity = scroll.curve(0.15, 0.25); 
      ref2.current.style.opacity = `${opacity}`;
      ref2.current.style.transform = `translate(-50%, -50%) scale(${0.95 + scroll.range(0.15, 0.25) * 0.05})`;
      ref2.current.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none';
    }
    if (ref3.current) {
      const opacity = scroll.curve(0.45, 0.25); 
      ref3.current.style.opacity = `${opacity}`;
      ref3.current.style.transform = `translate(-50%, calc(-50% + ${(1 - opacity) * 30}px))`;
      ref3.current.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none';
    }
    if (ref4.current) {
      const opacity = scroll.range(0.75, 0.25); 
      ref4.current.style.opacity = `${opacity}`;
      ref4.current.style.transform = `translate(-50%, -50%) scale(${0.9 + scroll.range(0.75, 0.25) * 0.1})`;
      ref4.current.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none';
    }
  });

  return null;
}

// ==========================================
// 4. KOMPONEN UTAMA
// ==========================================

export default function Experience() {
  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);
  const ref3 = useRef<HTMLDivElement>(null);
  const ref4 = useRef<HTMLDivElement>(null);

  const [activeAnimal, setActiveAnimal] = useState<'sapi'|'kambing'>('sapi');
  const [isMobile, setIsMobile] = useState(false);

  // Deteksi ukuran layar saat di client
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // Cek awal
    window.addEventListener('resize', handleResize);
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('resize', handleResize);
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="w-screen h-screen relative overflow-hidden font-sans bg-[#ffedd5]">
      
      {/* KANVAS 3D */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <Canvas shadows camera={{ position: [0, 1.5, 10], fov: isMobile ? 65 : 55 }}>
          <fog attach="fog" args={['#ffedd5', 15, 50]} />
          <Environment preset="sunset" />
          <directionalLight castShadow position={[10, 20, 15]} intensity={1.5} shadow-mapSize={[2048, 2048]} color="#fdf08a" />
          <ambientLight intensity={0.5} color="#fed7aa" />

          <Suspense fallback={null}>
            <ScrollControls pages={5} damping={0.25}>
              <FarmWorld isMobile={isMobile} />
              <SceneController htmlRefs={[ref1, ref2, ref3, ref4]} activeAnimal={activeAnimal} isMobile={isMobile} />
            </ScrollControls>
          </Suspense>
        </Canvas>
      </div>

      {/* UI LAYER */}
      <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none text-slate-800">
        
        {/* HALAMAN 1: HERO */}
        <div ref={ref1} className="absolute top-1/2 left-1/2 flex flex-col md:flex-row items-center justify-between w-[90vw] max-w-6xl pointer-events-auto gap-8 md:gap-0" style={{ transform: 'translate(-50%, -50%)' }}>
          <div className="text-center md:text-left md:w-1/2 z-10">
            <h2 className="text-amber-700 font-semibold tracking-widest uppercase text-xs md:text-sm mb-2 md:mb-4 drop-shadow-sm">Klinik Hewan Spesialis</h2>
            <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-8xl font-black text-slate-900 leading-[1.05] mb-4 md:mb-6 drop-shadow-lg">
              Mantri <br className="hidden md:block"/><span className="text-amber-600 italic">Bapak Edy.</span>
            </h1>
            <p className="text-base md:text-xl text-slate-700 font-medium mb-6 md:mb-10 max-w-md mx-auto md:mx-0 leading-relaxed bg-white/30 p-4 md:p-5 rounded-2xl backdrop-blur-md border border-white/50">
              Kesehatan ternak adalah investasi. Kami hadir memastikan aset berharga Anda selalu dalam kondisi prima.
            </p>
          </div>
          <div className="relative md:w-1/2 flex justify-center md:justify-end">
            <div className="absolute top-5 right-5 md:top-10 md:right-10 w-40 h-40 md:w-72 md:h-72 bg-amber-400 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse"></div>
            {/* Ukuran gambar dikecilkan untuk mobile agar tidak makan tempat */}
            <div className="relative w-56 h-64 md:w-[28rem] md:h-[32rem] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white transform md:rotate-3 transition-transform hover:rotate-0 duration-500">
               <img src="/fotobapak.png" alt="Foto Mantri Bapak" className="w-full h-full object-cover" />
               <div className="absolute bottom-4 left-[-1rem] md:bottom-6 md:left-[-3rem] bg-white/90 backdrop-blur-md px-4 py-2 md:px-6 md:py-3 rounded-2xl shadow-xl border border-white/50 transform rotate-[-6deg]">
                  <p className="text-xs md:text-sm font-bold text-slate-800">⭐ Berpengalaman 15+ Tahun</p>
               </div>
            </div>
          </div>
        </div>

        {/* HALAMAN 2: PREVENTIF */}
        <div ref={ref2} className="absolute top-1/2 left-1/2 opacity-0 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12 w-[90vw] max-w-5xl bg-white/70 backdrop-blur-2xl p-6 md:p-16 rounded-[2rem] md:rounded-[3rem] shadow-xl border border-white/60 pointer-events-auto" style={{ transform: 'translate(-50%, -50%)' }}>
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl font-black text-slate-900 mb-2 md:mb-6 leading-tight">Perawatan <br className="hidden md:block"/><span className="text-amber-600 italic">Preventif.</span></h2>
          </div>
          <div className="md:w-1/2 text-center md:text-left">
            <p className="text-base md:text-2xl text-slate-600 leading-relaxed font-medium">
              Sapi dan kambing butuh perhatian ekstra. Kami melakukan pengecekan gizi rutin, pemberian vitamin berkala, dan vaksinasi.
            </p>
          </div>
        </div>

        {/* HALAMAN 3: INSEMINASI (Ditambah Scroll Internal untuk HP) */}
        <div ref={ref3} className="absolute top-1/2 left-1/2 opacity-0 flex flex-col items-center text-center w-[95vw] max-w-5xl max-h-[85vh] overflow-y-auto overflow-x-hidden p-2 pointer-events-auto scrollbar-hide" style={{ transform: 'translate(-50%, -50%)' }}>
          
          <div className="bg-white/80 backdrop-blur-2xl p-4 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-xl border border-white/60 w-full mb-4 shrink-0">
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl md:text-4xl font-black text-slate-900 mb-2">
              Inseminasi <span className={activeAnimal === 'sapi' ? "text-amber-600 italic" : "text-green-600 italic"}>Buatan.</span>
            </h2>
            <p className="text-sm md:text-lg text-slate-600 mb-4 md:mb-6 font-medium">
              Pilih jenis hewan untuk melihat ketersediaan bibit unggul:
            </p>
            <div className="flex justify-center gap-3 md:gap-8">
              <button 
                onClick={() => setActiveAnimal('sapi')} 
                className={`px-5 py-2 md:px-8 md:py-3 rounded-full text-sm md:text-base font-bold transition-all duration-300 ${activeAnimal === 'sapi' ? 'bg-amber-500 text-white shadow-lg scale-105 md:scale-110' : 'bg-slate-200 text-slate-600'}`}
              >
                🐄 Sapi
              </button>
              <button 
                onClick={() => setActiveAnimal('kambing')} 
                className={`px-5 py-2 md:px-8 md:py-3 rounded-full text-sm md:text-base font-bold transition-all duration-300 ${activeAnimal === 'kambing' ? 'bg-green-600 text-white shadow-lg scale-105 md:scale-110' : 'bg-slate-200 text-slate-600'}`}
              >
                🐐 Kambing
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 w-full shrink-0">
            {inseminasiData[activeAnimal].map((item, index) => (
              <div key={index} className="flex flex-row items-center gap-3 md:gap-4 bg-white/90 backdrop-blur-xl p-3 md:p-5 rounded-2xl md:rounded-[1.5rem] shadow-lg border border-white/50 text-left">
                <div className="w-16 h-16 md:w-32 md:h-32 shrink-0 rounded-xl overflow-hidden shadow-inner border border-slate-200">
                  <img src={item.img} alt={item.nama} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                </div>
                <div>
                  <h3 className={`font-black text-base md:text-xl mb-1 ${activeAnimal === 'sapi' ? 'text-amber-700' : 'text-green-700'}`}>{item.nama}</h3>
                  <p className="text-xs md:text-base text-slate-600 font-medium leading-snug md:leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* HALAMAN 4: KONTAK */}
        <div ref={ref4} className="absolute top-1/2 left-1/2 opacity-0 flex flex-col items-center text-center w-[90vw] max-w-4xl bg-slate-900 p-8 md:p-20 rounded-[2rem] md:rounded-[3rem] shadow-2xl pointer-events-auto border border-slate-700/50" style={{ transform: 'translate(-50%, -50%)' }}>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-7xl font-black text-white mb-4 md:mb-6 leading-tight">Panggilan <span className="text-amber-400 italic">Darurat.</span></h2>
          <p className="text-base md:text-2xl mb-8 md:mb-12 text-slate-300 font-medium max-w-2xl leading-relaxed">
            Hewan ternak sakit mendadak? Jangan panik. Kami siap meluncur ke lokasi Anda kapan pun dibutuhkan.
          </p>
          <button className="bg-amber-500 text-slate-900 px-8 py-4 md:px-12 md:py-6 rounded-full font-extrabold text-base md:text-2xl shadow-[0_10px_30px_rgba(245,158,11,0.3)] hover:bg-amber-400 hover:scale-105 transition-all duration-300">
            Hubungi Sekarang
          </button>
        </div>

      </div>
    </div>
  );
}