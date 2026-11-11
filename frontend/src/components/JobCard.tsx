'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { JobListing, api } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { 
  Building2, 
  MapPin, 
  IndianRupee, 
  Clock, 
  Bookmark, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink, 
  PhoneCall,
  GraduationCap,
  MessageCircle,
  Zap,
  Gift
} from 'lucide-react';

interface JobCardProps {
  job: JobListing;
  onApplyClick?: (job: JobListing) => void;
  isSavedInitial?: boolean;
}

export default function JobCard({ job, onApplyClick, isSavedInitial = false }: JobCardProps) {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(isSavedInitial);
  const [saving, setSaving] = useState(false);

  const formatSalary = (min?: number, max?: number, type = 'per_month') => {
    if (!job.is_salary_disclosed || (!min && !max)) {
      return language === 'hi' ? 'वेतन नियमानुसार' : 'Salary Undisclosed';
    }

    if (type === 'per_month') {
      const minText = min ? `₹${min.toLocaleString('en-IN')}` : '';
      const maxText = max ? ` - ₹${max.toLocaleString('en-IN')}` : '';
      return `${minText}${maxText} ${language === 'hi' ? '/ महीना' : '/ month'}`;
    }

    if (min && max) {
      if (max >= 100000) {
        return `₹${(min / 100000).toFixed(1)} - ₹${(max / 100000).toFixed(1)} LPA`;
      }
      return `₹${min.toLocaleString('en-IN')} - ₹${max.toLocaleString('en-IN')}`;
    }
    return `₹${(min || max || 0).toLocaleString('en-IN')}`;
  };

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      window.location.href = '/auth/login';
      return;
    }
    try {
      setSaving(true);
      const res = await api.toggleSaveJob(job.id);
      setIsSaved(res.is_saved);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const isGovt = job.sector === 'government';
  const displayTitle = language === 'hi' && job.title_hi ? job.title_hi : job.title;

  // Qualification label
  const getQualificationBadge = () => {
    if (job.qualification_level === '8th_pass') {
      return <span className="bg-emerald-100 text-emerald-800 text-[11px] font-black px-2.5 py-0.5 rounded-md border border-emerald-300">🎓 8वीं पास भर्ती</span>;
    }
    if (job.qualification_level === '10th_pass') {
      return <span className="bg-blue-100 text-blue-800 text-[11px] font-black px-2.5 py-0.5 rounded-md border border-blue-300">🎓 10वीं पास</span>;
    }
    if (job.qualification_level === '12th_pass') {
      return <span className="bg-purple-100 text-purple-800 text-[11px] font-black px-2.5 py-0.5 rounded-md border border-purple-300">🎓 12वीं पास</span>;
    }
    return <span className="bg-slate-100 text-slate-800 text-[11px] font-bold px-2 py-0.5 rounded-md">🎓 स्नातक / Any</span>;
  };

  const getWhatsAppLink = () => {
    const phone = job.whatsapp_number || job.contact_phone?.replace(/[^0-9]/g, '');
    const cleanPhone = phone?.startsWith('91') ? phone : `91${phone}`;
    const text = encodeURIComponent(
      `नमस्ते, मुझे Naukarix पोर्टल पर आपकी नौकरी "${job.title}" (${job.company_name}) की जानकारी मिली है। मैं इस पद के लिए आवेदन करना चाहता/चाहती हूं।`
    );
    return `https://wa.me/${cleanPhone}?text=${text}`;
  };

  return (
    <div className={`relative bg-white rounded-2xl border transition-all duration-200 hover:shadow-lg flex flex-col justify-between p-5 ${
      job.is_featured 
        ? 'border-orange-300 bg-gradient-to-b from-orange-50/20 to-white shadow-xs' 
        : 'border-slate-200 hover:border-blue-400'
    }`}>
      {/* Top Badges Bar */}
      <div>
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          {getQualificationBadge()}

          {job.work_mode === 'remote' && (
            <span className="inline-flex items-center text-[10px] font-black px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 border border-indigo-200">
              💻 {language === 'hi' ? 'घर बैठे काम (WFH)' : 'Work From Home'}
            </span>
          )}

          {job.is_urgent && (
            <span className="inline-flex items-center text-[10px] font-black px-2 py-0.5 rounded-md bg-red-100 text-red-700 animate-pulse border border-red-200">
              🔥 {language === 'hi' ? 'तत्काल जॉइनिंग' : 'Immediate Joining'}
            </span>
          )}

          {job.shift_timing && (
            <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
              <Clock className="w-3 h-3 mr-1 text-slate-500" />
              {job.shift_timing}
            </span>
          )}
        </div>

        {/* Header & Logo */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start space-x-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
              {job.company_logo ? (
                <img
                  src={job.company_logo}
                  alt={job.company_name}
                  width={48}
                  height={48}
                  decoding="async"
                  loading="lazy"
                  className="w-full h-full object-cover aspect-square"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <Building2 className="w-6 h-6 text-slate-400" />
              )}
            </div>

            <div>
              <Link
                href={`/jobs/${job.slug}`}
                className="text-base font-extrabold text-slate-900 hover:text-blue-600 line-clamp-2 transition leading-snug"
              >
                {displayTitle}
              </Link>
              <div className="flex items-center space-x-1.5 mt-1 text-xs text-slate-600 font-semibold">
                <span className="truncate max-w-[180px]">{job.company_name}</span>
                {job.is_verified && (
                  <span title="Verified Recruiter">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 inline-block" />
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleToggleSave}
            disabled={saving}
            className={`p-2 rounded-xl border transition ${
              isSaved 
                ? 'bg-amber-50 border-amber-300 text-amber-600' 
                : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
            title={isSaved ? 'Saved to bookmarks' : 'Save this job'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500' : ''}`} />
          </button>
        </div>

        {/* Salary Highlight Box */}
        <div className="mt-4 bg-emerald-50/70 border border-emerald-200 p-3 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-800 block">
              {language === 'hi' ? 'मासिक वेतन (Monthly In-hand)' : 'Monthly Salary'}
            </span>
            <span className="text-base sm:text-lg font-black text-emerald-800">
              {formatSalary(job.min_salary, job.max_salary, job.salary_type)}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">
              {language === 'hi' ? 'स्थान' : 'City / Location'}
            </span>
            <span className="text-xs font-bold text-slate-800 flex items-center justify-end">
              <MapPin className="w-3.5 h-3.5 text-red-500 mr-0.5 shrink-0" />
              <span className="truncate max-w-[120px]">{job.city || job.location_display}</span>
            </span>
          </div>
        </div>

        {/* Perks / Benefits if available */}
        {job.benefits_included && (
          <div className="mt-2.5 flex items-center text-xs text-amber-900 bg-amber-50/80 p-2 rounded-lg border border-amber-200">
            <Gift className="w-3.5 h-3.5 text-amber-600 mr-1.5 shrink-0" />
            <span className="truncate font-medium">{job.benefits_included}</span>
          </div>
        )}

        {/* Requirements / Description Snippet */}
        <p className="mt-3 text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {language === 'hi' && job.description_hi ? job.description_hi : job.description}
        </p>
      </div>

      {/* Card Action Buttons (Direct Apply & View Details) */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        {/* Direct Apply Button */}
        {isGovt && job.official_apply_url ? (
          <a
            href={job.official_apply_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-sm transition"
          >
            <span>{t('official_apply')}</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1" />
          </a>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onApplyClick) {
                onApplyClick(job);
              } else {
                window.location.href = `/jobs/${job.slug}#apply`;
              }
            }}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-2.5 px-3.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-blue-500/20 transition transform active:scale-95"
          >
            <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300 shrink-0" />
            <span>{language === 'hi' ? 'सीधे आवेदन करें (Apply Now)' : 'Apply Now'}</span>
          </button>
        )}

        {/* View Details Button */}
        <Link
          href={`/jobs/${job.slug}`}
          className="px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition text-center shadow-2xs"
        >
          {t('view_details')}
        </Link>

        {/* Optional quick WhatsApp inquiry icon */}
        {(job.whatsapp_number || job.contact_phone) && !isGovt && (
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            title="WhatsApp पर सवाल पूछें"
            className="p-2.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition flex items-center justify-center"
          >
            <MessageCircle className="w-4 h-4 fill-emerald-600 text-emerald-600" />
          </a>
        )}
      </div>
    </div>
  );
}
