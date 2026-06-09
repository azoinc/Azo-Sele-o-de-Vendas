'use client';

import React, { useEffect, useState } from 'react';
import { auth, db, firebaseConfig } from '@/lib/firebase';
import { signOut, onAuthStateChanged, User, getAuth as getSecondaryAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { initializeApp, getApps } from 'firebase/app';
import { doc, getDoc, setDoc, collection, addDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ totais: 0, ptos: 0, active: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          const docRef = doc(db, 'usuarios', u.uid);
          const snap = await getDoc(docRef);
          
          if (snap.exists()) {
            setRole(snap.data().role);
          } else {
            // Documento não existe - usuário precisa ser criado pelo admin
            setError('Usuário não configurado. Contate o administrador para criar seu acesso.');
            await signOut(auth);
          }
        } catch (e) {
          console.error(e);
        }
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  // Estado e função para consultar usuários do Firestore
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);

  const fetchUsuarios = async () => {
    setLoadingUsuarios(true);
    try {
      const q = query(collection(db, 'usuarios'));
      const querySnapshot = await getDocs(q);
      const usuariosList: any[] = [];
      querySnapshot.forEach((doc) => {
        usuariosList.push({ id: doc.id, ...doc.data() });
      });
      setUsuarios(usuariosList);
    } catch (err) {
      console.error('Erro ao buscar usuários:', err);
    } finally {
      setLoadingUsuarios(false);
    }
  };

  const getRoleLabel = (r: string | null) => {
    switch (r) {
      case 'master': return 'Master';
      case 'admin': return 'Admin';
      case 'gestor_imob': return 'Gestor Imob';
      case 'corretor': return 'Corretor';
      default: return 'Corretor';
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans flex flex-col md:flex-row overflow-hidden relative">
      {/* Background Atmosphere */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#61072E]/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 border-r border-white/10 flex flex-col z-10 backdrop-blur-md bg-black/40 h-auto md:h-screen">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#61072E] to-[#3a041c] rounded-lg flex items-center justify-center shadow-lg shadow-[#61072E]/30 font-bold text-white">AZ</div>
            <h1 className="text-xl font-semibold tracking-tight text-white">Azo Vendas</h1>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          <div 
            onClick={() => setActiveTab('dashboard')} 
            className={`p-3 rounded-xl flex items-center gap-3 transition-colors cursor-pointer ${activeTab === 'dashboard' ? 'bg-white/5 border border-white/10 text-white' : 'hover:bg-white/5 text-white/60'}`}
          >
            <svg className={`w-5 h-5 ${activeTab === 'dashboard' ? 'opacity-80' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            <span className="text-sm font-medium">Dashboard</span>
          </div>
          <div 
            onClick={() => setActiveTab('corretores')} 
            className={`p-3 rounded-xl flex items-center gap-3 transition-colors cursor-pointer ${activeTab === 'corretores' ? 'bg-white/5 border border-white/10 text-white' : 'hover:bg-white/5 text-white/60'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            <span className="text-sm font-medium">Corretores</span>
          </div>
          <div 
            onClick={() => setActiveTab('visitas')} 
            className={`p-3 rounded-xl flex items-center gap-3 transition-colors cursor-pointer ${activeTab === 'visitas' ? 'bg-white/5 border border-white/10 text-white' : 'hover:bg-white/5 text-white/60'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            <span className="text-sm font-medium">Visitas Ativas</span>
          </div>
        </nav>

        <div className="p-6 mt-auto border-t border-white/10 hidden md:block">
          <div className="flex items-center gap-3 w-full">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
              <span className="text-xs text-[#9d1450] font-bold">ADM</span>
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-white">Roberto Silva</p>
              <p className="text-[10px] text-white/40 uppercase tracking-widest">{getRoleLabel(role)}</p>
            </div>
            <button onClick={handleLogout} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white" title="Sair">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-6 md:p-10 z-10 overflow-y-auto h-screen">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 md:mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-light text-white tracking-tight">Bem-vindo ao <span className="font-bold text-[#61072E]">AZO</span></h2>
            <p className="text-white/40 mt-1 text-sm">
              Visão geral de visitas baseada no seu nível de acesso: <span className="font-medium text-white">{getRoleLabel(role)}</span>
            </p>
          </div>
          <div className="flex gap-2 flex-col sm:flex-row">
            {(role === 'master' || role === 'admin') && (
              <button 
                onClick={() => setActiveTab('gerenciar')}
                className={`px-6 py-3 font-bold rounded-full text-xs uppercase tracking-widest transition-all ${activeTab === 'gerenciar' ? 'bg-blue-600 text-white' : 'bg-blue-900/30 border border-blue-500/30 hover:bg-blue-800/40 text-blue-300'}`}
              >
                Gerenciar Acessos
              </button>
            )}
            <button 
              onClick={() => setActiveTab('nova_visita')}
              className={`px-6 py-3 font-bold rounded-full text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(97,7,46,0.5)] ${activeTab === 'nova_visita' ? 'bg-[#9d1450] text-white' : 'bg-[#61072E] hover:bg-[#850a3f] text-white'}`}
            >
              Cadastrar Nova Visita
            </button>
          </div>
        </header>

        {/* Dynamic Content Views */}
        {activeTab === 'dashboard' && (
          <>
            {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 md:mb-10">
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path></svg>
            </div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-1">Visitas Totais</p>
            <p className="text-3xl font-bold text-white">1.482</p>
            <p className="text-[10px] text-green-400 mt-2 font-medium">+12% em relação ao mês anterior</p>
          </div>
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden">
            <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-1">Pontos Gerados</p>
            <p className="text-3xl font-bold text-white">24.890</p>
            <p className="text-[10px] text-[#A91E54] mt-2 font-medium">Meta mensal: 80% concluída</p>
          </div>
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden">
            <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-1">Leads Ativos</p>
            <p className="text-3xl font-bold text-white">643</p>
            <p className="text-[10px] text-white/20 mt-2">Visitantes registrados na plataforma</p>
          </div>
        </div>

        {/* Main Table Section */}
        <section className="flex-1 bg-white/[0.03] border border-white/10 rounded-3xl flex flex-col overflow-hidden min-h-[400px]">
          <div className="p-4 md:p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-white/70">Últimas Visitas Registradas</h3>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr className="text-[10px] text-white/30 uppercase tracking-widest border-b border-white/5">
                  <th className="py-4 px-6 md:px-8 font-medium">Visitante / Lead</th>
                  <th className="py-4 px-6 md:px-8 font-medium">Corretor Responsável</th>
                  <th className="py-4 px-6 md:px-8 font-medium">Empreendimento</th>
                  <th className="py-4 px-6 md:px-8 font-medium text-center">Data</th>
                  <th className="py-4 px-6 md:px-8 font-medium text-right">Pontos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02] text-sm">
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6 md:px-8">
                    <p className="font-medium text-white">Marcos Oliveira</p>
                    <p className="text-xs text-white/40 whitespace-nowrap">(11) 98822-1234</p>
                  </td>
                  <td className="py-4 px-6 md:px-8 text-white/60">Ricardo Mendes (CRECI: 9812)</td>
                  <td className="py-4 px-6 md:px-8 text-white">Insigna Península</td>
                  <td className="py-4 px-6 md:px-8 text-center text-white/40 whitespace-nowrap">12 Abr, 2024</td>
                  <td className="py-4 px-6 md:px-8 text-right font-mono text-[#D0407B]">+150</td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6 md:px-8">
                    <p className="font-medium text-white">Julia Fernandes</p>
                    <p className="text-xs text-white/40 whitespace-nowrap">(11) 97711-5544</p>
                  </td>
                  <td className="py-4 px-6 md:px-8 text-white/60">Ana Luiza Santos (CRECI: 4421)</td>
                  <td className="py-4 px-6 md:px-8 text-white">A Noite</td>
                  <td className="py-4 px-6 md:px-8 text-center text-white/40 whitespace-nowrap">11 Abr, 2024</td>
                  <td className="py-4 px-6 md:px-8 text-right font-mono text-[#D0407B]">+150</td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6 md:px-8">
                    <p className="font-medium text-white">Fernando Braga</p>
                    <p className="text-xs text-white/40 whitespace-nowrap">(11) 96541-0099</p>
                  </td>
                  <td className="py-4 px-6 md:px-8 text-white/60">Ricardo Mendes (CRECI: 9812)</td>
                  <td className="py-4 px-6 md:px-8 text-white">Gávea 99</td>
                  <td className="py-4 px-6 md:px-8 text-center text-white/40 whitespace-nowrap">10 Abr, 2024</td>
                  <td className="py-4 px-6 md:px-8 text-right font-mono text-[#D0407B]">+150</td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6 md:px-8">
                    <p className="font-medium text-white">Beatriz Soares</p>
                    <p className="text-xs text-white/40 whitespace-nowrap">(11) 98111-9988</p>
                  </td>
                  <td className="py-4 px-6 md:px-8 text-white/60">Caio Vinicius (CRECI: 1023)</td>
                  <td className="py-4 px-6 md:px-8 text-white">Ar Ipanema</td>
                  <td className="py-4 px-6 md:px-8 text-center text-white/40 whitespace-nowrap">10 Abr, 2024</td>
                  <td className="py-4 px-6 md:px-8 text-right font-mono text-[#D0407B]">+150</td>
                </tr>
              </tbody>
            </table>
          </div>
          <footer className="p-4 border-t border-white/5 bg-black/20 flex justify-center items-center gap-4">
            <span className="text-[10px] text-white/20">Mostrando 4 de 1,482 entradas</span>
          </footer>
        </section>
          </>
        )}

        {activeTab === 'corretores' && (
          <section className="flex-1 bg-white/[0.03] border border-white/10 rounded-3xl flex flex-col items-center justify-center min-h-[400px]">
            <svg className="w-16 h-16 text-white/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            <h3 className="text-xl font-light text-white mb-2">Lista de Corretores</h3>
            <p className="text-sm text-white/40">Visualização de corretores ativos ainda será implementada.</p>
          </section>
        )}

        {activeTab === 'visitas' && (
          <section className="flex-1 bg-white/[0.03] border border-white/10 rounded-3xl flex flex-col items-center justify-center min-h-[400px]">
            <svg className="w-16 h-16 text-white/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            <h3 className="text-xl font-light text-white mb-2">Visitas Ativas (Processamento)</h3>
            <p className="text-sm text-white/40">Dashboard detalhado de visitas ativas em construção.</p>
          </section>
        )}

        {activeTab === 'nova_visita' && (
          <NovaVisitaForm user={user} onSuccess={() => setActiveTab('dashboard')} />
        )}

        {activeTab === 'gerenciar' && (
          <GerenciarAcessos />
        )}
      </main>
    </div>
  );
}

function NovaVisitaForm({ user, onSuccess }: { user: User | null; onSuccess: () => void }) {
  const [visitanteNome, setVisitanteNome] = useState('');
  const [visitanteTelefone, setVisitanteTelefone] = useState('');
  const [empreendimento, setEmpreendimento] = useState('');
  const [descricao, setDescricao] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    setSuccess('');
    setError('');

    try {
      await addDoc(collection(db, 'visitas'), {
        corretorId: user.uid,
        visitanteNome,
        visitanteTelefone,
        empreendimento,
        descricao,
        dataVisita: new Date().toISOString(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setSuccess('Visita registrada com sucesso!');
      setVisitanteNome('');
      setVisitanteTelefone('');
      setEmpreendimento('');
      setDescricao('');
      
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setError('Erro ao registrar visita: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="p-8 bg-white/[0.03] border border-white/10 rounded-3xl min-h-[400px]">
      <h3 className="text-xl font-semibold text-white mb-6">Cadastrar Nova Visita</h3>
      
      {success && (
        <div className="p-4 mb-6 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
          {success}
        </div>
      )}
      
      {error && (
        <div className="p-4 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Nome do Visitante</label>
            <input 
              required
              type="text" 
              value={visitanteNome}
              onChange={(e) => setVisitanteNome(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#61072E] transition-colors" 
              placeholder="Ex: Marcos Oliveira" 
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Contato</label>
            <input 
              required
              type="text" 
              value={visitanteTelefone}
              onChange={(e) => setVisitanteTelefone(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#61072E] transition-colors" 
              placeholder="(11) 90000-0000" 
            />
          </div>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Empreendimento</label>
          <select 
            required
            value={empreendimento}
            onChange={(e) => setEmpreendimento(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#61072E] transition-colors"
          >
            <option value="" className="bg-gray-900">Selecione o empreendimento...</option>
            <option value="Insigna Península" className="bg-gray-900">Insigna Península</option>
            <option value="A Noite" className="bg-gray-900">A Noite</option>
            <option value="Gávea 99" className="bg-gray-900">Gávea 99</option>
            <option value="Ar Ipanema" className="bg-gray-900">Ar Ipanema</option>
          </select>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Descrição / Feedback</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={3}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#61072E] transition-colors resize-none"
            placeholder="Descreva como foi a visita..."
          />
        </div>
        <div className="pt-4 flex justify-end">
          <button 
            type="submit" 
            disabled={isLoading}
            className="px-8 py-3 bg-[#61072E] hover:bg-[#850a3f] disabled:opacity-50 text-white font-bold rounded-xl text-sm uppercase tracking-widest transition-all"
          >
            {isLoading ? 'Registrando...' : 'Registrar e Gerar Pontos'}
          </button>
        </div>
      </form>
    </section>
  );
}

function GerenciarAcessos() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [newRole, setNewRole] = useState('corretor');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess('');
    setError('');

    try {
      // Cria um app secundario para não deslogar o admin
      const secondaryApp = getApps().find(a => a.name === 'Secondary') || initializeApp(firebaseConfig, 'Secondary');
      const secondaryAuth = getSecondaryAuth(secondaryApp);
      
      const emailToUse = email.includes('@') ? email : `${email.replace(/\D/g, '')}@azo-vendas.com.br`;
      
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, emailToUse, senha);
      
      // Salva no firestore
      await setDoc(doc(db, 'usuarios', userCredential.user.uid), {
        email: emailToUse,
        nome,
        role: newRole,
        createdAt: new Date().toISOString()
      });

      // Desloga do secundario
      await secondaryAuth.signOut();
      
      setSuccess('Usuário criado com sucesso!');
      setNome('');
      setEmail('');
      setSenha('');
      setNewRole('corretor');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Este e-mail/CPF já está em uso.');
      } else if (err.code === 'auth/weak-password') {
        setError('A senha deve ter pelo menos 6 caracteres.');
      } else {
        setError('Erro ao criar usuário: ' + err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="p-8 bg-blue-900/10 border border-blue-500/20 rounded-3xl min-h-[400px]">
      <h3 className="text-xl font-semibold text-white mb-2">Gerenciamento de Acessos</h3>
      <p className="text-sm text-white/50 mb-8 max-w-3xl">
        Crie novos Administradores, Gestores de Imobiliária ou Corretores. O acesso será criado automaticamente no sistema.
      </p>

      {success && (
        <div className="p-4 mb-6 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
          {success}
        </div>
      )}

      {error && (
        <div className="p-4 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
          {error}
        </div>
      )}
      
      <form onSubmit={handleCreateUser} className="max-w-2xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Nome Completo</label>
            <input required type="text" value={nome} onChange={e => setNome(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors" placeholder="Nome do usuário" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">E-mail ou CPF</label>
            <input required type="text" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors" placeholder="Email ou CPF" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Senha Provisória</label>
            <input required minLength={6} type="password" value={senha} onChange={e => setSenha(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors" placeholder="Mínimo 6 caracteres" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Nível de Acesso (Role)</label>
            <select value={newRole} onChange={e => setNewRole(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors">
              <option value="corretor" className="bg-gray-900">Corretor</option>
              <option value="gestor_imob" className="bg-gray-900">Gestor de Imobiliária</option>
              <option value="admin" className="bg-gray-900">Administrador Geral</option>
              <option value="master" className="bg-gray-900">Master</option>
            </select>
          </div>
        </div>
        
        <div className="pt-4 flex justify-end">
          <button disabled={isLoading} type="submit" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm uppercase tracking-widest transition-all">
            {isLoading ? 'Criando...' : 'Criar Usuário'}
          </button>
        </div>
      </form>
    </section>
  );
}
