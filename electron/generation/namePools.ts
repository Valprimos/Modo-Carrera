// Fondos de nombres ficticios por nacionalidad. Pequeños de momento;
// se amplían fácilmente sin tocar el resto del generador (Fase 2 avanzada).

export const NATIONALITIES = [
  'España', 'Argentina', 'Brasil', 'Inglaterra', 'Francia', 'Alemania',
  'Italia', 'Portugal', 'Países Bajos', 'Bélgica', 'Croacia', 'Uruguay',
] as const;

export const FIRST_NAMES: Record<string, string[]> = {
  'España': ['Alejandro', 'Diego', 'Mario', 'Pablo', 'Iker', 'Hugo', 'Marcos', 'Adrián'],
  'Argentina': ['Lautaro', 'Nicolás', 'Facundo', 'Franco', 'Gonzalo', 'Ezequiel'],
  'Brasil': ['Gabriel', 'Lucas', 'Matheus', 'Rafael', 'Bruno', 'Thiago'],
  'Inglaterra': ['Jack', 'Harry', 'George', 'Oliver', 'Charlie', 'James'],
  'Francia': ['Lucas', 'Hugo', 'Léo', 'Nathan', 'Enzo', 'Mathis'],
  'Alemania': ['Leon', 'Finn', 'Paul', 'Jonas', 'Luca', 'Elias'],
  'Italia': ['Matteo', 'Lorenzo', 'Francesco', 'Alessandro', 'Davide'],
  'Portugal': ['João', 'Rui', 'Bruno', 'Tiago', 'Gonçalo'],
  'Países Bajos': ['Daan', 'Sem', 'Bram', 'Milan', 'Lars'],
  'Bélgica': ['Arthur', 'Louis', 'Victor', 'Noah'],
  'Croacia': ['Luka', 'Marko', 'Ivan', 'Josip'],
  'Uruguay': ['Federico', 'Rodrigo', 'Agustín', 'Maximiliano'],
};

export const LAST_NAMES: Record<string, string[]> = {
  'España': ['García', 'Fernández', 'López', 'Martínez', 'Sánchez', 'Romero'],
  'Argentina': ['Álvarez', 'Ferreyra', 'Cabrera', 'Molina', 'Acosta'],
  'Brasil': ['Silva', 'Santos', 'Oliveira', 'Souza', 'Pereira'],
  'Inglaterra': ['Smith', 'Taylor', 'Wilson', 'Brown', 'Evans'],
  'Francia': ['Dubois', 'Moreau', 'Laurent', 'Girard', 'Petit'],
  'Alemania': ['Müller', 'Schmidt', 'Weber', 'Fischer', 'Wagner'],
  'Italia': ['Rossi', 'Ricci', 'Bruno', 'Colombo', 'Conte'],
  'Portugal': ['Silva', 'Costa', 'Pereira', 'Carvalho', 'Ferreira'],
  'Países Bajos': ['de Jong', 'Bakker', 'Visser', 'Smit'],
  'Bélgica': ['Peeters', 'Janssens', 'Maes', 'Wouters'],
  'Croacia': ['Horvat', 'Kovačić', 'Babić', 'Marić'],
  'Uruguay': ['Fernández', 'Rodríguez', 'Pereira', 'Silva'],
};

export const CITY_ROOTS = [
  'Puerto', 'Nuevo', 'San', 'Villa', 'Costa', 'Real', 'Rio', 'Monte', 'Alto', 'Norte',
];
export const CITY_SUFFIXES = [
  'Vista', 'del Sol', 'Verde', 'Grande', 'Blanco', 'Dorado', 'Alto', 'Nuevo', 'Central',
];

export function randomFrom<T>(arr: readonly T[]): T {
  const item = arr[Math.floor(Math.random() * arr.length)];
  if (item === undefined) throw new Error('randomFrom: array vacío');
  return item;
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateCityName(): string {
  return `${randomFrom(CITY_ROOTS)} ${randomFrom(CITY_SUFFIXES)}`;
}
