import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { HandDetector } from '../core/mediapipe/HandDetector';

export const useHandTracking = () => {
  const setAiReady = useAppStore((state) => state.setAiReady);
  const setCursor = useAppStore((state) => state.setCursor);
  const setIsClicking = useAppStore((state) => state.setIsClicking); // <--- NOVO

  const videoRef = useRef<HTMLVideoElement>(document.createElement("video"));

  useEffect(() => {
    let animationFrameId: number;
    const detector = HandDetector.getInstance();
    const videoElement = videoRef.current;

    const setup = async () => {
      await detector.initialize();
      setAiReady(true);

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720, facingMode: "user" }
        });
        videoElement.srcObject = stream;
        videoElement.autoplay = true;
        videoElement.playsInline = true;
        videoElement.addEventListener("loadeddata", loop);
      } catch (err) {
        console.error(err);
      }
    };

    const loop = () => {
      const result = detector.detect(videoElement);

      if (result && result.landmarks && result.landmarks.length > 0) {
        const hand = result.landmarks[0];
        
        // Posição (Indicador - Ponto 8)
        const indexFinger = hand[8]; 
        const x = (1 - indexFinger.x) * 2 - 1; 
        const y = -(indexFinger.y * 2 - 1);    
        setCursor(x, y);

        // --- LÓGICA DO CLIQUE (PINÇA) ---
        const thumbTip = hand[4];  // Ponta do Dedão
        const indexTip = hand[8];  // Ponta do Indicador

        // Calcula a distância entre os dois dedos (Teorema de Pitágoras 3D simples)
        const distance = Math.sqrt(
          Math.pow(indexTip.x - thumbTip.x, 2) +
          Math.pow(indexTip.y - thumbTip.y, 2)
        );

        // Se a distância for menor que 0.05 (ajuste se precisar), é clique!
        // Enviamos para o store
        setIsClicking(distance < 0.05);
      } else {
        setIsClicking(false); // Se perder a mão, solta o clique
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    setup();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [setAiReady, setCursor, setIsClicking]);

  return { videoRef };
};