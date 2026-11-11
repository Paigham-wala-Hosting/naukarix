'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ApplyModal from '@/components/ApplyModal';
import JobCard from '@/components/JobCard';
import { JobListing, api } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { 
  Building2, 
  MapPin, 
  IndianRupee, 
  Clock, 
  Calendar, 
  FileText, 
  ExternalLink, 
  Bookmark, 
  CheckCircle2, 
  ArrowLeft, 
  Share2, 
  AlertCircle,
  Briefcase,
  GraduationCap,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { language, t } = useLanguage();
  const { user } = useAuth();

  const [job, setJob] = useState<JobListing | null>(null);
  const [relatedJobs, setRelatedJobs] = useState<JobListing[]>([]);
  const [schemaJsonLd, setSchemaJsonLd] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadJob() {
      if (!slug) return;
      try {
        setLoading(true);
        const res = await api.getJobDetails(slug);
        setJob(res.job);
        setRelatedJobs(res.related || []);
        setSchemaJsonLd(res.schema_json_ld);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadJob();
  }, [slug]);

  const handleToggleSave = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    if (!job) return;
    try {
      const res = await api.toggleSaveJob(job.id);
      setIsSaved(res.is_saved);
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-semibold text-sm">Loading job vacancy details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-2xl border border-slate-200 text-center shadow-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-800">Job Not Found</h2>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            This vacancy may have expired or been filled.
          </p>
          <button
            onClick={() => router.push('/jobs')}
            className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs"
          >
            Browse Other Openings
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const isGovt = job.sector === 'government';
  const displayTitle = language === 'hi' && job.title_hi ? job.title_hi : job.title;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Google JobPosting JSON-LD Schema for 100% SEO Compliance */}
      {schemaJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
        />
      )}

      <Navbar />

      {/* Breadcrumb Header */}
      <div className="bg-slate-900 text-slate-400 py-4 px-4 sm:px-6 lg:px-8 border-b border-slate-800 text-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-1.5 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'hi' ? 'वापस जाएं' : 'Back to Jobs'}</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleShare}
              className="flex items-center space-x-1 hover:text-white transition bg-slate-800 px-3 py-1 rounded-lg text-xs"
            >
              <Share2 className="w-3.5 h-3.5 text-blue-400" />
              <span>{copied ? 'Link Copied!' : 'Share Vacancy'}</span>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Main Job Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {isGovt ? (
              <span className="inline-flex items-center text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                🏛️ {language === 'hi' ? 'सरकारी भर्ती' : 'Govt Exam / Sarkari'}
              </span>
            ) : (
              <span className="inline-flex items-center text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                🏢 {language === 'hi' ? 'प्राइवेट' : 'Corporate / Private'}
              </span>
            )}

            {job.work_mode === 'remote' && (
              <span className="inline-flex items-center text-xs font-bold px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                💻 {language === 'hi' ? 'वर्क फ्रॉम होम' : 'Work From Home (Remote)'}
              </span>
            )}

            {job.is_fresher && (
              <span className="inline-flex items-center text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                🎓 {language === 'hi' ? 'फ्रेशर पात्र' : 'Fresher Eligible'}
              </span>
            )}

            {job.is_featured && (
              <span className="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full bg-orange-100 text-orange-800">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-orange-600" />
                Featured
              </span>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                {job.company_logo ? (
                  <img src={job.company_logo} alt={job.company_name} className="w-full h-full object-cover" />
                ) : (
                  <Building2 className="w-8 h-8 text-slate-400" />
                )}
              </div>

              <div>
                <h1 className="text-xl sm:text-3xl font-black text-slate-900 leading-tight">
                  {displayTitle}
                </h1>
                <div className="flex flex-wrap items-center gap-y-1 gap-x-3 mt-2 text-xs sm:text-sm text-slate-600">
                  <span className="font-bold text-slate-900">{job.company_name}</span>
                  {job.is_verified && (
                    <span className="flex items-center text-blue-600 font-semibold text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      Verified
                    </span>
                  )}
                  <span>•</span>
                  <span className="flex items-center text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-red-500 mr-1" />
                    {job.location_display}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3 shrink-0">
              <button
                onClick={handleToggleSave}
                className={`p-3 rounded-xl border transition ${
                  isSaved ? 'bg-amber-50 border-amber-300 text-amber-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                title="Save Job"
              >
                <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-amber-500' : ''}`} />
              </button>

              {isGovt && job.official_apply_url ? (
                <a
                  href={job.official_apply_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-md transition flex items-center space-x-1.5"
                >
                  <span>{t('official_apply')}</span>
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              ) : (
                <button
                  onClick={() => setApplyModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-7 py-3 rounded-xl text-sm shadow-md transition transform active:scale-95"
                >
                  {t('apply_now')}
                </button>
              )}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100 text-slate-800">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Package / Salary</span>
              <span className="font-extrabold text-sm sm:text-base text-emerald-700 mt-0.5 block">
                {job.is_salary_disclosed && job.min_salary
                  ? `₹${(job.min_salary / 100000).toFixed(1)} - ₹${((job.max_salary || job.min_salary) / 100000).toFixed(1)} LPA`
                  : 'As per Govt / Industry Norms'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Experience Required</span>
              <span className="font-bold text-sm sm:text-base text-slate-900 mt-0.5 block">
                {job.is_fresher ? '0 Yrs (Fresher)' : `${job.min_experience} - ${job.max_experience} Years`}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Total Vacancies</span>
              <span className="font-bold text-sm sm:text-base text-slate-900 mt-0.5 block">
                {job.vacancies_count.toLocaleString('en-IN')} Posts
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Application Deadline</span>
              <span className="font-bold text-sm sm:text-base text-red-600 mt-0.5 block">
                {job.application_deadline ? new Date(job.application_deadline).toLocaleDateString() : 'Active Now'}
              </span>
            </div>
          </div>
        </div>

        {/* Content Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-100">
                {language === 'hi' ? 'विस्तृत विवरण' : 'Job Description & Role Summary'}
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {language === 'hi' && job.description_hi ? job.description_hi : job.description}
              </div>

              {job.responsibilities && (
                <div className="pt-4">
                  <h3 className="text-sm font-bold text-slate-900 mb-2">Key Responsibilities</h3>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {job.responsibilities}
                  </p>
                </div>
              )}

              {/* Govt Exam Specific Sections */}
              {isGovt && (
                <>
                  {job.eligibility_criteria && (
                    <div className="pt-4 border-t border-slate-100">
                      <h3 className="text-sm font-bold text-slate-900 mb-2">Eligibility & Age Limit</h3>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {job.eligibility_criteria}
                      </p>
                    </div>
                  )}

                  {job.application_fee_details && (
                    <div className="pt-4 border-t border-slate-100">
                      <h3 className="text-sm font-bold text-slate-900 mb-2">Application Fee</h3>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {job.application_fee_details}
                      </p>
                    </div>
                  )}

                  {job.selection_process && (
                    <div className="pt-4 border-t border-slate-100">
                      <h3 className="text-sm font-bold text-slate-900 mb-2">Selection Process</h3>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {job.selection_process}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Official Downloads / Govt Notice */}
            {isGovt && (
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-3xl p-6 sm:p-8">
                <div className="flex items-start space-x-3">
                  <ShieldCheck className="w-6 h-6 text-emerald-700 shrink-0 mt-1" />
                  <div>
                    <h3 className="text-base font-bold text-emerald-950">
                      {language === 'hi' ? 'आधिकारिक भर्ती सूचना एवं विज्ञप्ति' : 'Official Notification & Verification'}
                    </h3>
                    <p className="text-xs text-emerald-800 mt-1">
                      Always verify requirements with the official authority bulletin before making payments.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {job.official_notification_url && (
                        <a
                          href={job.official_notification_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white border border-emerald-300 text-emerald-800 font-bold px-4 py-2 rounded-xl text-xs hover:bg-emerald-100 transition flex items-center space-x-1.5"
                        >
                          <FileText className="w-4 h-4 text-emerald-600" />
                          <span>{t('download_notification')}</span>
                        </a>
                      )}
                      {job.official_apply_url && (
                        <a
                          href={job.official_apply_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs hover:bg-emerald-800 transition flex items-center space-x-1.5"
                        >
                          <span>{t('official_apply')}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: Company Info & Related Jobs */}
          <div className="space-y-6">
            {/* Quick Overview Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 text-xs">
              <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
                Overview Snapshot
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Job Type:</span>
                  <span className="font-semibold text-slate-800 capitalize">{job.job_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Work Mode:</span>
                  <span className="font-semibold text-slate-800 capitalize">{job.work_mode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Education:</span>
                  <span className="font-semibold text-slate-800 max-w-[150px] text-right truncate">
                    {job.education_required || 'Graduate'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">State / Region:</span>
                  <span className="font-semibold text-slate-800">
                    {job.state ? (language === 'hi' ? job.state.name_hi : job.state.name_en) : 'All India'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Category:</span>
                  <span className="font-semibold text-slate-800">
                    {job.category ? (language === 'hi' ? job.category.name_hi : job.category.name_en) : 'General'}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => isGovt && job.official_apply_url ? window.open(job.official_apply_url, '_blank') : setApplyModalOpen(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition text-xs shadow-md"
                >
                  {isGovt ? t('official_apply') : t('apply_now')}
                </button>
              </div>
            </div>

            {/* Related Jobs */}
            {relatedJobs.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 text-sm">Similar Openings</h3>
                <div className="space-y-3">
                  {relatedJobs.slice(0, 3).map((rj) => (
                    <JobCard key={rj.id} job={rj} onApplyClick={(j) => router.push(`/jobs/${j.slug}`)} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Apply Modal */}
      <ApplyModal
        job={job}
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
      />
    </div>
  );
}
