import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Tractor, Operator, UsageRecord, User, Page } from '../types';
import { api } from '../lib/api';

interface AppContextData {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isLoading: boolean;
  tractors: Tractor[];
  operators: Operator[];
  usages: UsageRecord[];
  users: User[];
  addTractor: (tractor: Omit<Tractor, 'id' | 'active'>) => Promise<void>;
  updateTractor: (id: string, tractor: Omit<Tractor, 'id' | 'active'>) => Promise<void>;
  toggleTractorActive: (id: string) => Promise<void>;
  addOperator: (operator: Omit<Operator, 'id' | 'active'>) => Promise<void>;
  updateOperator: (id: string, operator: Omit<Operator, 'id' | 'active'>) => Promise<void>;
  toggleOperatorActive: (id: string) => Promise<void>;
  addUser: (user: { username: string; password: string; name: string }) => Promise<void>;
  updateUser: (id: string, user: { username: string; password?: string; name: string }) => Promise<void>;
  toggleUserActive: (id: string) => Promise<void>;
  registerDeparture: (usage: Omit<UsageRecord, 'id' | 'status'>) => Promise<void>;
  registerReturn: (usageId: string, returnTime: string, finalRpm: number, returnNotes?: string) => Promise<void>;
}

const AppContext = createContext<AppContextData>({} as AppContextData);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentPage, setCurrentPage] = useState<Page>('DASHBOARD');
  const [isLoading, setIsLoading] = useState(true);

  const [tractors, setTractors] = useState<Tractor[]>([]);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [usages, setUsages] = useState<UsageRecord[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    Promise.all([
      api.get<Tractor[]>('/tractors'),
      api.get<Operator[]>('/operators'),
      api.get<UsageRecord[]>('/usages'),
      api.get<User[]>('/users'),
    ])
      .then(([t, o, u, us]) => {
        setTractors(t);
        setOperators(o);
        setUsages(u);
        setUsers(us);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const addTractor = async (tractor: Omit<Tractor, 'id' | 'active'>) => {
    const created = await api.post<Tractor>('/tractors', tractor);
    setTractors(prev => [...prev, created]);
  };

  const updateTractor = async (id: string, tractor: Omit<Tractor, 'id' | 'active'>) => {
    const updated = await api.patch<Tractor>(`/tractors/${id}`, tractor);
    setTractors(prev => prev.map(t => t.id === id ? updated : t));
  };

  const toggleTractorActive = async (id: string) => {
    const updated = await api.patch<Tractor>(`/tractors/${id}/toggle`);
    setTractors(prev => prev.map(t => t.id === id ? updated : t));
  };

  const addOperator = async (operator: Omit<Operator, 'id' | 'active'>) => {
    const created = await api.post<Operator>('/operators', operator);
    setOperators(prev => [...prev, created]);
  };

  const updateOperator = async (id: string, operator: Omit<Operator, 'id' | 'active'>) => {
    const updated = await api.patch<Operator>(`/operators/${id}`, operator);
    setOperators(prev => prev.map(o => o.id === id ? updated : o));
  };

  const toggleOperatorActive = async (id: string) => {
    const updated = await api.patch<Operator>(`/operators/${id}/toggle`);
    setOperators(prev => prev.map(o => o.id === id ? updated : o));
  };

  const addUser = async (user: { username: string; password: string; name: string }) => {
    const created = await api.post<User>('/users', user);
    setUsers(prev => [...prev, created]);
  };

  const updateUser = async (id: string, user: { username: string; password?: string; name: string }) => {
    const updated = await api.patch<User>(`/users/${id}`, user);
    setUsers(prev => prev.map(u => u.id === id ? updated : u));
  };

  const toggleUserActive = async (id: string) => {
    const updated = await api.patch<User>(`/users/${id}/toggle`);
    setUsers(prev => prev.map(u => u.id === id ? updated : u));
  };

  const registerDeparture = async (usage: Omit<UsageRecord, 'id' | 'status'>) => {
    const created = await api.post<UsageRecord>('/usages', usage);
    setUsages(prev => [created, ...prev]);
  };

  const registerReturn = async (usageId: string, returnTime: string, finalRpm: number, returnNotes?: string) => {
    const updated = await api.patch<UsageRecord>(`/usages/${usageId}/return`, { returnTime, finalRpm, returnNotes });
    setUsages(prev => prev.map(u => u.id === usageId ? updated : u));
  };

  return (
    <AppContext.Provider value={{
      currentPage, setCurrentPage, isLoading,
      tractors, operators, usages, users,
      addTractor, updateTractor, toggleTractorActive,
      addOperator, updateOperator, toggleOperatorActive,
      addUser, updateUser, toggleUserActive,
      registerDeparture, registerReturn
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
