'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { 
  Briefcase, 
  Landmark, 
  Laptop, 
  GraduationCap, 
  MapPin, 
  PlusCircle, 
  LogOut, 
  Menu, 
  X, 
  Languages,
  ShieldCheck,
  Building2,
  BellRing,
  PhoneCall,
  Hotel,
  Utensils,
  Headphones,
  FileText,
  ShoppingBag,
  Bike,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  onOpenAlertModal?: () => void;
  userCity?: string;
  onCityClick?: () => void;
}

export default function Navbar({ onOpenAlertModal, userCity, onCityClick }: NavbarProps) {
  const { language, toggleLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname?.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs font-sans">
      {/* Top micro notification strip */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* User City Location Indicator */}
            <button
              onClick={onCityClick}
              className="inline-flex items-center text-amber-300 hover:text-white font-bold bg-slate-800/90 px-2.5 py-0.5 rounded-full border border-amber-500/40 transition"
              title="Click to change city"
            >
              <MapPin className="w-3 h-3 text-red-400 mr-1 animate-bounce" />
              <span>
                {language === 'hi' ? 'आपका शहर:' : 'Your City:'}{' '}
                <b className="text-white underline">{userCity || 'Lucknow'}</b>
              </span>
              <span className="text-[10px] ml-1.5 text-slate-400">
                ({language === 'hi' ? 'बदलें' : 'Change'})
              </span>
            </button>

            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline text-slate-300 text-[11px]">
              {language === 'hi'
                ? 'कॉल सेंटर, होटल, रेस्टोरेंट, दुकान व शोरूम में 8वीं से 12वीं पास नौकरियां'
                : 'Direct Staffing: Call Center, Hotel, Restaurant & Retail for 8th, 10th & 12th Pass'}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {onOpenAlertModal && (
              <button
                onClick={onOpenAlertModal}
                className="text-amber-400 hover:text-amber-300 flex items-center text-xs font-bold"
              >
                <BellRing className="w-3.5 h-3.5 mr-1 animate-pulse" />
                <span className="hidden sm:inline">
                  {language === 'hi' ? 'मुफ्त जॉब अलर्ट प्राप्त करें' : 'Get Free Job Alerts'}
                </span>
              </button>
            )}

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-white px-2.5 py-1 rounded-lg text-xs font-bold border border-slate-700 transition"
              title="Change Language / भाषा बदलें"
            >
              <Languages className="w-3.5 h-3.5 text-orange-400" />
              <span>{language === 'hi' ? 'English' : 'हिन्दी'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header: Logo + Biodata Button + Staff Chahiye Post Job Button + Auth */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-orange-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-slate-900">
                Naukari<span className="text-orange-500">x</span>
              </span>
              <span className="block text-[9px] uppercase font-black tracking-widest text-emerald-600 -mt-1">
                Private Staffing Portal
              </span>
            </div>
          </Link>

          {/* Desktop Right Action Buttons (ONLY Biodata, Post Job, & Auth) */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Free Biodata / Resume Maker Button */}
            <Link
              href="/resume-builder"
              className="px-4 py-2 rounded-xl text-xs font-black transition flex items-center space-x-1.5 border border-orange-300 bg-orange-50 text-orange-900 hover:bg-orange-600 hover:text-white hover:border-orange-600 shadow-sm"
            >
              <FileText className="w-4 h-4 shrink-0 text-orange-600" />
              <span>{language === 'hi' ? '📄 बायोडाटा बनाएं (Free Resume)' : '📄 Build Free Resume'}</span>
            </Link>

            {/* Post Job / Staff Chahiye Button */}
            <Link
              href="/employer/post-job"
              className="flex items-center space-x-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-4 py-2 rounded-xl text-xs font-black shadow-md shadow-orange-500/20 transition transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{language === 'hi' ? '✨ स्टाफ चाहिए? जॉब पोस्ट करें' : '✨ Post Free Vacancy'}</span>
            </Link>

            {/* Auth section */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 text-xs bg-slate-100 hover:bg-slate-200 border border-slate-300 py-1.5 px-3 rounded-xl font-bold transition"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <span className="max-w-[100px] truncate text-slate-800">{user.name}</span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-500">Signed in as</p>
                      <p className="text-xs font-bold text-slate-900 truncate">{user.email}</p>
                      <span className="inline-block bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded mt-1 uppercase">
                        {user.role}
                      </span>
                    </div>

                    {user.role === 'candidate' && (
                      <Link
                        href="/candidate/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                      >
                        {t('nav_candidate_dashboard')}
                      </Link>
                    )}

                    {(user.role === 'employer' || user.role === 'admin') && (
                      <Link
                        href="/employer/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                      >
                        {t('nav_employer_dashboard')}
                      </Link>
                    )}

                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 inline-block mr-1 text-red-500" />
                        {t('nav_admin_panel')}
                      </Link>
                    )}

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center space-x-1"
                      >
                        <LogOut className="w-3.5 h-3.5 mr-1" />
                        <span>{t('nav_logout')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/auth/login"
                  className="text-xs font-bold text-slate-700 hover:text-blue-600 px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 transition"
                >
                  {t('nav_login')}
                </Link>
                <Link
                  href="/auth/register"
                  className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-2 rounded-xl transition shadow-xs"
                >
                  {t('nav_register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center space-x-2">
            <Link
              href="/resume-builder"
              className="p-1.5 rounded-lg border border-orange-200 bg-orange-50 text-orange-900 text-xs font-bold"
              title="बायोडाटा बनाएं"
            >
              📄
            </Link>
            <Link
              href="/employer/post-job"
              className="bg-orange-500 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold shadow-xs"
            >
              + जॉब पोस्ट
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'मेनू बंद करें (Close navigation menu)' : 'मेनू खोलें (Open navigation menu)'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav"
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-300 focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* SUB-HEADER RIBBON: Category-Wise Buttons placed cleanly right UNDER the Header */}
      <div className="bg-slate-100/90 border-t border-slate-200 py-2 px-4 sm:px-6 lg:px-8 overflow-x-auto scrollbar-none shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center space-x-2 min-w-max">
          {/* Private Jobs Button (Primary Focus) */}
          <Link
            href="/jobs?sector=private"
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 border shadow-2xs ${
              isActive('/jobs?sector=private')
                ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                : 'bg-white text-blue-900 border-blue-200 hover:bg-blue-600 hover:text-white hover:border-blue-600'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 shrink-0" />
            <span>{language === 'hi' ? '🏢 प्राइवेट नौकरियां' : '🏢 Private Jobs'}</span>
          </Link>

          {/* Call Center Button */}
          <Link
            href="/jobs?category=call-center-bpo"
            className="px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 border border-purple-200 bg-white text-purple-900 hover:bg-purple-600 hover:text-white hover:border-purple-600 shadow-2xs"
          >
            <Headphones className="w-3.5 h-3.5 shrink-0" />
            <span>{language === 'hi' ? '🎧 कॉल सेंटर' : 'Call Center'}</span>
          </Link>

          {/* Hotel & Restaurant Button */}
          <Link
            href="/jobs?category=hotel-hospitality"
            className="px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 border border-amber-200 bg-white text-amber-900 hover:bg-amber-600 hover:text-white hover:border-amber-600 shadow-2xs"
          >
            <Hotel className="w-3.5 h-3.5 shrink-0" />
            <span>{language === 'hi' ? '🏨 होटल व रेस्टोरेंट' : 'Hotel & Restaurant'}</span>
          </Link>

          {/* 8th to 12th Pass Button */}
          <Link
            href="/jobs?is_fresher=true"
            className="px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 border border-emerald-200 bg-white text-emerald-900 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 shadow-2xs"
          >
            <GraduationCap className="w-3.5 h-3.5 shrink-0" />
            <span>{language === 'hi' ? '🎓 8वीं से 12वीं पास' : '8th-12th Pass'}</span>
          </Link>

          {/* Work From Home Button */}
          <Link
            href="/jobs?work_mode=remote"
            className="px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 border border-indigo-200 bg-white text-indigo-900 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 shadow-2xs"
          >
            <Laptop className="w-3.5 h-3.5 shrink-0" />
            <span>{language === 'hi' ? '💻 घर बैठे काम (WFH)' : 'Work From Home'}</span>
          </Link>

          {/* Delivery & Logistics Button */}
          <Link
            href="/jobs?category=delivery-logistics"
            className="px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 border border-cyan-200 bg-white text-cyan-900 hover:bg-cyan-600 hover:text-white hover:border-cyan-600 shadow-2xs"
          >
            <Bike className="w-3.5 h-3.5 shrink-0" />
            <span>{language === 'hi' ? '📦 डिलीवरी बॉय' : 'Delivery Jobs'}</span>
          </Link>

          {/* Retail & Store Sales Button */}
          <Link
            href="/jobs?category=retail-showroom"
            className="px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 border border-rose-200 bg-white text-rose-900 hover:bg-rose-600 hover:text-white hover:border-rose-600 shadow-2xs"
          >
            <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
            <span>{language === 'hi' ? '🛒 दुकान व सेल्स' : 'Retail Sales'}</span>
          </Link>

          {/* Sarkari Naukri (Secondary Button) */}
          <Link
            href="/jobs?sector=government"
            className="px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 border border-slate-300 bg-white text-slate-800 hover:bg-slate-800 hover:text-white hover:border-slate-800 shadow-2xs"
          >
            <Landmark className="w-3.5 h-3.5 shrink-0 text-slate-600" />
            <span>{language === 'hi' ? '🏛️ सरकारी भर्ती' : 'Sarkari Jobs'}</span>
          </Link>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div id="mobile-nav" className="lg:hidden border-t border-slate-200 bg-white p-4 space-y-4 shadow-xl">
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/resume-builder"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl text-xs font-bold text-center border border-orange-300 bg-orange-50 text-orange-900 flex items-center justify-center space-x-1"
            >
              <span>📄 बायोडाटा बनाएं</span>
            </Link>
            <Link
              href="/employer/post-job"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl text-xs font-bold text-center bg-orange-500 text-white flex items-center justify-center space-x-1"
            >
              <span>✨ जॉब पोस्ट करें</span>
            </Link>
          </div>

          <p className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
            {language === 'hi' ? 'नौकरी श्रेणियां (Categories)' : 'Job Categories'}
          </p>

          <nav className="grid grid-cols-2 gap-2">
            <Link
              href="/jobs?sector=private"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl text-xs font-bold text-center border border-blue-200 bg-blue-50 text-blue-800"
            >
              🏢 प्राइवेट नौकरियां
            </Link>
            <Link
              href="/jobs?category=call-center-bpo"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl text-xs font-bold text-center border border-purple-200 bg-purple-50 text-purple-800"
            >
              🎧 कॉल सेंटर
            </Link>
            <Link
              href="/jobs?category=hotel-hospitality"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl text-xs font-bold text-center border border-amber-200 bg-amber-50 text-amber-900"
            >
              🏨 होटल व रेस्टोरेंट
            </Link>
            <Link
              href="/jobs?is_fresher=true"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl text-xs font-bold text-center border border-emerald-200 bg-emerald-50 text-emerald-800"
            >
              🎓 8वीं से 12वीं पास
            </Link>
            <Link
              href="/jobs?work_mode=remote"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl text-xs font-bold text-center border border-indigo-200 bg-indigo-50 text-indigo-800"
            >
              💻 घर बैठे काम (WFH)
            </Link>
            <Link
              href="/jobs?category=delivery-logistics"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl text-xs font-bold text-center border border-cyan-200 bg-cyan-50 text-cyan-800"
            >
              📦 डिलीवरी बॉय
            </Link>
            <Link
              href="/jobs?category=retail-showroom"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl text-xs font-bold text-center border border-rose-200 bg-rose-50 text-rose-800"
            >
              🛒 दुकान व सेल्स
            </Link>
            <Link
              href="/jobs?sector=government"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl text-xs font-bold text-center border border-slate-200 bg-slate-100 text-slate-800"
            >
              🏛️ सरकारी भर्ती
            </Link>
          </nav>

          <div className="pt-3 border-t border-slate-200 flex flex-col space-y-2">
            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full py-2.5 text-center text-xs font-bold text-red-600 bg-red-50 rounded-xl"
              >
                {t('nav_logout')}
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center text-xs font-bold text-slate-700 border border-slate-300 rounded-xl"
                >
                  {t('nav_login')}
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center text-xs font-bold text-white bg-blue-600 rounded-xl"
                >
                  {t('nav_register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
