export interface ClubColors {
  primary: string;
  secondary: string;
}

export interface ClubFinances {
  budget: number;
  transferBudget: number;
  wageBudget: number;
  sponsorIncomePerSeason: number;
  ticketIncomePerSeason: number;
}

export interface ClubFacilities {
  stadiumName: string;
  stadiumCapacity: number;
  youthAcademyLevel: number; // 1-10, afecta calidad de la cantera
  trainingFacilitiesLevel: number; // 1-10
}

export interface Club {
  id: string;
  name: string;
  shortName: string;
  leagueId: string;
  colors: ClubColors;
  crest: {
    // Escudo sencillo generado por forma+color, sin necesidad de imágenes.
    shape: 'shield' | 'circle' | 'hexagon';
    colors: ClubColors;
  };
  reputation: number; // 1-100
  fanSupport: number; // 1-100
  finances: ClubFinances;
  facilities: ClubFacilities;
  squadPlayerIds: string[];
  youthPlayerIds: string[];
  managerId: string | null;
}
