import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import type { HandLandmarkerResult } from "@mediapipe/tasks-vision";


// Links para os arquivos essenciais do Google MediaPipe
const VISION_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.8/wasm";
const MODEL_URL = "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

export class HandDetector {
  private static instance: HandDetector;
  private handLandmarker: HandLandmarker | null = null;
  private isInitializing: boolean = false;

  private constructor() {}

  // Padrão Singleton: Garante que só carregamos a IA uma vez
  public static getInstance(): HandDetector {
    if (!HandDetector.instance) {
      HandDetector.instance = new HandDetector();
    }
    return HandDetector.instance;
  }

  // Inicializa o modelo (Pode demorar uns 2 segundos na primeira vez)
  public async initialize(): Promise<void> {
    if (this.handLandmarker || this.isInitializing) return;
    
    this.isInitializing = true;
    console.log("🦾 KINESIS: Inicializando Core de Visão...");

    try {
      const vision = await FilesetResolver.forVisionTasks(VISION_URL);
      
      this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: MODEL_URL,
          delegate: "GPU" // Usa a placa de vídeo para performance máxima
        },
        runningMode: "VIDEO",
        numHands: 1, // Foca em apenas uma mão
        minHandDetectionConfidence: 0.5,
        minHandPresenceConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      console.log("🦾 KINESIS: Visão Online.");
    } catch (error) {
      console.error("Erro fatal ao carregar MediaPipe:", error);
    } finally {
      this.isInitializing = false;
    }
  }

  // Processa o quadro atual do vídeo
  public detect(videoElement: HTMLVideoElement): HandLandmarkerResult | null {
    if (!this.handLandmarker) return null;

    // Só processa se o vídeo estiver rodando e tiver dados
    if (videoElement.currentTime > 0 && !videoElement.paused) {
      // O performance.now() é crucial para o sincronismo interno do MediaPipe
      return this.handLandmarker.detectForVideo(videoElement, performance.now());
    }
    return null;
  }
}