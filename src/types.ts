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
  initialRpm: number;
  destination: string;
  departureNotes?: string;
  returnTime?: string;
  finalRpm?: number;
  returnNotes?: string;
  status: 'OPEN' | 'CLOSED';
}

export interface User {
  id: string;
  username: string;
  name: string;
  active: boolean;
}

export type Page = 'DASHBOARD' | 'HISTORICO' | 'CADASTROS';
