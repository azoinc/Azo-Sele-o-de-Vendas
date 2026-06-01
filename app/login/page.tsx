'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { motion } from 'motion/react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // In the API spec, login is by CPF. In Firebase Auth, we use email.
      // For this implementation, we assume the user logs in with an email address.
      // If CPF is required by business rules, standard practice in Firebase is to format it as cpf@azo.com.br
      const emailToUse = email.includes('@') ? email : `${email.replace(/\D/g, '')}@azo-vendas.com.br`;
      
      await signInWithEmailAndPassword(auth, emailToUse, password);
      router.push('/');
    } catch (err: any) {
      console.error(err);
      setError('Credenciais inválidas. Verifique seu e-mail/CPF e senha.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans flex flex-col justify-center items-center overflow-hidden relative">
      {/* Background Atmosphere */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#61072E]/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 md:p-10 bg-white/[0.03] border border-white/10 rounded-3xl z-10 backdrop-blur-md shadow-2xl"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-[#61072E] to-[#3a041c] rounded-2xl flex items-center justify-center shadow-lg shadow-[#61072E]/30 font-bold text-white text-2xl mb-4">
            AZ
          </div>
          <h1 className="text-3xl font-light tracking-tight text-white">Azo <span className="font-bold text-[#9d1450]">Vendas</span></h1>
          <p className="text-white/40 mt-2 text-sm text-center">Entre para gerenciar suas visitas e pontos.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium text-center">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-white/50 font-medium ml-1">E-mail ou CPF</label>
            <input 
              type="text" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-[#61072E]/50 focus:ring-1 focus:ring-[#61072E]/50 transition-all text-white placeholder-white/20"
              placeholder="Digite seu e-mail ou CPF..."
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-white/50 font-medium ml-1">Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-[#61072E]/50 focus:ring-1 focus:ring-[#61072E]/50 transition-all text-white placeholder-white/20"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full mt-4 bg-[#61072E] hover:bg-[#850a3f] disabled:opacity-50 disabled:hover:bg-[#61072E] text-white font-bold rounded-xl px-6 py-4 uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(97,7,46,0.4)] flex justify-center items-center"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              'Acessar Plataforma'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
