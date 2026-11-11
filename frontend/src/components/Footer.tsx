'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Briefcase, Landmark, ShieldCheck, Mail, Phone, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  const { language, t } = useLanguage();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs">
      {/* Top Banner highlight */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">100% Verified Sarkari Recruitment</p>
              <p className="text-slate-400 text-xs">Direct official notifications & apply portals</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Top Private & Tech Startups</p>
              <p className="text-slate-400 text-xs">Competitive salary packages & WFH options</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center border border-orange-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Zero Commission for Job Seekers</p>
              <p className="text-slate-400 text-xs">Completely free application & resume hosting</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-orange-500 flex items-center justify-center text-white font-bold">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <span className="text-2xl font-black text-white tracking-tight">
                  Naukari<span className="text-orange-500">x</span>
                </span>
                <span className="block text-[9px] uppercase font-bold tracking-widest text-emerald-400 -mt-1">
                  All India Job Portal
                </span>
              </div>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              {t('footer_desc')}
            </p>
            <div className="space-y-1.5 pt-2 text-slate-400">
              <p className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-orange-400" />
                <span>Connaught Place, New Delhi, 110001, India</span>
              </p>
              <p className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>support@naukarix.in • contact@naukarix.in</span>
              </p>
            </div>
          </div>

          {/* Sarkari Naukri */}
          <div>
            <h4 className="font-bold text-white text-sm mb-3">
              {language === 'hi' ? 'सरकारी नौकरियां' : 'Sarkari Naukri'}
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/jobs?sector=government&category=1" className="hover:text-white transition">SSC CGL / CHSL 2026</Link></li>
              <li><Link href="/jobs?sector=government&category=2" className="hover:text-white transition">Railway RRB ALP & NTPC</Link></li>
              <li><Link href="/jobs?sector=government&category=3" className="hover:text-white transition">Police & Defence Bharti</Link></li>
              <li><Link href="/jobs?sector=government&category=4" className="hover:text-white transition">Banking SBI / IBPS PO</Link></li>
              <li><Link href="/jobs?sector=government&category=5" className="hover:text-white transition">Teaching REET / CTET</Link></li>
              <li><Link href="/jobs?sector=government" className="hover:text-white transition font-medium text-emerald-400">View All Sarkari Jobs →</Link></li>
            </ul>
          </div>

          {/* State Wise Jobs */}
          <div>
            <h4 className="font-bold text-white text-sm mb-3">
              {language === 'hi' ? 'राज्यवार नौकरियां' : 'State-wise Jobs'}
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/jobs?state=uttar-pradesh" className="hover:text-white transition">Uttar Pradesh (UP Jobs)</Link></li>
              <li><Link href="/jobs?state=bihar" className="hover:text-white transition">Bihar (BPSC / Police)</Link></li>
              <li><Link href="/jobs?state=delhi-ncr" className="hover:text-white transition">Delhi NCR Jobs</Link></li>
              <li><Link href="/jobs?state=maharashtra" className="hover:text-white transition">Maharashtra (Mumbai/Pune)</Link></li>
              <li><Link href="/jobs?state=rajasthan" className="hover:text-white transition">Rajasthan Govt & Pvt</Link></li>
              <li><Link href="/jobs?state=karnataka" className="hover:text-white transition">Karnataka (Bengaluru Tech)</Link></li>
            </ul>
          </div>

          {/* Quick Links & Recruiters */}
          <div>
            <h4 className="font-bold text-white text-sm mb-3">
              {language === 'hi' ? 'नियोक्ता एवं सेवाएं' : 'Recruiters & Tools'}
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/pricing" className="hover:text-white transition font-medium text-orange-400">Recruiter Pricing Plans</Link></li>
              <li><Link href="/employer/post-job" className="hover:text-white transition">Post Free Job</Link></li>
              <li><Link href="/employer/dashboard" className="hover:text-white transition">Recruiter Dashboard</Link></li>
              <li><Link href="/candidate/dashboard" className="hover:text-white transition">Candidate Profile & Resume</Link></li>
              <li><Link href="/admin" className="hover:text-white transition">Admin Portal</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-slate-500 gap-4">
          <p>© 2026 Naukarix. {t('footer_rights')}</p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center text-xs">
              Made with <Heart className="w-3.5 h-3.5 text-red-500 mx-1 fill-red-500" /> for India&apos;s Job Seekers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
