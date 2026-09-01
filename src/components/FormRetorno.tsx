import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ApiError } from '../lib/api';

export function FormRetorno({ usageId, onClose }: { usageId: string, onClose: () => void }) {
  const { usages, tractors, operators, registerReturn } = useAppContext();

  const usage = usages.find(u => u.id === usageId);
  const tractor = tractors.find(t => t.id === usage?.tractorId);
  const operator = operators.find(o => o.id === usage?.operatorId);

  const getTodayStr = () => {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    return today.toISOString().slice(0, 16);
  };

  const [returnTime, setReturnTime] = useState(getTodayStr());
  const [finalRpm, setFinalRpm] = useState('');
  const [returnNotes, setReturnNotes] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!usage || !tractor || !operator) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!returnTime || !finalRpm) return;

    const finalRpmNum = Number(finalRpm);

    if (finalRpmNum <= usage.initialRpm) {
      setError(`O RPM final (${finalRpmNum}) deve ser maior que o RPM inicial (${usage.initialRpm}).`);
      return;
    }

    if (new Date(returnTime) < new Date(usage.departureTime)) {
      setError('A data/hora de retorno não pode ser anterior à de saída.');
      return;
    }

    setIsSubmitting(true);
    try {
      await registerReturn(usage.id, returnTime, finalRpmNum, returnNotes);
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível registrar o retorno.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const rpmTotal = finalRpm ? (Number(finalRpm) - usage.initialRpm).toFixed(0) : '0';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Readonly Info */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm grid grid-cols-2 gap-2 mb-2">
        <div><span className="text-gray-500">Operador:</span> <br/><span className="font-medium text-gray-800">{operator.name}</span></div>
        <div><span className="text-gray-500">Trator:</span> <br/><span className="font-medium text-gray-800">{tractor.name}</span></div>
        <div><span className="text-gray-500">Saída:</span> <br/><span className="font-medium text-gray-800">{new Date(usage.departureTime).toLocaleString('pt-BR')}</span></div>
        <div><span className="text-gray-500">RPM Inicial:</span> <br/><span className="font-medium text-gray-800">{usage.initialRpm}</span></div>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">{error}</div>}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data/Hora Retorno *</label>
          <input 
            type="datetime-local" 
            required
            value={returnTime}
            onChange={e => setReturnTime(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5E20] focus:border-[#1B5E20] outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">RPM Final *</label>
          <input
            type="number"
            required
            min={usage.initialRpm + 1}
            step="1"
            value={finalRpm}
            onChange={e => setFinalRpm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5E20] focus:border-[#1B5E20] outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">RPM Total</label>
        <div className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 font-medium">
          {rpmTotal}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Observações (opcional)</label>
        <textarea 
          rows={3}
          value={returnNotes}
          onChange={e => setReturnNotes(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5E20] focus:border-[#1B5E20] outline-none resize-none"
        ></textarea>
      </div>

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
          {isSubmitting ? 'Enviando...' : 'Confirmar Retorno'}
        </button>
      </div>
    </form>
  );
}
