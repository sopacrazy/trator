import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Download, FileText } from 'lucide-react';
import { exportHistoricoPdf } from '../lib/exportHistoricoPdf';

export function Historico() {
  const { usages, tractors, operators } = useAppContext();
  
  const [filterTractor, setFilterTractor] = useState('');
  const [filterOperator, setFilterOperator] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredUsages = useMemo(() => {
    return usages.filter(u => {
      if (filterTractor && u.tractorId !== filterTractor) return false;
      if (filterOperator && u.operatorId !== filterOperator) return false;
      
      const depDate = u.departureTime.split('T')[0];
      if (filterStartDate && depDate < filterStartDate) return false;
      if (filterEndDate && depDate > filterEndDate) return false;
      
      return true;
    }).sort((a, b) => new Date(b.departureTime).getTime() - new Date(a.departureTime).getTime());
  }, [usages, filterTractor, filterOperator, filterStartDate, filterEndDate]);

  const totalRpmFiltered = useMemo(() => {
    return filteredUsages.reduce((acc, u) => acc + ((u.finalRpm || u.initialRpm) - u.initialRpm), 0);
  }, [filteredUsages]);

  const totalPages = Math.ceil(filteredUsages.length / itemsPerPage);
  const paginatedUsages = filteredUsages.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleExportCSV = () => {
    const headers = ['ID', 'Operador', 'Trator', 'Placa', 'Saída', 'RPM Inicial', 'Destino', 'Retorno', 'RPM Final', 'RPM Total', 'Status'];

    const rows = filteredUsages.map(u => {
      const op = operators.find(o => o.id === u.operatorId);
      const tr = tractors.find(t => t.id === u.tractorId);
      const rpmTotal = u.finalRpm ? (u.finalRpm - u.initialRpm).toFixed(0) : '';

      return [
        u.id,
        op?.name || 'Desconhecido',
        tr?.name || 'Desconhecido',
        tr?.plate || '',
        new Date(u.departureTime).toLocaleString('pt-BR'),
        u.initialRpm,
        u.destination,
        u.returnTime ? new Date(u.returnTime).toLocaleString('pt-BR') : '',
        u.finalRpm || '',
        rpmTotal,
        u.status === 'OPEN' ? 'Em aberto' : 'Concluído'
      ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(',');
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `historico_frota_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const formatDateOnly = (isoDate: string) => {
    const [y, m, d] = isoDate.split('-');
    return `${d}/${m}/${y}`;
  };

  const handleExportPDF = () => {
    const tractorLabel = filterTractor
      ? (() => {
          const t = tractors.find(t => t.id === filterTractor);
          return t ? `${t.name} (${t.plate})` : 'Todos';
        })()
      : 'Todos';

    const operatorLabel = filterOperator
      ? (operators.find(o => o.id === filterOperator)?.name || 'Todos')
      : 'Todos';

    let periodLabel = 'Todo o período';
    if (filterStartDate && filterEndDate) {
      periodLabel = `${formatDateOnly(filterStartDate)} a ${formatDateOnly(filterEndDate)}`;
    } else if (filterStartDate) {
      periodLabel = `A partir de ${formatDateOnly(filterStartDate)}`;
    } else if (filterEndDate) {
      periodLabel = `Até ${formatDateOnly(filterEndDate)}`;
    }

    exportHistoricoPdf(
      filteredUsages,
      tractors,
      operators,
      { tractorLabel, operatorLabel, periodLabel },
      totalRpmFiltered
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Histórico de Uso</h1>
          <p className="text-gray-500">Consulte e exporte os registros completos.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            disabled={filteredUsages.length === 0}
            className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={20} />
            Exportar CSV
          </button>
          <button
            onClick={handleExportPDF}
            disabled={filteredUsages.length === 0}
            className="flex items-center gap-2 bg-[#1B5E20] hover:bg-[#144d18] text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileText size={20} />
            Exportar PDF
          </button>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Trator</label>
          <select 
            value={filterTractor}
            onChange={e => setFilterTractor(e.target.value)}
            className="w-full p-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-[#1B5E20]"
          >
            <option value="">Todos</option>
            {tractors.map(t => <option key={t.id} value={t.id}>{t.name} ({t.plate})</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Operador</label>
          <select 
            value={filterOperator}
            onChange={e => setFilterOperator(e.target.value)}
            className="w-full p-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-[#1B5E20]"
          >
            <option value="">Todos</option>
            {operators.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data Início</label>
          <input 
            type="date" 
            value={filterStartDate}
            onChange={e => setFilterStartDate(e.target.value)}
            className="w-full p-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-[#1B5E20]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data Fim</label>
          <input 
            type="date" 
            value={filterEndDate}
            onChange={e => setFilterEndDate(e.target.value)}
            className="w-full p-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-[#1B5E20]"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <span className="text-sm font-medium text-gray-600">
            {filteredUsages.length} registros encontrados
          </span>
          <span className="text-sm font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
            Total do período: {totalRpmFiltered.toFixed(0)} RPM
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-white text-gray-500 text-sm border-b border-gray-200">
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Data Saída</th>
                <th className="p-4 font-medium">Operador</th>
                <th className="p-4 font-medium">Trator</th>
                <th className="p-4 font-medium text-right">RPM Saída</th>
                <th className="p-4 font-medium text-right">RPM Retorno</th>
                <th className="p-4 font-medium text-right">Total (RPM)</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsages.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">Nenhum registro encontrado com os filtros atuais.</td>
                </tr>
              ) : (
                paginatedUsages.map(u => {
                  const op = operators.find(o => o.id === u.operatorId);
                  const tr = tractors.find(t => t.id === u.tractorId);
                  return (
                    <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        {u.status === 'OPEN' ? (
                          <span className="inline-block px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">EM ABERTO</span>
                        ) : (
                          <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">CONCLUÍDO</span>
                        )}
                      </td>
                      <td className="p-4 text-sm text-gray-600">{formatDate(u.departureTime)}</td>
                      <td className="p-4 text-sm font-medium text-gray-800">{op?.name}</td>
                      <td className="p-4 text-sm text-gray-600">{tr?.name} <span className="block text-xs text-gray-400">{tr?.plate}</span></td>
                      <td className="p-4 text-sm text-gray-600 text-right">{u.initialRpm}</td>
                      <td className="p-4 text-sm text-gray-600 text-right">{u.finalRpm || '-'}</td>
                      <td className="p-4 text-sm font-bold text-gray-800 text-right">
                        {u.finalRpm ? (u.finalRpm - u.initialRpm).toFixed(0) : '-'}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-white border border-gray-300 rounded text-sm disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-600">Página {currentPage} de {totalPages}</span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-white border border-gray-300 rounded text-sm disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
