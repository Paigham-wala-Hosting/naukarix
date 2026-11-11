'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Home, Briefcase, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-6 my-12">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl max-w-lg w-full text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-orange-100 text-orange-600 font-black text-3xl">
            404
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-slate-900">
              पेज नहीं मिला (Page Not Found)
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              आप जिस लिंक या पेज को ढूंढ रहे हैं, वह या तो हटा दिया गया है या उसका पता बदल गया है।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <Link
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 transition shadow-md"
            >
              <Home className="w-4 h-4" />
              <span>होमपेज जाएं (Home)</span>
            </Link>

            <Link
              href="/jobs"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 transition shadow-md"
            >
              <Briefcase className="w-4 h-4" />
              <span>नौकरियां देखें (Jobs)</span>
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <Link
              href="/admin"
              className="text-xs text-slate-400 hover:text-slate-700 font-semibold"
            >
              Go to Admin Portal →
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
