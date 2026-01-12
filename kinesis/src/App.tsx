import { useHandTracking } from './hooks/useHandTracking';
import { useAppStore } from './store/useAppStore';
import { Scene } from './components/canvas/Scene';

function App() {
  const { videoRef } = useHandTracking();
  const isAiReady = useAppStore((state) => state.isAiReady);

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      
      {/* 1. VÍDEO (FUNDO ESPELHADO) */}
      <video 
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
        style={{ 
          transform: "scaleX(-1)", 
          opacity: isAiReady ? 1 : 0,
          transition: "opacity 1s ease-in-out"
        }}
        playsInline 
        muted 
      />

      {/* 2. CENA 3D (JARVIS) */}
      <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none">
        <Scene />
      </div>

      {/* LOADING DISCRETO (Só aparece se a IA ainda estiver carregando) */}
      {!isAiReady && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <div className="text-cyan-400 font-mono text-sm animate-pulse tracking-widest">
            INITIALIZING JARVIS PROTOCOL...
          </div>
        </div>
      )}
      
    </div>
  );
}

export default App;