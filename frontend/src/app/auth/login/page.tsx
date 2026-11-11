'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Briefcase, Lock, Mail, AlertCircle, Loader2, User, Building2, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const { login, loginAsCandidate, loginAsEmployer, loginAsAdmin } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role === 'candidate') {
        router.push('/candidate/dashboard');
      } else if (loggedUser.role === 'employer') {
        router.push('/employer/dashboard');
      } else if (loggedUser.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/jobs');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role: 'candidate' | 'employer' | 'admin') => {
    setLoading(true);
    setError(null);
    try {
      if (role === 'candidate') {
        await loginAsCandidate();
        router.push('/candidate/dashboard');
      } else if (role === 'employer') {
        await loginAsEmployer();
        router.push('/employer/dashboard');
      } else {
        await loginAsAdmin();
        router.push('/admin');
      }
    } catch (err: any) {
      setError(err.message || 'Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-10">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-orange-500 flex items-center justify-center text-white mx-auto mb-3 shadow-md">
              <Briefcase className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-slate-900">
              {language === 'hi' ? 'नौकरीएक्स में साइन इन करें' : 'Sign in to Naukarix'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Access your saved applications, resume, or recruiter portal
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-md flex items-center justify-center space-x-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Sign In</span>
            </button>
          </form>

          {/* Quick 1-Click Demo Login Panel */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-[11px] font-bold text-center text-slate-500 uppercase tracking-wider mb-2">
              Instant 1-Click Demo Access
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('candidate')}
                className="p-2 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100/80 text-blue-800 text-[11px] font-bold flex flex-col items-center space-y-1 transition"
              >
                <User className="w-4 h-4" />
                <span>Candidate</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('employer')}
                className="p-2 rounded-xl border border-orange-200 bg-orange-50/60 hover:bg-orange-100/80 text-orange-800 text-[11px] font-bold flex flex-col items-center space-y-1 transition"
              >
                <Building2 className="w-4 h-4" />
                <span>Recruiter</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="p-2 rounded-xl border border-red-200 bg-red-50/60 hover:bg-red-100/80 text-red-800 text-[11px] font-bold flex flex-col items-center space-y-1 transition"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-slate-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="font-bold text-blue-600 hover:text-blue-700">
              Create an account
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
