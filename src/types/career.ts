export interface ManagerProfile {
  id: string;
  firstName: string;
  lastName: string;
  nationality: string;
  clubId: string | null;
  reputation: number;
  boardConfidence: number; // 1-100
  seasonObjective: string;
}

export interface SaveMeta {
  id: string;
  name: string;
  managerId: string;
  currentSeason: number;
  currentDate: string; // ISO date, fecha "actual" dentro del juego
  createdAt: string;
  updatedAt: string;
  dbFileName: string; // cada partida es su propio archivo SQLite
}

export type Tactic = {
  formation: string; // ej. "4-3-3"
  style: 'possession' | 'counter' | 'direct' | 'balanced';
  pressing: number; // 1-100
  width: number; // 1-100
  tempo: number; // 1-100
  defensiveLine: number; // 1-100
  setPieceTaker: string | null; // playerId
};
