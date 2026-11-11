'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PaymentModal from '@/components/PaymentModal';
import { PricingPlan, Transaction, api } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { CheckCircle2, ShieldCheck, Zap, Sparkles } from 'lucide-react';

export default function PricingPage() {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);

  useEffect(() => {
    async function loadPlans() {
      try {
        const res = await api.getPricingPlans();
        setPlans(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    loadPlans();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
            Transparent Recruiter Pricing
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mt-2">
            Hire Top Indian Talent Faster
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            Post verified jobs, unlock direct candidate phone numbers and resumes, and gain priority visibility across all 36 Indian states.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-3xl p-8 border flex flex-col justify-between transition hover:shadow-2xl ${
                plan.is_popular
                  ? 'border-orange-500 shadow-xl ring-2 ring-orange-500/20'
                  : 'border-slate-200'
              }`}
            >
              {plan.is_popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[11px] font-black uppercase px-4 py-1 rounded-full shadow-md tracking-wider">
                  MOST POPULAR RECRUITER CHOICE
                </div>
              )}

              <div>
                <h3 className="text-2xl font-black text-slate-900">{plan.name}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Ideal for {plan.price === 0 ? 'startups testing portal' : 'high-volume talent acquisition'}
                </p>

                <div className="mt-6 flex items-baseline space-x-1">
                  <span className="text-4xl sm:text-5xl font-black text-slate-900">
                    ₹{plan.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    / {plan.duration_days} days
                  </span>
                </div>

                <div className="my-8 border-t border-slate-100 pt-6 space-y-3">
                  {plan.features?.map((f, i) => (
                    <div key={i} className="flex items-start text-xs text-slate-700 space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setSelectedPlan(plan)}
                className={`w-full py-3.5 rounded-2xl font-bold text-sm transition shadow-md ${
                  plan.is_popular
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-orange-500/20'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                {plan.price === 0 ? 'Start Free' : 'Choose Plan & Checkout'}
              </button>
            </div>
          ))}
        </div>

        {/* Feature Guarantees */}
        <div className="mt-16 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-start space-x-3">
            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-1" />
            <div>
              <p className="font-bold text-slate-900 text-sm">Instant Tax Invoice & GST</p>
              <p className="text-xs text-slate-500 mt-0.5">Automated invoice generation for easy corporate tax deductions.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Zap className="w-6 h-6 text-orange-500 shrink-0 mt-1" />
            <div>
              <p className="font-bold text-slate-900 text-sm">Real-time Candidate Alert Dispatch</p>
              <p className="text-xs text-slate-500 mt-0.5">Your vacancy is broadcasted within minutes to verified candidates.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Sparkles className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
            <div>
              <p className="font-bold text-slate-900 text-sm">Dedicated Account Support</p>
              <p className="text-xs text-slate-500 mt-0.5">Direct phone & WhatsApp support for recruitment assistance.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Payment Modal */}
      <PaymentModal
        plan={selectedPlan}
        isOpen={!!selectedPlan}
        onClose={() => setSelectedPlan(null)}
        onPaymentSuccess={() => {
          setSelectedPlan(null);
          window.location.href = '/employer/post-job';
        }}
      />
    </div>
  );
}
