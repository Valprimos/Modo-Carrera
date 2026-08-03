import type { Club } from '../types/club';
import type { League } from '../types/league';
import { generateCityName, randomInt, randomFrom } from './namePools';

const CLUB_SUFFIXES = ['FC', 'CF', 'United', 'Athletic', 'City', 'Deportivo', 'Sporting', 'Real'];
const CREST_SHAPES: Club['crest']['shape'][] = ['shield', 'circle', 'hexagon'];
const PALETTE: [string, string][] = [
  ['#c0392b', '#ffffff'], ['#2980b9', '#f1c40f'], ['#27ae60', '#ffffff'],
  ['#8e44ad', '#f1c40f'], ['#16a085', '#2c3e50'], ['#d35400', '#2c3e50'],
  ['#2c3e50', '#e74c3c'], ['#34495e', '#f39c12'],
];

function generateClubName(): string {
  return `${generateCityName()} ${randomFrom(CLUB_SUFFIXES)}`;
}

export function generateClub(leagueId: string, tierReputationBase: number): Club {
  const name = generateClubName();
  const [primary, secondary] = randomFrom(PALETTE);
  const reputation = clampRep(tierReputationBase + randomInt(-15, 15));

  return {
    id: crypto.randomUUID(),
    name,
    shortName: name.split(' ').map((w) => w[0]).join('').slice(0, 3).toUpperCase(),
    leagueId,
    colors: { primary, secondary },
    crest: { shape: randomFrom(CREST_SHAPES), colors: { primary, secondary } },
    reputation,
    fanSupport: randomInt(30, 95),
    finances: {
      budget: reputation * randomInt(50_000, 150_000),
      transferBudget: reputation * randomInt(20_000, 80_000),
      wageBudget: reputation * randomInt(10_000, 40_000),
      sponsorIncomePerSeason: reputation * randomInt(5_000, 20_000),
      ticketIncomePerSeason: reputation * randomInt(3_000, 15_000),
    },
    facilities: {
      stadiumName: `Estadio ${generateCityName()}`,
      stadiumCapacity: randomInt(8_000, 70_000),
      youthAcademyLevel: Math.min(10, Math.max(1, Math.round(reputation / 10))),
      trainingFacilitiesLevel: Math.min(10, Math.max(1, Math.round(reputation / 10))),
    },
    squadPlayerIds: [],
    youthPlayerIds: [],
    managerId: null,
  };
}

function clampRep(n: number): number {
  return Math.max(1, Math.min(100, n));
}

/** Genera una liga completa con 20 equipos (según brief), con reputación
 * decreciente entre tier 1 (mejor liga) y tiers inferiores. */
export function generateLeague(
  name: string,
  country: string,
  tier: number,
  teamCount = 20,
): { league: League; clubs: Club[] } {
  const leagueId = crypto.randomUUID();
  const repBase = clampRep(90 - (tier - 1) * 25);

  const clubs = Array.from({ length: teamCount }, () => generateClub(leagueId, repBase));

  const league: League = {
    id: leagueId,
    name,
    country,
    tier,
    clubIds: clubs.map((c) => c.id),
    promotionSlots: tier === 1 ? 0 : 2,
    relegationSlots: 3,
    hasNationalCup: true,
  };

  return { league, clubs };
}
