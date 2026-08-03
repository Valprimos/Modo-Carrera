export type Foot = 'left' | 'right' | 'both';

export type Position =
  | 'GK'
  | 'CB' | 'LB' | 'RB' | 'LWB' | 'RWB'
  | 'CDM' | 'CM' | 'CAM' | 'LM' | 'RM'
  | 'LW' | 'RW' | 'CF' | 'ST';

export type PersonalityType =
  | 'professional'
  | 'ambitious'
  | 'temperamental'
  | 'loyal'
  | 'lazy'
  | 'leader'
  | 'balanced';

/** Atributos 1-99, como en el brief. Se separan por bloque para que sea
 * fácil añadir nuevos atributos sin tocar el resto del modelo. */
export interface TechnicalAttributes {
  pasesCortos: number;
  pasesLargos: number;
  regate: number;
  control: number;
  definicion: number;
  tiroLejano: number;
  colocacion: number;
  marcaje: number;
  entradas: number;
}

export interface PhysicalAttributes {
  velocidad: number;
  aceleracion: number;
  fuerza: number;
  resistencia: number;
  agresividad: number;
}

export interface MentalAttributes {
  vision: number;
}

/** Solo relevante si position === 'GK'. */
export interface GoalkeepingAttributes {
  porteria: number;
}

export interface PlayerAttributes {
  technical: TechnicalAttributes;
  physical: PhysicalAttributes;
  mental: MentalAttributes;
  goalkeeping: GoalkeepingAttributes;
}

export interface PlayerInjury {
  type: string;
  severity: 'minor' | 'moderate' | 'severe';
  daysRemaining: number;
}

export interface PlayerContract {
  clubId: string | null;
  salary: number;
  expiresOnSeason: number;
  releaseClause: number | null;
}

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  nationality: string;
  birthDate: string; // ISO date, la edad se deriva de esto
  height: number; // cm
  weight: number; // kg
  preferredFoot: Foot;
  position: Position;
  secondaryPositions: Position[];
  value: number;
  potential: number; // 1-99, techo de calidad futura
  currentAbility: number; // 1-99, calidad actual
  morale: number; // 1-100
  form: number; // 1-100, rendimiento reciente
  personality: PersonalityType;
  reputation: number; // 1-100
  injuries: PlayerInjury[];
  attributes: PlayerAttributes;
  contract: PlayerContract;
  isYouthProspect: boolean;
}
