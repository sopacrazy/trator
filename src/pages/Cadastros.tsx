import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ApiError } from '../lib/api';
import { Plus, PowerOff } from 'lucide-react';

export function Cadastros() {
  const {
    tractors, operators, users,
    addTractor, toggleTractorActive,
    addOperator, toggleOperatorActive,
    addUser, toggleUserActive,
  } = useAppContext();

  const [activeTab, setActiveTab] = useState<'tratores' | 'operadores' | 'usuarios'>('tratores');

  // Trator Form State
  const [newTractorName, setNewTractorName] = useState('');
  const [newTractorPlate, setNewTractorPlate] = useState('');
  const [newTractorModel, setNewTractorModel] = useState('');
  const [tractorError, setTractorError] = useState('');

  // Operator Form State
  const [newOperatorName, setNewOperatorName] = useState('');
  const [newOperatorReg, setNewOperatorReg] = useState('');
  const [operatorError, setOperatorError] = useState('');

  // User Form State
  const [newUserName, setNewUserName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [userError, setUserError] = useState('');

  const handleAddTractor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTractorName || !newTractorPlate || !newTractorModel) return;
    setTractorError('');
    try {
      await addTractor({ name: newTractorName, plate: newTractorPlate, model: newTractorModel });
      setNewTractorName('');
      setNewTractorPlate('');
      setNewTractorModel('');
    } catch (err) {
      setTractorError(err instanceof ApiError ? err.message : 'Não foi possível adicionar o trator.');
    }
  };

  const handleAddOperator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOperatorName || !newOperatorReg) return;
    setOperatorError('');
    try {
      await addOperator({ name: newOperatorName, registration: newOperatorReg });
      setNewOperatorName('');
      setNewOperatorReg('');
    } catch (err) {
      setOperatorError(err instanceof ApiError ? err.message : 'Não foi possível adicionar o operador.');
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUsername || !newUserPassword) return;
    setUserError('');
    try {
      await addUser({ name: newUserName, username: newUsername, password: newUserPassword });
      setNewUserName('');
      setNewUsername('');
      setNewUserPassword('');
    } catch (err) {
      setUserError(err instanceof ApiError ? err.message : 'Não foi possível criar o usuário.');
    }
  };

  const handleToggle = (fn: (id: string) => Promise<void>, id: string) => {
    fn(id).catch(err => alert(err instanceof ApiError ? err.message : 'Não foi possível atualizar.'));
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cadastros</h1>
        <p className="text-gray-500">Gerencie a frota de tratores, os operadores e os usuários do sistema.</p>
      </div>

      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('tratores')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'tratores'
              ? 'border-[#1B5E20] text-[#1B5E20]'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Tratores
        </button>
        <button
          onClick={() => setActiveTab('operadores')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'operadores'
              ? 'border-[#1B5E20] text-[#1B5E20]'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Operadores
        </button>
        <button
          onClick={() => setActiveTab('usuarios')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'usuarios'
              ? 'border-[#1B5E20] text-[#1B5E20]'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Usuários
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {activeTab === 'tratores' && (
          <div className="flex flex-col">
            {/* Add form */}
            <form onSubmit={handleAddTractor} className="p-5 bg-gray-50 border-b border-gray-100 flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Nome/Identificação *</label>
                  <input required type="text" value={newTractorName} onChange={e => setNewTractorName(e.target.value)} placeholder="Ex: Trator 04" className="w-full p-2 border border-gray-300 rounded focus:border-[#1B5E20] outline-none text-sm" />
                </div>
                <div className="flex-1 w-full">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Placa *</label>
                  <input required type="text" value={newTractorPlate} onChange={e => setNewTractorPlate(e.target.value)} placeholder="Ex: ABC-1234" className="w-full p-2 border border-gray-300 rounded focus:border-[#1B5E20] outline-none text-sm" />
                </div>
                <div className="flex-1 w-full">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Modelo *</label>
                  <input required type="text" value={newTractorModel} onChange={e => setNewTractorModel(e.target.value)} placeholder="Ex: John Deere" className="w-full p-2 border border-gray-300 rounded focus:border-[#1B5E20] outline-none text-sm" />
                </div>
                <button type="submit" className="bg-[#1B5E20] hover:bg-[#144d18] text-white px-4 py-2 rounded font-medium flex items-center gap-2 text-sm w-full md:w-auto justify-center transition-colors">
                  <Plus size={16} /> Adicionar
                </button>
              </div>
              {tractorError && <p className="text-sm text-red-600">{tractorError}</p>}
            </form>

            <table className="w-full text-left">
              <thead>
                <tr className="bg-white text-gray-500 text-sm border-b border-gray-200">
                  <th className="p-4 font-medium">Nome</th>
                  <th className="p-4 font-medium">Placa</th>
                  <th className="p-4 font-medium">Modelo</th>
                  <th className="p-4 font-medium text-center">Status</th>
                  <th className="p-4 font-medium text-right">Ação</th>
                </tr>
              </thead>
              <tbody>
                {tractors.map(t => (
                  <tr key={t.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${!t.active ? 'opacity-60 bg-gray-50' : ''}`}>
                    <td className="p-4 font-medium text-gray-800">{t.name}</td>
                    <td className="p-4 text-gray-600">{t.plate}</td>
                    <td className="p-4 text-gray-600">{t.model}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-2 py-1 text-xs font-bold rounded-full ${t.active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                        {t.active ? 'ATIVO' : 'INATIVO'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleToggle(toggleTractorActive, t.id)}
                        className={`p-2 rounded transition-colors ${t.active ? 'text-red-500 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}
                        title={t.active ? 'Desativar Trator' : 'Ativar Trator'}
                      >
                        <PowerOff size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'operadores' && (
          <div className="flex flex-col">
            {/* Add form */}
            <form onSubmit={handleAddOperator} className="p-5 bg-gray-50 border-b border-gray-100 flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-[2] w-full">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Nome Completo *</label>
                  <input required type="text" value={newOperatorName} onChange={e => setNewOperatorName(e.target.value)} placeholder="Ex: Roberto Gomes" className="w-full p-2 border border-gray-300 rounded focus:border-[#1B5E20] outline-none text-sm" />
                </div>
                <div className="flex-1 w-full">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Matrícula *</label>
                  <input required type="text" value={newOperatorReg} onChange={e => setNewOperatorReg(e.target.value)} placeholder="Ex: 2040" className="w-full p-2 border border-gray-300 rounded focus:border-[#1B5E20] outline-none text-sm" />
                </div>
                <button type="submit" className="bg-[#1B5E20] hover:bg-[#144d18] text-white px-4 py-2 rounded font-medium flex items-center gap-2 text-sm w-full md:w-auto justify-center transition-colors">
                  <Plus size={16} /> Adicionar
                </button>
              </div>
              {operatorError && <p className="text-sm text-red-600">{operatorError}</p>}
            </form>

            <table className="w-full text-left">
              <thead>
                <tr className="bg-white text-gray-500 text-sm border-b border-gray-200">
                  <th className="p-4 font-medium">Nome</th>
                  <th className="p-4 font-medium">Matrícula</th>
                  <th className="p-4 font-medium text-center">Status</th>
                  <th className="p-4 font-medium text-right">Ação</th>
                </tr>
              </thead>
              <tbody>
                {operators.map(o => (
                  <tr key={o.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${!o.active ? 'opacity-60 bg-gray-50' : ''}`}>
                    <td className="p-4 font-medium text-gray-800">{o.name}</td>
                    <td className="p-4 text-gray-600">{o.registration}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-2 py-1 text-xs font-bold rounded-full ${o.active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                        {o.active ? 'ATIVO' : 'INATIVO'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleToggle(toggleOperatorActive, o.id)}
                        className={`p-2 rounded transition-colors ${o.active ? 'text-red-500 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}
                        title={o.active ? 'Desativar Operador' : 'Ativar Operador'}
                      >
                        <PowerOff size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'usuarios' && (
          <div className="flex flex-col">
            {/* Add form */}
            <form onSubmit={handleAddUser} className="p-5 bg-gray-50 border-b border-gray-100 flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-[2] w-full">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Nome Completo *</label>
                  <input required type="text" value={newUserName} onChange={e => setNewUserName(e.target.value)} placeholder="Ex: Maria Souza" className="w-full p-2 border border-gray-300 rounded focus:border-[#1B5E20] outline-none text-sm" />
                </div>
                <div className="flex-1 w-full">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Usuário (login) *</label>
                  <input required type="text" value={newUsername} onChange={e => setNewUsername(e.target.value)} placeholder="Ex: maria.souza" className="w-full p-2 border border-gray-300 rounded focus:border-[#1B5E20] outline-none text-sm" />
                </div>
                <div className="flex-1 w-full">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Senha *</label>
                  <input required type="password" minLength={6} value={newUserPassword} onChange={e => setNewUserPassword(e.target.value)} placeholder="Mínimo 6 caracteres" className="w-full p-2 border border-gray-300 rounded focus:border-[#1B5E20] outline-none text-sm" />
                </div>
                <button type="submit" className="bg-[#1B5E20] hover:bg-[#144d18] text-white px-4 py-2 rounded font-medium flex items-center gap-2 text-sm w-full md:w-auto justify-center transition-colors">
                  <Plus size={16} /> Adicionar
                </button>
              </div>
              {userError && <p className="text-sm text-red-600">{userError}</p>}
            </form>

            <table className="w-full text-left">
              <thead>
                <tr className="bg-white text-gray-500 text-sm border-b border-gray-200">
                  <th className="p-4 font-medium">Nome</th>
                  <th className="p-4 font-medium">Usuário</th>
                  <th className="p-4 font-medium text-center">Status</th>
                  <th className="p-4 font-medium text-right">Ação</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${!u.active ? 'opacity-60 bg-gray-50' : ''}`}>
                    <td className="p-4 font-medium text-gray-800">{u.name}</td>
                    <td className="p-4 text-gray-600">{u.username}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-2 py-1 text-xs font-bold rounded-full ${u.active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                        {u.active ? 'ATIVO' : 'INATIVO'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleToggle(toggleUserActive, u.id)}
                        className={`p-2 rounded transition-colors ${u.active ? 'text-red-500 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}
                        title={u.active ? 'Desativar Usuário' : 'Ativar Usuário'}
                      >
                        <PowerOff size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
