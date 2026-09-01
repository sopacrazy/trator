/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useAppContext } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Historico } from './pages/Historico';
import { Cadastros } from './pages/Cadastros';
import { Login } from './pages/Login';
import { Menu, Loader2 } from 'lucide-react';

function AppContent() {
  const { currentPage, isLoading } = useAppContext();
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#F4F6F8] font-sans text-gray-800 overflow-hidden">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} onLogout={logout} />

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
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <Loader2 className="animate-spin" size={28} />
            </div>
          ) : (
            <>
              {currentPage === 'DASHBOARD' && <Dashboard />}
              {currentPage === 'HISTORICO' && <Historico />}
              {currentPage === 'CADASTROS' && <Cadastros />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function AuthGate() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F6F8] text-[#1B5E20]">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
    </ToastProvider>
  );
}
