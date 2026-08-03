import type { Player, Position, PersonalityType, Foot } from '../types/player';
import { NATIONALITIES, FIRST_NAMES, LAST_NAMES, randomFrom, randomInt } from './namePools';

const POSITIONS: Position[] = [
  'GK', 'CB', 'LB', 'RB', 'LWB', 'RWB', 'CDM', 'CM', 'CAM', 'LM', 'RM', 'LW', 'RW', 'CF', 'ST',
];
const PERSONALITIES: PersonalityType[] = [
  'professional', 'ambitious', 'temperamental', 'loyal', 'lazy', 'leader', 'balanced',
];
const FEET: Foot[] = ['left', 'right', 'both'];

function clamp(n: number, min = 1, max = 99): number {
  return Math.max(min, Math.min(max, Math.round(n)));
}

/** Genera un valor con ruido alrededor de una base, para que los atributos
 * de un jugador estén correlacionados con su calidad general en vez de ser
 * puro ruido independiente (lo que daría jugadores incoherentes). */
function attrAround(base: number, spread = 15): number {
  return clamp(base + randomInt(-spread, spread));
}

function ageToBirthDate(age: number): string {
  const now = new Date();
  const year = now.getFullYear() - age;
  const month = randomInt(1, 12);
  const day = randomInt(1, 28);
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export interface GeneratePlayerOptions {
  minAbility?: number;
  maxAbility?: number;
  isYouthProspect?: boolean;
  forcedPosition?: Position;
}

export function generatePlayer(options: GeneratePlayerOptions = {}): Player {
  const nationality = randomFrom(NATIONALITIES);
  const position = options.forcedPosition ?? randomFrom(POSITIONS);
  const isGK = position === 'GK';

  const age = options.isYouthProspect ? randomInt(16, 19) : randomInt(17, 37);
  const currentAbility = clamp(
    randomInt(options.minAbility ?? 35, options.maxAbility ?? 85),
  );
  // El potencial es igual o mayor a la calidad actual; jóvenes tienen más margen.
  const potentialCeiling = age < 23 ? 99 : currentAbility + randomInt(0, 5);
  const potential = clamp(Math.max(currentAbility, randomInt(currentAbility, potentialCeiling)));

  const value = Math.round(
    (currentAbility ** 2.1) * (age < 27 ? 1.3 : 0.7) * randomInt(80, 140),
  );
  const salary = Math.round(value * 0.0009 + randomInt(500, 3000));

  return {
    id: crypto.randomUUID(),
    firstName: randomFrom(FIRST_NAMES[nationality] ?? ['Jugador']),
    lastName: randomFrom(LAST_NAMES[nationality] ?? ['Anónimo']),
    nationality,
    birthDate: ageToBirthDate(age),
    height: randomInt(168, 198),
    weight: randomInt(64, 92),
    preferredFoot: randomFrom(FEET),
    position,
    secondaryPositions: [],
    value,
    potential,
    currentAbility,
    morale: randomInt(55, 90),
    form: randomInt(40, 80),
    personality: randomFrom(PERSONALITIES),
    reputation: clamp(currentAbility - randomInt(0, 10)),
    injuries: [],
    isYouthProspect: options.isYouthProspect ?? false,
    attributes: {
      technical: {
        pasesCortos: attrAround(currentAbility),
        pasesLargos: attrAround(currentAbility),
        regate: attrAround(currentAbility),
        control: attrAround(currentAbility),
        definicion: attrAround(isGK ? 30 : currentAbility),
        tiroLejano: attrAround(isGK ? 20 : currentAbility),
        colocacion: attrAround(currentAbility),
        marcaje: attrAround(currentAbility),
        entradas: attrAround(currentAbility),
      },
      physical: {
        velocidad: attrAround(currentAbility),
        aceleracion: attrAround(currentAbility),
        fuerza: attrAround(currentAbility),
        resistencia: attrAround(currentAbility),
        agresividad: attrAround(currentAbility, 20),
      },
      mental: {
        vision: attrAround(currentAbility),
      },
      goalkeeping: {
        porteria: isGK ? attrAround(currentAbility, 10) : randomInt(1, 15),
      },
    },
    contract: {
      clubId: null,
      salary,
      expiresOnSeason: new Date().getFullYear() + randomInt(1, 5),
      releaseClause: Math.random() > 0.6 ? Math.round(value * randomInt(120, 200) / 100) : null,
    },
  };
}

export function generateSquad(clubReputation: number, size = 23): Player[] {
  // La calidad media del plantel escala con la reputación del club (1-100),
  // para que los clubes grandes tengan jugadores mejores de forma consistente.
  const minAbility = clamp(clubReputation * 0.4, 30, 90);
  const maxAbility = clamp(clubReputation * 0.9 + 10, 40, 99);

  const positions: Position[] = [
    'GK', 'GK', 'GK',
    'CB', 'CB', 'CB', 'LB', 'RB',
    'CDM', 'CDM', 'CM', 'CM', 'CAM',
    'LM', 'RM', 'LW', 'RW',
    'CF', 'ST', 'ST',
  ];

  const squad: Player[] = [];
  for (let i = 0; i < size; i++) {
    const forcedPosition = positions[i % positions.length];
    squad.push(generatePlayer({ minAbility, maxAbility, forcedPosition }));
  }
  return squad;
}

export function generateYouthProspects(clubReputation: number, count = 8): Player[] {
  const minAbility = clamp(clubReputation * 0.2, 15, 50);
  const maxAbility = clamp(clubReputation * 0.5, 30, 70);
  return Array.from({ length: count }, () =>
    generatePlayer({ minAbility, maxAbility, isYouthProspect: true }),
  );
}
