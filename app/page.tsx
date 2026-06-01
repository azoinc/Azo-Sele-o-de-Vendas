import React from 'react';
import Head from 'next/head';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans flex flex-col md:flex-row overflow-hidden relative">
      {/* Background Atmosphere */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 border-r border-white/10 flex flex-col z-10 backdrop-blur-md bg-black/40 h-auto md:h-screen">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/20 font-bold text-black">AZ</div>
            <h1 className="text-xl font-semibold tracking-tight text-white">Azo Vendas</h1>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3 text-white">
            <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            <span className="text-sm font-medium">Dashboard</span>
          </div>
          <div className="p-3 hover:bg-white/5 rounded-xl flex items-center gap-3 text-white/60 transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            <span className="text-sm font-medium">Corretores</span>
          </div>
          <div className="p-3 hover:bg-white/5 rounded-xl flex items-center gap-3 text-white/60 transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            <span className="text-sm font-medium">Visitas Ativas</span>
          </div>
          <div className="p-3 hover:bg-white/5 rounded-xl flex items-center gap-3 text-white/60 transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            <span className="text-sm font-medium">Relatórios</span>
          </div>
        </nav>

        <div className="p-6 mt-auto border-t border-white/10 hidden md:block">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
              <span className="text-xs text-amber-400 font-bold">ADM</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Roberto Silva</p>
              <p className="text-[10px] text-white/40 uppercase tracking-widest">Gerente Sênior</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-6 md:p-10 z-10 overflow-y-auto h-screen">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 md:mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-light text-white tracking-tight">Bem-vindo ao <span className="font-bold text-amber-500">AZO</span></h2>
            <p className="text-white/40 mt-1 text-sm">Visão geral de pontuação e cadastro de visitas para parceiros imobiliários.</p>
          </div>
          <button className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-full text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            Cadastrar Nova Visita
          </button>
        </header>

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
            <p className="text-[10px] text-amber-500 mt-2 font-medium">Meta mensal: 80% concluída</p>
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
            <span className="text-[10px] text-white/30 hidden sm:block">Filtrar por: Todos os Corretores</span>
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
                  <td className="py-4 px-6 md:px-8 text-right font-mono text-amber-500">+150</td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6 md:px-8">
                    <p className="font-medium text-white">Julia Fernandes</p>
                    <p className="text-xs text-white/40 whitespace-nowrap">(11) 97711-5544</p>
                  </td>
                  <td className="py-4 px-6 md:px-8 text-white/60">Ana Luiza Santos (CRECI: 4421)</td>
                  <td className="py-4 px-6 md:px-8 text-white">A Noite</td>
                  <td className="py-4 px-6 md:px-8 text-center text-white/40 whitespace-nowrap">11 Abr, 2024</td>
                  <td className="py-4 px-6 md:px-8 text-right font-mono text-amber-500">+150</td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6 md:px-8">
                    <p className="font-medium text-white">Fernando Braga</p>
                    <p className="text-xs text-white/40 whitespace-nowrap">(11) 96541-0099</p>
                  </td>
                  <td className="py-4 px-6 md:px-8 text-white/60">Ricardo Mendes (CRECI: 9812)</td>
                  <td className="py-4 px-6 md:px-8 text-white">Gávea 99</td>
                  <td className="py-4 px-6 md:px-8 text-center text-white/40 whitespace-nowrap">10 Abr, 2024</td>
                  <td className="py-4 px-6 md:px-8 text-right font-mono text-amber-500">+150</td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6 md:px-8">
                    <p className="font-medium text-white">Beatriz Soares</p>
                    <p className="text-xs text-white/40 whitespace-nowrap">(11) 98111-9988</p>
                  </td>
                  <td className="py-4 px-6 md:px-8 text-white/60">Caio Vinicius (CRECI: 1023)</td>
                  <td className="py-4 px-6 md:px-8 text-white">Ar Ipanema</td>
                  <td className="py-4 px-6 md:px-8 text-center text-white/40 whitespace-nowrap">10 Abr, 2024</td>
                  <td className="py-4 px-6 md:px-8 text-right font-mono text-amber-500">+150</td>
                </tr>
              </tbody>
            </table>
          </div>
          <footer className="p-4 border-t border-white/5 bg-black/20 flex justify-center items-center gap-4">
            <span className="text-[10px] text-white/20">Mostrando 4 de 1,482 entradas</span>
          </footer>
        </section>
      </main>
    </div>
  );
}
