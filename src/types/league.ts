export interface League {
  id: string;
  name: string;
  country: string;
  tier: number; // 1 = máxima división del país
  clubIds: string[]; // 20 equipos, según el brief
  promotionSlots: number;
  relegationSlots: number;
  hasNationalCup: boolean;
}

export interface Fixture {
  id: string;
  leagueId: string;
  season: number;
  round: number;
  homeClubId: string;
  awayClubId: string;
  played: boolean;
  homeGoals: number | null;
  awayGoals: number | null;
  matchDate: string; // ISO date
}

export interface StandingsRow {
  clubId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}
