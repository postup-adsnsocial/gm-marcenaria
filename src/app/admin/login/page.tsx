"use client";

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if already logged in
    const checkSession = async () => {
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          router.push('/admin');
        }
      } else {
        // Fallback for mock mode
        if (localStorage.getItem('gm_admin_auth') === 'true') {
          router.push('/admin');
        }
      }
    };
    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (supabase) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        router.push('/admin');
      } else {
        // Fallback for mock mode
        if (password === 'gm2024') {
          localStorage.setItem('gm_admin_auth', 'true');
          router.push('/admin');
        } else {
          setError('Senha incorreta (Modo Mock: use gm2024)');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex flex-col justify-center items-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="font-serif text-4xl text-secondary mb-2 hover:text-accent transition-colors block">
          <img src="/logo-gm.png" alt="G&M Móveis" className="h-16 w-auto mx-auto mb-6" />
          </Link>
          <p className="text-neutral">Painel Administrativo</p>
        </div>

        <div className="bg-white p-8 rounded-sm shadow-sm border border-neutral/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-sm border border-red-100">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-primary/50 border border-neutral/20 rounded-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                placeholder="admin@gmmoveis.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-primary/50 border border-neutral/20 rounded-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-secondary text-white font-medium rounded-sm hover:bg-secondary/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
          
          {!supabase && (
            <div className="mt-6 p-4 bg-accent/10 rounded-sm text-sm text-accent text-center">
              <strong>Modo Mock Ativo:</strong><br />
              O Supabase não está configurado. Use qualquer e-mail e a senha <strong>gm2024</strong> para acessar.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
