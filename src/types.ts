export interface Tractor {
  id: string;
  name: string;
  plate: string;
  model: string;
  active: boolean;
}

export interface Operator {
  id: string;
  name: string;
  registration: string;
  active: boolean;
}

export interface UsageRecord {
  id: string;
  tractorId: string;
  operatorId: string;
  departureTime: string;
  initialKm: number;
  destination: string;
  departureNotes?: string;
  returnTime?: string;
  finalKm?: number;
  returnNotes?: string;
  status: 'OPEN' | 'CLOSED';
}

export type Page = 'DASHBOARD' | 'HISTORICO' | 'CADASTROS';
