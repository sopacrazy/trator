import React, { useState } from 'react';
import { Tractor, Lock, User, Eye, EyeOff } from 'lucide-react';
import loginBg from '../assets/login-bg.jpg';

export function Login({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Informe usuário e senha para continuar.');
      return;
    }
    setError('');
    onLogin();
  };

  return (
    <div className="min-h-screen w-full flex bg-[#F4F6F8]">
      {/* Left panel - imagery */}
      <div
        className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center"
        style={{ backgroundImage: `url(${loginBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        <div className="relative z-10 flex flex-col justify-between h-full w-full p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/15 backdrop-blur-sm p-2 rounded-xl">
              <Tractor size={28} />
            </div>
            <h1 className="font-bold text-2xl tracking-tight">
              Frota<span className="font-normal opacity-80">Muni</span>
            </h1>
          </div>

          <div>
            <h2 className="text-3xl font-bold leading-tight mb-3 max-w-md">
              Controle total da frota de tratores da sua gestão.
            </h2>
            <p className="text-white/80 max-w-md">
              Acompanhe saídas, retornos e o histórico de uso de cada trator e operador em tempo real.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="flex lg:hidden items-center gap-3 mb-8 text-[#1B5E20]">
            <div className="bg-[#1B5E20]/10 p-2 rounded-xl">
              <Tractor size={26} />
            </div>
            <h1 className="font-bold text-xl tracking-tight">
              Frota<span className="font-normal opacity-70">Muni</span>
            </h1>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-1">Bem-vindo de volta</h2>
          <p className="text-gray-500 mb-8">Entre com suas credenciais para acessar o sistema.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Usuário</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Matrícula ou usuário"
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5E20] focus:border-[#1B5E20] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5E20] focus:border-[#1B5E20] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 -mt-1">{error}</p>
            )}

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" className="rounded border-gray-300 text-[#1B5E20] focus:ring-[#1B5E20]" />
                Lembrar de mim
              </label>
              <a href="#" className="text-[#1B5E20] font-medium hover:underline">
                Esqueci minha senha
              </a>
            </div>

            <button
              type="submit"
              className="mt-2 w-full py-2.5 bg-[#1B5E20] text-white rounded-lg font-medium hover:bg-[#144d18] transition-colors"
            >
              Entrar
            </button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-8">
            Controle de Frota v1.0 &middot; Uso interno
          </p>
        </div>
      </div>
    </div>
  );
}
