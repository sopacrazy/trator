import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Tractor, Operator, UsageRecord, Page } from '../types';

interface AppContextData {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  tractors: Tractor[];
  operators: Operator[];
  usages: UsageRecord[];
  addTractor: (tractor: Omit<Tractor, 'id' | 'active'>) => void;
  toggleTractorActive: (id: string) => void;
  addOperator: (operator: Omit<Operator, 'id' | 'active'>) => void;
  toggleOperatorActive: (id: string) => void;
  registerDeparture: (usage: Omit<UsageRecord, 'id' | 'status'>) => void;
  registerReturn: (usageId: string, returnTime: string, finalKm: number, returnNotes?: string) => void;
}

const AppContext = createContext<AppContextData>({} as AppContextData);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentPage, setCurrentPage] = useState<Page>('DASHBOARD');

  const [tractors, setTractors] = useState<Tractor[]>([
    { id: 't1', name: 'Trator 01', plate: 'MNB-1234', model: 'Massey Ferguson 4707', active: true },
    { id: 't2', name: 'Trator 02', plate: 'OPQ-5678', model: 'John Deere 5075E', active: true },
    { id: 't3', name: 'Trator 03', plate: 'RST-9012', model: 'New Holland TL5', active: true },
  ]);

  const [operators, setOperators] = useState<Operator[]>([
    { id: 'o1', name: 'João Silva', registration: '1001', active: true },
    { id: 'o2', name: 'Carlos Mendes', registration: '1002', active: true },
    { id: 'o3', name: 'Pedro Alves', registration: '1003', active: true },
    { id: 'o4', name: 'Ana Lima', registration: '1004', active: true },
  ]);

  const getTodayStr = () => {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    return today.toISOString().split('T')[0];
  };
  const todayStr = getTodayStr();

  const [usages, setUsages] = useState<UsageRecord[]>([
    {
      id: 'u1',
      tractorId: 't1',
      operatorId: 'o1',
      departureTime: `${todayStr}T08:30`,
      initialKm: 12450,
      destination: 'Linha Verde - Roçada',
      status: 'OPEN',
    },
    {
      id: 'u2',
      tractorId: 't2',
      operatorId: 'o2',
      departureTime: `${todayStr}T07:00`,
      initialKm: 8500,
      destination: 'Parque Central - Manutenção',
      returnTime: `${todayStr}T11:30`,
      finalKm: 8515,
      status: 'CLOSED',
    },
    {
      id: 'u3',
      tractorId: 't3',
      operatorId: 'o3',
      departureTime: `${todayStr}T07:15`,
      initialKm: 5200,
      destination: 'Estrada Sul - Nivelamento',
      returnTime: `${todayStr}T16:00`,
      finalKm: 5240,
      status: 'CLOSED',
    },
  ]);

  const addTractor = (tractor: Omit<Tractor, 'id' | 'active'>) => {
    setTractors([...tractors, { ...tractor, id: `t${Date.now()}`, active: true }]);
  };

  const toggleTractorActive = (id: string) => {
    const hasOpenUsage = usages.some(u => u.tractorId === id && u.status === 'OPEN');
    if (hasOpenUsage) {
      alert('Não é possível desativar um trator com uso em aberto.');
      return;
    }
    setTractors(tractors.map(t => t.id === id ? { ...t, active: !t.active } : t));
  };

  const addOperator = (operator: Omit<Operator, 'id' | 'active'>) => {
    setOperators([...operators, { ...operator, id: `o${Date.now()}`, active: true }]);
  };

  const toggleOperatorActive = (id: string) => {
    const hasOpenUsage = usages.some(u => u.operatorId === id && u.status === 'OPEN');
    if (hasOpenUsage) {
      alert('Não é possível desativar um operador com uso em aberto.');
      return;
    }
    setOperators(operators.map(o => o.id === id ? { ...o, active: !o.active } : o));
  };

  const registerDeparture = (usage: Omit<UsageRecord, 'id' | 'status'>) => {
    setUsages([...usages, { ...usage, id: `u${Date.now()}`, status: 'OPEN' }]);
  };

  const registerReturn = (usageId: string, returnTime: string, finalKm: number, returnNotes?: string) => {
    setUsages(usages.map(u => 
      u.id === usageId 
        ? { ...u, returnTime, finalKm, returnNotes, status: 'CLOSED' }
        : u
    ));
  };

  return (
    <AppContext.Provider value={{
      currentPage, setCurrentPage,
      tractors, operators, usages,
      addTractor, toggleTractorActive,
      addOperator, toggleOperatorActive,
      registerDeparture, registerReturn
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
