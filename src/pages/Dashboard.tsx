import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { StatusCard } from '../components/StatusCard';
import { Modal } from '../components/Modal';
import { FormSaida } from '../components/FormSaida';
import { FormRetorno } from '../components/FormRetorno';
import { Tractor, CheckCircle2, Route, Plus } from 'lucide-react';

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

  const kmTotalHoje = usosConcluidosHoje.reduce((acc, u) => acc + ((u.finalKm || 0) - u.initialKm), 0);

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">{new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <button 
          onClick={() => setIsSaidaModalOpen(true)}
          className="flex items-center gap-2 bg-[#1B5E20] hover:bg-[#144d18] text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors"
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
        />
        <StatusCard 
          title="Retornados hoje" 
          value={usosConcluidosHoje.length} 
          icon={CheckCircle2} 
          colorClass="bg-green-100 text-green-600"
        />
        <StatusCard 
          title="KM total hoje" 
          value={kmTotalHoje.toFixed(1)} 
          icon={Route} 
          colorClass="bg-blue-100 text-blue-600"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Em campo agora</h2>
          <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">{usosAbertos.length} em aberto</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
                <th className="p-4 font-medium">Operador</th>
                <th className="p-4 font-medium">Trator</th>
                <th className="p-4 font-medium">Saída</th>
                <th className="p-4 font-medium">KM Inicial</th>
                <th className="p-4 font-medium">Destino</th>
                <th className="p-4 font-medium text-right">Ação</th>
              </tr>
            </thead>
            <tbody>
              {usosAbertos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">Nenhum trator em campo no momento.</td>
                </tr>
              ) : (
                usosAbertos.map(u => {
                  const op = operators.find(o => o.id === u.operatorId);
                  const tr = tractors.find(t => t.id === u.tractorId);
                  return (
                    <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-gray-800">{op?.name}</td>
                      <td className="p-4 text-gray-600">{tr?.name} <span className="text-xs text-gray-400 block">{tr?.plate}</span></td>
                      <td className="p-4 text-gray-600">{formatDate(u.departureTime)}</td>
                      <td className="p-4 text-gray-600">{u.initialKm}</td>
                      <td className="p-4 text-gray-600">{u.destination}</td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => setRetornoModalUsageId(u.id)}
                          className="text-sm font-medium text-[#1565C0] hover:text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded transition-colors"
                        >
                          Registrar Retorno
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
          <h2 className="text-lg font-semibold text-gray-800">Concluídos hoje</h2>
          <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">{usosConcluidosHoje.length} concluídos</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
                <th className="p-4 font-medium">Operador</th>
                <th className="p-4 font-medium">Trator</th>
                <th className="p-4 font-medium">Saída</th>
                <th className="p-4 font-medium">Retorno</th>
                <th className="p-4 font-medium">KM Rodados</th>
              </tr>
            </thead>
            <tbody>
              {usosConcluidosHoje.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">Nenhum uso retornado hoje.</td>
                </tr>
              ) : (
                usosConcluidosHoje.map(u => {
                  const op = operators.find(o => o.id === u.operatorId);
                  const tr = tractors.find(t => t.id === u.tractorId);
                  return (
                    <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-gray-800">{op?.name}</td>
                      <td className="p-4 text-gray-600">{tr?.name}</td>
                      <td className="p-4 text-gray-600">{formatDate(u.departureTime)}</td>
                      <td className="p-4 text-gray-600">{u.returnTime ? formatDate(u.returnTime) : '-'}</td>
                      <td className="p-4 font-medium text-gray-800">
                        {u.finalKm ? (u.finalKm - u.initialKm).toFixed(1) : '-'}
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
