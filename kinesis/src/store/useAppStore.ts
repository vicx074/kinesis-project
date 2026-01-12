import { create } from 'zustand';

interface AppState {
  isAiReady: boolean;
  setAiReady: (ready: boolean) => void;
  
  cursor: { x: number; y: number };
  setCursor: (x: number, y: number) => void;

  // NOVO: Estado do clique
  isClicking: boolean;
  setIsClicking: (clicking: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isAiReady: false,
  setAiReady: (ready) => set({ isAiReady: ready }),

  cursor: { x: 0, y: 0 },
  setCursor: (x, y) => set({ cursor: { x, y } }),

  isClicking: false,
  setIsClicking: (clicking) => set({ isClicking: clicking }),
}));