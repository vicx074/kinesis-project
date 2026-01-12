import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { HandDetector } from '../core/mediapipe/HandDetector';

export const useHandTracking = () => {
  // Acessamos as actions do nosso Store global
  const setAiReady = useAppStore((state) => state.setAiReady);
  const setCursor = useAppStore((state) => state.setCursor);

  // Referência para o elemento de vídeo (invisível)
  const videoRef = useRef<HTMLVideoElement>(document.createElement("video"));

  useEffect(() => {
    let animationFrameId: number;
    const detector = HandDetector.getInstance();
    const videoElement = videoRef.current;

    // Configuração inicial
    const setup = async () => {
      // 1. Inicializa o detector de IA
      await detector.initialize();
      setAiReady(true);

      // 2. Pede acesso à webcam
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: 1280,
            height: 720,
            facingMode: "user" // Câmera frontal
          }
        });

        videoElement.srcObject = stream;
        videoElement.autoplay = true;
        videoElement.playsInline = true; // Necessário para mobile

        // Quando o vídeo carregar os dados, começa o loop
        videoElement.addEventListener("loadeddata", loop);
      } catch (err) {
        console.error("Erro ao acessar webcam:", err);
        alert("Precisamos da sua câmera para a mágica acontecer!");
      }
    };

    // O Loop Principal (Roda a cada frame)
    const loop = () => {
      // Pede para o detector processar o frame atual do vídeo
      const result = detector.detect(videoElement);

      if (result && result.landmarks && result.landmarks.length > 0) {
        // Pegamos a primeira mão detectada
        const hand = result.landmarks[0];
        
        // Ponto 8 é a ponta do dedo indicador
        const indexFinger = hand[8]; 

        // TRANSFORMAÇÃO DE COORDENADAS:
        // O MediaPipe retorna x: 0 (esq) a 1 (dir).
        // Precisamos inverter o X (espelhar) para parecer um espelho.
        // E converter para -1 a 1 (sistema de coordenadas normalizado para 3D)
        
        const x = (1 - indexFinger.x) * 2 - 1; // 0..1 -> 1..-1
        const y = -(indexFinger.y * 2 - 1);    // 0..1 -> 1..-1 (Invertido Y)

        // Atualiza o store global
        setCursor(x, y);
      }

      // Agenda o próximo frame
      animationFrameId = requestAnimationFrame(loop);
    };

    setup();

    // Cleanup: Para tudo se o componente desmontar
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (videoElement.srcObject) {
        const stream = videoElement.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [setAiReady, setCursor]);

  return { videoRef };
};