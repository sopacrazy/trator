import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { ApiError } from '../lib/api';
import { Modal } from '../components/Modal';
import { Plus, PowerOff, Pencil } from 'lucide-react';
import { Tractor, Operator, User } from '../types';

function EditTractorForm({ tractor, onClose }: { tractor: Tractor; onClose: () => void }) {
  const { updateTractor } = useAppContext();
  const { showSuccess } = useToast();
  const [name, setName] = useState(tractor.name);
  const [plate, setPlate] = useState(tractor.plate);
  const [model, setModel] = useState(tractor.model);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !plate || !model) return;
    setError('');
    setIsSubmitting(true);
    try {
      await updateTractor(tractor.id, { name, plate, model });
      showSuccess('Trator atualizado com sucesso!');
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível atualizar o trator.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome/Identificação *</label>
        <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5E20] focus:border-[#1B5E20] outline-none" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Placa *</label>
        <input required type="text" value={plate} onChange={e => setPlate(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5E20] focus:border-[#1B5E20] outline-none" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Modelo *</label>
        <input required type="text" value={model} onChange={e => setModel(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5E20] focus:border-[#1B5E20] outline-none" />
      </div>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">{error}</div>}
      <div className="flex justify-end gap-3 mt-2 pt-4 border-t border-gray-100">
        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">Cancelar</button>
        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-[#1B5E20] text-white rounded-lg font-medium hover:bg-[#144d18] transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
          {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
        </button>
      </div>
    </form>
  );
}

function EditOperatorForm({ operator, onClose }: { operator: Operator; onClose: () => void }) {
  const { updateOperator } = useAppContext();
  const { showSuccess } = useToast();
  const [name, setName] = useState(operator.name);
  const [registration, setRegistration] = useState(operator.registration);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !registration) return;
    setError('');
    setIsSubmitting(true);
    try {
      await updateOperator(operator.id, { name, registration });
      showSuccess('Operador atualizado com sucesso!');
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível atualizar o operador.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
        <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5E20] focus:border-[#1B5E20] outline-none" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Matrícula *</label>
        <input required type="text" value={registration} onChange={e => setRegistration(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5E20] focus:border-[#1B5E20] outline-none" />
      </div>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">{error}</div>}
      <div className="flex justify-end gap-3 mt-2 pt-4 border-t border-gray-100">
        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">Cancelar</button>
        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-[#1B5E20] text-white rounded-lg font-medium hover:bg-[#144d18] transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
          {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
        </button>
      </div>
    </form>
  );
}

function EditUserForm({ user, onClose }: { user: User; onClose: () => void }) {
  const { updateUser } = useAppContext();
  const { showSuccess } = useToast();
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !username) return;
    setError('');
    setIsSubmitting(true);
    try {
      await updateUser(user.id, { name, username, password: password || undefined });
      showSuccess('Usuário atualizado com sucesso!');
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível atualizar o usuário.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
        <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5E20] focus:border-[#1B5E20] outline-none" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Usuário (login) *</label>
        <input required type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5E20] focus:border-[#1B5E20] outline-none" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nova senha</label>
        <input type="password" minLength={6} value={password} onChange={e => setPassword(e.target.value)} placeholder="Deixe em branco para manter a senha atual" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5E20] focus:border-[#1B5E20] outline-none" />
      </div>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">{error}</div>}
      <div className="flex justify-end gap-3 mt-2 pt-4 border-t border-gray-100">
        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">Cancelar</button>
        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-[#1B5E20] text-white rounded-lg font-medium hover:bg-[#144d18] transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
          {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
        </button>
      </div>
    </form>
  );
}

export function Cadastros() {
  const {
    tractors, operators, users,
    addTractor, toggleTractorActive,
    addOperator, toggleOperatorActive,
    addUser, toggleUserActive,
  } = useAppContext();
  const { showSuccess } = useToast();

  const [activeTab, setActiveTab] = useState<'tratores' | 'operadores' | 'usuarios'>('tratores');

  // Trator Form State
  const [newTractorName, setNewTractorName] = useState('');
  const [newTractorPlate, setNewTractorPlate] = useState('');
  const [newTractorModel, setNewTractorModel] = useState('');
  const [tractorError, setTractorError] = useState('');
  const [editingTractor, setEditingTractor] = useState<Tractor | null>(null);

  // Operator Form State
  const [newOperatorName, setNewOperatorName] = useState('');
  const [newOperatorReg, setNewOperatorReg] = useState('');
  const [operatorError, setOperatorError] = useState('');
  const [editingOperator, setEditingOperator] = useState<Operator | null>(null);

  // User Form State
  const [newUserName, setNewUserName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [userError, setUserError] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleAddTractor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTractorName || !newTractorPlate || !newTractorModel) return;
    setTractorError('');
    try {
      await addTractor({ name: newTractorName, plate: newTractorPlate, model: newTractorModel });
      showSuccess('Trator adicionado com sucesso!');
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
      showSuccess('Operador adicionado com sucesso!');
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
      showSuccess('Usuário criado com sucesso!');
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
                  <th className="p-4 font-medium text-right">Ações</th>
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
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => setEditingTractor(t)}
                          className="p-2 rounded text-gray-500 hover:bg-gray-100 transition-colors"
                          title="Editar Trator"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleToggle(toggleTractorActive, t.id)}
                          className={`p-2 rounded transition-colors ${t.active ? 'text-red-500 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}
                          title={t.active ? 'Desativar Trator' : 'Ativar Trator'}
                        >
                          <PowerOff size={18} />
                        </button>
                      </div>
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
                  <th className="p-4 font-medium text-right">Ações</th>
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
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => setEditingOperator(o)}
                          className="p-2 rounded text-gray-500 hover:bg-gray-100 transition-colors"
                          title="Editar Operador"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleToggle(toggleOperatorActive, o.id)}
                          className={`p-2 rounded transition-colors ${o.active ? 'text-red-500 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}
                          title={o.active ? 'Desativar Operador' : 'Ativar Operador'}
                        >
                          <PowerOff size={18} />
                        </button>
                      </div>
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
                  <th className="p-4 font-medium text-right">Ações</th>
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
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => setEditingUser(u)}
                          className="p-2 rounded text-gray-500 hover:bg-gray-100 transition-colors"
                          title="Editar Usuário"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleToggle(toggleUserActive, u.id)}
                          className={`p-2 rounded transition-colors ${u.active ? 'text-red-500 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}
                          title={u.active ? 'Desativar Usuário' : 'Ativar Usuário'}
                        >
                          <PowerOff size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={!!editingTractor} onClose={() => setEditingTractor(null)} title="Editar Trator">
        {editingTractor && <EditTractorForm tractor={editingTractor} onClose={() => setEditingTractor(null)} />}
      </Modal>

      <Modal isOpen={!!editingOperator} onClose={() => setEditingOperator(null)} title="Editar Operador">
        {editingOperator && <EditOperatorForm operator={editingOperator} onClose={() => setEditingOperator(null)} />}
      </Modal>

      <Modal isOpen={!!editingUser} onClose={() => setEditingUser(null)} title="Editar Usuário">
        {editingUser && <EditUserForm user={editingUser} onClose={() => setEditingUser(null)} />}
      </Modal>
    </div>
  );
}
