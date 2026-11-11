'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import QuickBiodataModal from '@/components/QuickBiodataModal';
import { useLanguage } from '@/context/LanguageContext';
import { 
  FileText, 
  Sparkles, 
  Printer, 
  Download, 
  CheckCircle2, 
  UserCheck, 
  Award, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function ResumeBuilderPage() {
  const { language } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-xs px-3.5 py-1 rounded-full text-xs font-bold">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>100% Free & No Sign-up Required</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            {language === 'hi' 
              ? 'फ्री बायोडाटा व रिज्यूमे मेकर (1-मिनट में तैयार)'
              : 'Free 1-Minute Bio-Data & Resume Builder'}
          </h1>

          <p className="text-sm sm:text-base text-orange-100 max-w-2xl mx-auto leading-relaxed">
            {language === 'hi'
              ? '8वीं, 10वीं, 12वीं पास और फ्रेशर्स के लिए सबसे आसान और आधुनिक बायोडाटा फॉर्मेट। कॉल सेंटर, दुकान, होटल, डिलीवरी या किसी भी नौकरी के लिए तुरंत PDF डाउनलोड करें।'
              : 'The simplest Indian bio-data format for 8th, 10th, 12th pass and fresher candidates. Download standard PDF or print instantly for all interviews.'}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setModalOpen(true)}
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-black px-8 py-3.5 rounded-2xl text-sm shadow-xl transition flex items-center justify-center space-x-2 border border-slate-700"
            >
              <span>{language === 'hi' ? '✨ अपना बायोडाटा अभी बनाएं' : '✨ Build My Biodata Now'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-5xl mx-auto px-4 py-12 w-full space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              {language === 'hi' ? 'सरल व हिंदी/इंग्लिश दोनों में' : 'Bilingual & Simple'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'hi'
                ? 'कोई कठिन टेक्निकल शब्द नहीं। नाम, पिता का नाम, पता, 8वीं/10वीं/12वीं की डिटेल और फोन नंबर भरें।'
                : 'No complex terms. Easily fill name, father name, basic schooling, and skills.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Printer className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              {language === 'hi' ? 'A4 साइज प्रिंटेबल PDF' : 'Standard A4 Print & PDF'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'hi'
                ? 'एक क्लिक में अपने मोबाइल या कंप्यूटर पर PDF सेव करें या नजदीकी साइबर कैफे से प्रिंट कराएं।'
                : 'Instantly save high-quality clean PDF or print for offline recruitment drives.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              {language === 'hi' ? 'सीधा नौकरी आवेदन' : 'Instant Direct Apply'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'hi'
                ? 'Naukarix पर किसी भी नौकरी में बिना किसी पूर्व फाइल के सीधे इस बायोडाटा से अप्लाई कर सकते हैं।'
                : 'Use your generated biodata to apply across all private job listings on Naukarix.'}
            </p>
          </div>
        </div>

        {/* Step-by-step info banner */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-8 border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
              {language === 'hi' ? 'कैंडिडेट सहायता' : 'Candidate Support'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black">
              {language === 'hi' ? 'रिज्यूमे न होने के कारण नौकरी छूटने नहीं देंगे!' : 'Never miss an opportunity due to lack of a resume!'}
            </h2>
            <p className="text-xs text-slate-300 max-w-xl">
              {language === 'hi'
                ? 'हजारों नियोक्ता 8वीं, 10वीं और 12वीं पास उम्मीदवारों को तुरंत इंटरव्यू के लिए बुलाते हैं। अभी अपना बायोडाटा तैयार करें।'
                : 'Thousands of verified local businesses in Lucknow, Delhi NCR, Jaipur, and Patna are hiring now.'}
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="shrink-0 bg-orange-600 hover:bg-orange-700 text-white font-black px-7 py-3 rounded-xl text-xs shadow-lg transition"
          >
            {language === 'hi' ? 'बायोडाटा बनाएं (शुरू करें)' : 'Start Biodata Maker'}
          </button>
        </div>
      </div>

      <Footer />

      {/* Modal */}
      {modalOpen && (
        <QuickBiodataModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
