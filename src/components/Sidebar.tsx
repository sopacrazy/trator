import React from 'react';
import { useAppContext } from '../context/AppContext';
import { LayoutDashboard, History, Database, Tractor, LogOut } from 'lucide-react';
import { Page } from '../types';

export function Sidebar({ mobileOpen, setMobileOpen, onLogout }: { mobileOpen: boolean, setMobileOpen: (o: boolean) => void, onLogout: () => void }) {
  const { currentPage, setCurrentPage } = useAppContext();

  const navItems: { id: Page; label: string; icon: React.ElementType }[] = [
    { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'HISTORICO', label: 'Histórico', icon: History },
    { id: 'CADASTROS', label: 'Cadastros', icon: Database },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden" 
          onClick={() => setMobileOpen(false)} 
        />
      )}
      
      <aside className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-[#1B5E20] text-white flex flex-col h-full flex-shrink-0 transition-transform duration-300 ease-in-out ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <Tractor size={28} className="text-white" />
          <h1 className="font-bold text-xl tracking-tight">Frota<span className="font-normal opacity-80">Muni</span></h1>
        </div>
        
        <nav className="flex-1 py-6 px-3 flex flex-col gap-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setMobileOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  isActive 
                    ? 'bg-white/15 font-medium' 
                    : 'hover:bg-white/5 text-white/80 hover:text-white'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-white' : 'text-white/70'} />
                {item.label}
              </button>
            );
          })}
        </nav>
        
        <div className="p-3 border-t border-white/10">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-white/80 hover:bg-white/5 hover:text-white transition-colors"
          >
            <LogOut size={20} className="text-white/70" />
            Sair
          </button>
          <p className="text-xs text-white/50 text-center mt-1">Controle de Frota v1.0</p>
        </div>
      </aside>
    </>
  );
}
