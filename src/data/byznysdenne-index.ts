export interface WeekData {
  week: string;
  value: number;
}

export interface ByznysDenneIndex {
  current: number;
  updatedAt: string;
  comment: string;
  history: WeekData[];
}

export const indexData: ByznysDenneIndex = {
  current: 7,
  updatedAt: '23. 5. 2026',
  comment:
    'Bitcoin drží nad 100k, americké akcie se stabilizovaly po korekci. Sentiment je pozitivní ale opatrný — ideální čas pro DCA strategie.',
  history: [
    { week: '4. 4.', value: 5 },
    { week: '11. 4.', value: 6 },
    { week: '18. 4.', value: 4 },
    { week: '25. 4.', value: 7 },
    { week: '2. 5.', value: 8 },
    { week: '9. 5.', value: 6 },
    { week: '16. 5.', value: 7 },
    { week: '23. 5.', value: 7 },
  ],
};

export function getZoneColor(value: number): string {
  if (value <= 3) return '#ef4444';
  if (value <= 6) return '#D4AF37';
  return '#22c55e';
}

export function getZoneLabel(value: number): string {
  if (value <= 3) return 'Medvědí';
  if (value <= 6) return 'Neutrální';
  return 'Býčí';
}
