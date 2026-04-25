const NIGERIAN_STATES_BASE = [
  'Abia',
  'Adamawa',
  'Akwa Ibom',
  'Anambra',
  'Bauchi',
  'Bayelsa',
  'Benue',
  'Borno',
  'Cross River',
  'Delta',
  'Ebonyi',
  'Edo',
  'Ekiti',
  'Enugu',
  'Gombe',
  'Imo',
  'Jigawa',
  'Kaduna',
  'Kano',
  'Katsina',
  'Kebbi',
  'Kogi',
  'Kwara',
  'Lagos',
  'Nasarawa',
  'Niger',
  'Ogun',
  'Ondo',
  'Osun',
  'Oyo',
  'Plateau',
  'Rivers',
  'Sokoto',
  'Taraba',
  'Yobe',
  'Zamfara',
  'Federal Capital Territory',
] as const;

export const NIGERIAN_STATES = [...NIGERIAN_STATES_BASE];

const STATE_ALIASES: Record<string, string> = {
  abuja: 'Federal Capital Territory',
  fct: 'Federal Capital Territory',
  'federal capital territory': 'Federal Capital Territory',
};

const STATE_LOOKUP = new Map<string, string>(
  NIGERIAN_STATES.map((state) => [state.toLowerCase(), state]),
);

for (const [alias, canonical] of Object.entries(STATE_ALIASES)) {
  STATE_LOOKUP.set(alias, canonical);
}

export const normalizeNigerianState = (value: string) => {
  return STATE_LOOKUP.get(value.trim().toLowerCase()) ?? null;
};

export const isValidNigerianState = (value: string) => normalizeNigerianState(value) !== null;
