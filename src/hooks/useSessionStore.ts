import { create } from 'zustand';
import type { SaveMeta } from '@/types/career';

interface SessionState {
  activeSave: SaveMeta | null;
  setActiveSave: (save: SaveMeta | null) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  activeSave: null,
  setActiveSave: (save) => set({ activeSave: save }),
}));
