/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Historico } from './pages/Historico';
import { Cadastros } from './pages/Cadastros';
import { Login } from './pages/Login';
import { Menu } from 'lucide-react';

function AppContent({ onLogout }: { onLogout: () => void }) {
  const { currentPage } = useAppContext();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#F4F6F8] font-sans text-gray-800 overflow-hidden">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} onLogout={onLogout} />
      
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <div className="flex items-center gap-2 text-[#1B5E20] font-bold text-lg">
            FrotaMuni
          </div>
          <button onClick={() => setMobileOpen(true)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Menu size={24} />
          </button>
        </header>
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {currentPage === 'DASHBOARD' && <Dashboard />}
          {currentPage === 'HISTORICO' && <Historico />}
          {currentPage === 'CADASTROS' && <Cadastros />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <AppProvider>
      <AppContent onLogout={() => setIsAuthenticated(false)} />
    </AppProvider>
  );
}
