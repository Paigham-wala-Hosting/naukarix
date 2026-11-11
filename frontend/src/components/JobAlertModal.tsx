'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import { X, Bell, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface JobAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JobAlertModal({ isOpen, onClose }: JobAlertModalProps) {
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [keyword, setKeyword] = useState('');
  const [sector, setSector] = useState('all');
  const [workMode, setWorkMode] = useState('all');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.subscribeJobAlert({
        email,
        phone,
        keyword,
        sector: sector === 'all' ? null : sector,
        work_mode: workMode === 'all' ? null : workMode,
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setEmail('');
        setPhone('');
        setKeyword('');
      }, 2500);
    } catch (err: any) {
      setError(err.message || 'Subscription failed. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="py-6 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              {language === 'hi' ? 'जॉब अलर्ट सक्रिय हो गया!' : 'Job Alerts Activated!'}
            </h3>
            <p className="text-xs text-slate-600">
              {language === 'hi'
                ? 'नई सरकारी एवं प्राइवेट भर्तियों की अधिसूचना आपके ईमेल और व्हाट्सएप पर भेजी जाएगी।'
                : 'You will receive timely updates on newly matching government & corporate vacancies.'}
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {language === 'hi' ? 'मुफ्त जॉब अलर्ट प्राप्त करें' : 'Get Free Job Alerts'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'hi' ? 'व्हाट्सएप एवं ईमेल पर सीधी सूचना' : 'Direct notifications via Email & WhatsApp'}
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'hi' ? 'ईमेल पता' : 'Email Address'} *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'hi' ? 'व्हाट्सएप मोबाइल नंबर' : 'WhatsApp Number (Optional)'}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'hi' ? 'लक्ष्य पद / विषय (कीवर्ड)' : 'Target Keywords (e.g. SSC, React, Bank)'}
                </label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g. Teacher, SSC CGL, Python"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {language === 'hi' ? 'क्षेत्र' : 'Sector'}
                  </label>
                  <select
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-hidden"
                  >
                    <option value="all">{language === 'hi' ? 'सभी क्षेत्र' : 'All Sectors'}</option>
                    <option value="government">{language === 'hi' ? 'सरकारी (Sarkari)' : 'Government'}</option>
                    <option value="private">{language === 'hi' ? 'प्राइवेट' : 'Private'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {language === 'hi' ? 'कार्य माध्यम' : 'Work Mode'}
                  </label>
                  <select
                    value={workMode}
                    onChange={(e) => setWorkMode(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-hidden"
                  >
                    <option value="all">{language === 'hi' ? 'सभी' : 'Any'}</option>
                    <option value="remote">{language === 'hi' ? 'वर्क फ्रॉम होम (WFH)' : 'Work From Home'}</option>
                    <option value="on-site">{language === 'hi' ? 'ऑन-साइट' : 'On-site'}</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-2.5 rounded-xl transition shadow-md flex items-center justify-center space-x-2 text-sm"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{language === 'hi' ? 'अलर्ट चालू करें' : 'Activate Free Alerts'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
