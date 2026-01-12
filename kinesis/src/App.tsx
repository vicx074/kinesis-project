import { useHandTracking } from './hooks/useHandTracking';
import { useAppStore } from './store/useAppStore';
import { Scene } from './components/canvas/Scene';

function App() {
  // 1. Iniciamos a Webcam e a IA
  const { videoRef } = useHandTracking();
  
  // 2. Lemos o estado para mostrar na UI
  const isAiReady = useAppStore((state) => state.isAiReady);
  const cursor = useAppStore((state) => state.cursor);

  return (
    <>
      {/* === CAMADA DE VÍDEO (Escondida) === */}
      <video 
        ref={videoRef} 
        className="hidden" // Classe do Tailwind para display: none
        playsInline 
        muted // Importante para autoplay funcionar em alguns browsers
      />

      {/* === CAMADA DE UI (HUD) === */}
      <div id="ui-layer" className="flex flex-col justify-between p-8 text-neon-blue font-mono select-none">
        
        {/* Cabeçalho */}
        <header className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold tracking-widest drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]">
              KINESIS
            </h1>
            <p className="text-xs opacity-70">GESTURE INTERFACE v1.0</p>
          </div>
          
          {/* Status do Sistema */}
          <div className="text-right">
            <div className={`text-sm ${isAiReady ? 'text-green-400' : 'text-red-500 animate-pulse'}`}>
              SYSTEM: {isAiReady ? 'ONLINE' : 'INITIALIZING...'}
            </div>
            <div className="text-xs opacity-50 mt-1">
              X: {cursor.x.toFixed(2)} | Y: {cursor.y.toFixed(2)}
            </div>
          </div>
        </header>

        {/* Rodapé com instruções */}
        <footer className="text-center opacity-60 text-sm">
          {!isAiReady && <p>Permita o acesso à câmera e aguarde...</p>}
          {isAiReady && <p>Levante a mão para controlar o cursor</p>}
        </footer>
      </div>

      {/* === CAMADA 3D === */}
      <Scene />
    </>
  );
}

export default App;