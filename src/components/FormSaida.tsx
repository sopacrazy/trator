import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { ApiError } from '../lib/api';

export function FormSaida({ onClose }: { onClose: () => void }) {
  const { tractors, operators, usages, registerDeparture } = useAppContext();
  const { showSuccess } = useToast();

  const getTodayStr = () => {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    return today.toISOString().slice(0, 16);
  };

  const [operatorId, setOperatorId] = useState('');
  const [tractorId, setTractorId] = useState('');
  const [departureTime, setDepartureTime] = useState(getTodayStr());
  const [initialRpm, setInitialRpm] = useState('');
  const [destination, setDestination] = useState('');
  const [departureNotes, setDepartureNotes] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeOperators = operators.filter(o => o.active);
  const activeTractors = tractors.filter(t => t.active);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!operatorId || !tractorId || !departureTime || !initialRpm || !destination) return;

    setError('');
    setIsSubmitting(true);
    try {
      await registerDeparture({
        operatorId,
        tractorId,
        departureTime,
        initialRpm: Number(initialRpm),
        destination,
        departureNotes
      });
      showSuccess('Saída registrada com sucesso!');
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível registrar a saída.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Operador *</label>
        <select 
          required
          value={operatorId}
          onChange={e => setOperatorId(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5E20] focus:border-[#1B5E20] outline-none"
        >
          <option value="">Selecione um operador...</option>
          {activeOperators.map(op => (
            <option key={op.id} value={op.id}>{op.name} ({op.registration})</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Trator *</label>
        <select 
          required
          value={tractorId}
          onChange={e => setTractorId(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5E20] focus:border-[#1B5E20] outline-none"
        >
          <option value="">Selecione um trator...</option>
          {activeTractors.map(tr => {
            const isEmUso = usages.some(u => u.tractorId === tr.id && u.status === 'OPEN');
            return (
              <option key={tr.id} value={tr.id} disabled={isEmUso} className={isEmUso ? 'text-gray-400' : ''}>
                {tr.name} - {tr.plate} {isEmUso ? '(em uso)' : ''}
              </option>
            );
          })}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data/Hora Saída *</label>
          <input 
            type="datetime-local" 
            required
            value={departureTime}
            onChange={e => setDepartureTime(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5E20] focus:border-[#1B5E20] outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">RPM Inicial *</label>
          <input
            type="number"
            required
            min="0"
            step="1"
            value={initialRpm}
            onChange={e => setInitialRpm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5E20] focus:border-[#1B5E20] outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Destino / Finalidade *</label>
        <input 
          type="text" 
          required
          value={destination}
          onChange={e => setDestination(e.target.value)}
          placeholder="Ex: Praça Central - Limpeza"
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5E20] focus:border-[#1B5E20] outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Observações (opcional)</label>
        <textarea 
          rows={3}
          value={departureNotes}
          onChange={e => setDepartureNotes(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5E20] focus:border-[#1B5E20] outline-none resize-none"
        ></textarea>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">{error}</div>}

      <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-[#1B5E20] text-white rounded-lg font-medium hover:bg-[#144d18] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Enviando...' : 'Confirmar Saída'}
        </button>
      </div>
    </form>
  );
}
