import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { StatusCard } from '../components/StatusCard';
import { Modal } from '../components/Modal';
import { FormSaida } from '../components/FormSaida';
import { FormRetorno } from '../components/FormRetorno';
import { Tractor, CheckCircle2, Route, Plus, Calendar, ArrowRight, Inbox } from 'lucide-react';

const AVATAR_COLORS = [
  'bg-blue-100 text-blue-700',
  'bg-emerald-100 text-emerald-700',
  'bg-violet-100 text-violet-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-cyan-100 text-cyan-700',
];

function avatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function initials(name: string) {
  return name.split(' ').filter(Boolean).slice(0, 2).map(p => p[0]).join('').toUpperCase();
}

function Avatar({ name }: { name: string }) {
  return (
    <div className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${avatarColor(name)}`}>
      {initials(name)}
    </div>
  );
}

export function Dashboard() {
  const { usages, tractors, operators } = useAppContext();

  const [isSaidaModalOpen, setIsSaidaModalOpen] = useState(false);
  const [retornoModalUsageId, setRetornoModalUsageId] = useState<string | null>(null);

  const getTodayStr = () => new Date().toISOString().split('T')[0];
  const today = getTodayStr();

  const usosAbertos = usages.filter(u => u.status === 'OPEN');

  const usosConcluidosHoje = usages.filter(u =>
    u.status === 'CLOSED' && u.returnTime?.startsWith(today)
  );

  const rpmTotalHoje = usosConcluidosHoje.reduce((acc, u) => acc + ((u.finalRpm || 0) - u.initialRpm), 0);

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
    });
  };

  const formatNumber = (n: number) => n.toLocaleString('pt-BR');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 flex items-center gap-1.5 mt-0.5">
            <Calendar size={15} className="text-gray-400" />
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button
          onClick={() => setIsSaidaModalOpen(true)}
          className="flex items-center gap-2 bg-[#1B5E20] hover:bg-[#144d18] text-white px-5 py-2.5 rounded-lg font-medium shadow-sm hover:shadow transition-all"
        >
          <Plus size={20} />
          Registrar Saída
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatusCard
          title="Tratores em uso"
          value={usosAbertos.length}
          icon={Tractor}
          colorClass="bg-amber-100 text-amber-600"
          accentClass="border-l-amber-400"
        />
        <StatusCard
          title="Retornados hoje"
          value={usosConcluidosHoje.length}
          icon={CheckCircle2}
          colorClass="bg-green-100 text-green-600"
          accentClass="border-l-green-400"
        />
        <StatusCard
          title="RPM total hoje"
          value={formatNumber(rpmTotalHoje)}
          icon={Route}
          colorClass="bg-blue-100 text-blue-600"
          accentClass="border-l-blue-400"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Tractor size={18} className="text-gray-400" />
            Em campo agora
          </h2>
          <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">{usosAbertos.length} em aberto</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                <th className="p-4 font-semibold">Operador</th>
                <th className="p-4 font-semibold">Trator</th>
                <th className="p-4 font-semibold">Saída</th>
                <th className="p-4 font-semibold text-right">RPM Inicial</th>
                <th className="p-4 font-semibold">Destino</th>
                <th className="p-4 font-semibold text-right">Ação</th>
              </tr>
            </thead>
            <tbody>
              {usosAbertos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <Inbox size={28} className="text-gray-300" />
                      <span>Nenhum trator em campo no momento.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                usosAbertos.map(u => {
                  const op = operators.find(o => o.id === u.operatorId);
                  const tr = tractors.find(t => t.id === u.tractorId);
                  return (
                    <tr key={u.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/80 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={op?.name || '?'} />
                          <span className="font-medium text-gray-800">{op?.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">{tr?.name} <span className="text-xs text-gray-400 block">{tr?.plate}</span></td>
                      <td className="p-4 text-gray-600">{formatDate(u.departureTime)}</td>
                      <td className="p-4 text-gray-600 text-right tabular-nums">{formatNumber(u.initialRpm)}</td>
                      <td className="p-4 text-gray-600 max-w-[220px] truncate" title={u.destination}>{u.destination}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setRetornoModalUsageId(u.id)}
                          className="inline-flex items-center gap-1 text-sm font-medium text-[#1565C0] hover:text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded transition-colors"
                        >
                          Registrar Retorno
                          <ArrowRight size={14} />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-gray-400" />
            Concluídos hoje
          </h2>
          <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">{usosConcluidosHoje.length} concluídos</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                <th className="p-4 font-semibold">Operador</th>
                <th className="p-4 font-semibold">Trator</th>
                <th className="p-4 font-semibold">Saída</th>
                <th className="p-4 font-semibold">Retorno</th>
                <th className="p-4 font-semibold text-right">RPM Total</th>
              </tr>
            </thead>
            <tbody>
              {usosConcluidosHoje.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <Inbox size={28} className="text-gray-300" />
                      <span>Nenhum uso retornado hoje.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                usosConcluidosHoje.map(u => {
                  const op = operators.find(o => o.id === u.operatorId);
                  const tr = tractors.find(t => t.id === u.tractorId);
                  return (
                    <tr key={u.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/80 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={op?.name || '?'} />
                          <span className="font-medium text-gray-800">{op?.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">{tr?.name}</td>
                      <td className="p-4 text-gray-600">{formatDate(u.departureTime)}</td>
                      <td className="p-4 text-gray-600">{u.returnTime ? formatDate(u.returnTime) : '-'}</td>
                      <td className="p-4 font-semibold text-gray-800 text-right tabular-nums">
                        {u.finalRpm ? formatNumber(u.finalRpm - u.initialRpm) : '-'}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isSaidaModalOpen} onClose={() => setIsSaidaModalOpen(false)} title="Registrar Saída de Trator">
        <FormSaida onClose={() => setIsSaidaModalOpen(false)} />
      </Modal>

      <Modal isOpen={!!retornoModalUsageId} onClose={() => setRetornoModalUsageId(null)} title="Registrar Retorno de Trator">
        {retornoModalUsageId && (
          <FormRetorno usageId={retornoModalUsageId} onClose={() => setRetornoModalUsageId(null)} />
        )}
      </Modal>
    </div>
  );
}
