'use client';

import React, { useState } from 'react';
import { JobListing, api } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { 
  X, 
  UploadCloud, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  Loader2,
  ExternalLink 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import QuickBiodataModal from './QuickBiodataModal';

interface ApplyModalProps {
  job: JobListing | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ApplyModal({ job, isOpen, onClose, onSuccess }: ApplyModalProps) {
  const { language, t } = useLanguage();
  const { user } = useAuth();

  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [currentCity, setCurrentCity] = useState(user?.current_city || '');
  const [totalExperience, setTotalExperience] = useState(String(user?.experience_years ?? 0));
  const [currentCtc, setCurrentCtc] = useState('');
  const [expectedCtc, setExpectedCtc] = useState('');
  const [noticePeriod, setNoticePeriod] = useState('Immediate / 15 Days');
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBiodataModal, setShowBiodataModal] = useState(false);

  // Modern Accessibility: Listen for Escape key to close modal
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !job) return null;

  // If govt job with official link, redirect
  if (job.sector === 'government' && job.official_apply_url) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center border border-slate-200 shadow-2xl">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <ExternalLink className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            {language === 'hi' ? 'आधिकारिक सरकारी पोर्टल' : 'Official Government Recruitment Portal'}
          </h3>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            {language === 'hi'
              ? `इस भर्ती (${job.title}) के लिए आवेदन सीधे ${job.company_name} के अधिकृत पोर्टल पर किया जाता है।`
              : `Applications for ${job.title} are processed directly on the official ${job.company_name} portal.`}
          </p>
          <div className="flex flex-col space-y-2">
            <a
              href={job.official_apply_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition flex items-center justify-center space-x-2 shadow-md"
            >
              <span>{language === 'hi' ? 'आधिकारिक पोर्टल पर जाएं' : 'Proceed to Official Portal'}</span>
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
            {job.official_notification_url && (
              <a
                href={job.official_notification_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full border border-slate-300 text-slate-700 font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition text-sm"
              >
                {t('download_notification')}
              </a>
            )}
            <button
              onClick={onClose}
              className="text-xs text-slate-500 hover:text-slate-700 py-1"
            >
              {language === 'hi' ? 'बंद करें' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('full_name', fullName);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('current_city', currentCity);
      formData.append('total_experience', totalExperience);
      formData.append('current_ctc', currentCtc);
      formData.append('expected_ctc', expectedCtc);
      formData.append('notice_period', noticePeriod);
      formData.append('cover_letter', coverLetter);

      if (resumeFile) {
        formData.append('resume_file', resumeFile);
      } else if (user?.resume_path) {
        formData.append('resume_url', user.resume_path);
      }

      await api.applyJob(job.id, formData);

      setSuccess(true);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // confetti fallback
      }

      if (onSuccess) onSuccess();
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2500);
    } catch (err: any) {
      setError(err.message || 'Failed to submit application. Please verify the fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="apply-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto overscroll-contain"
    >
      <div className="relative bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl my-8">
        <button
          onClick={onClose}
          aria-label={language === 'hi' ? 'आवेदन फॉर्म बंद करें (Close)' : 'Close application form'}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 id="apply-modal-title" className="text-2xl font-bold text-slate-900">
              {language === 'hi' ? 'आवेदन सफलतापूर्वक जमा हुआ!' : 'Application Submitted!'}
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              {language === 'hi'
                ? `आपकी अर्जी ${job.company_name} की हायरिंग टीम को भेज दी गई है। स्थिति आपके कैंडिडेट डैशबोर्ड में दिखाई देगी।`
                : `Your application has been received by ${job.company_name}. You can track status in your Candidate Dashboard.`}
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-xs uppercase font-bold tracking-wider text-blue-600">
                {language === 'hi' ? 'त्वरित आवेदन' : 'Direct Job Application'}
              </span>
              <h2 id="apply-modal-title" className="text-xl font-bold text-slate-900 mt-1 line-clamp-1">{job.title}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{job.company_name} • {job.location_display}</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {language === 'hi' ? 'पूरा नाम' : 'Full Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Rahul Sharma"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {language === 'hi' ? 'ईमेल पता' : 'Email Address'} *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rahul@example.com"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {language === 'hi' ? 'मोबाइल नंबर (WhatsApp)' : 'Phone Number'} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {language === 'hi' ? 'वर्तमान शहर' : 'Current City'}
                  </label>
                  <input
                    type="text"
                    value={currentCity}
                    onChange={(e) => setCurrentCity(e.target.value)}
                    placeholder="Lucknow / Delhi"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {language === 'hi' ? 'कुल अनुभव (वर्ष)' : 'Total Exp (Yrs)'}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={totalExperience}
                    onChange={(e) => setTotalExperience(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {language === 'hi' ? 'वर्तमान पैकेज' : 'Current CTC'}
                  </label>
                  <input
                    type="text"
                    value={currentCtc}
                    onChange={(e) => setCurrentCtc(e.target.value)}
                    placeholder="₹5.5 LPA / Fresher"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {language === 'hi' ? 'अपेक्षित पैकेज' : 'Expected CTC'}
                  </label>
                  <input
                    type="text"
                    value={expectedCtc}
                    onChange={(e) => setExpectedCtc(e.target.value)}
                    placeholder="₹9.0 LPA"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                  />
                </div>
              </div>

              {/* Resume Upload Box */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'hi' ? 'रिज्यूमे अपलोड करें (PDF/DOC)' : 'Upload Resume / CV (PDF/DOC)'}
                </label>
                <div className="border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-xl p-4 text-center bg-slate-50/50 transition relative">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center space-y-1">
                    <UploadCloud className="w-8 h-8 text-blue-500" />
                    {resumeFile ? (
                      <p className="text-xs font-bold text-emerald-600 flex items-center">
                        <FileText className="w-3.5 h-3.5 mr-1" />
                        {resumeFile.name} ({(resumeFile.size / 1024).toFixed(0)} KB)
                      </p>
                    ) : user?.resume_path ? (
                      <p className="text-xs text-slate-600">
                        {language === 'hi' ? 'प्रोफाइल रिज्यूमे जुड़ा हुआ है। बदलने के लिए क्लिक करें।' : 'Profile resume linked. Click to replace.'}
                      </p>
                    ) : (
                      <>
                        <p className="text-xs font-medium text-slate-700">
                          {language === 'hi' ? 'फाइल चुनें या यहां खींचें' : 'Click to browse or drag file here'}
                        </p>
                        <p className="text-[11px] text-slate-400">PDF, DOC, DOCX (Max 10MB)</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Resume Not Available / Instant Biodata Helper */}
                <div className="mt-2.5 p-3 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-base">📄</span>
                    <div>
                      <p className="text-xs font-bold text-orange-950">
                        {language === 'hi' ? 'रिज्यूमे नहीं है? (Resume Not Available)' : 'Don\'t have a Resume ready?'}
                      </p>
                      <p className="text-[11px] text-orange-800">
                        {language === 'hi' ? 'चिंता न करें! सिर्फ 1 मिनट में अपना बायोडाटा बनाएं और सीधा आवेदन करें।' : 'Fill basic details to generate biodata and apply directly.'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowBiodataModal(true)}
                    className="shrink-0 bg-orange-600 hover:bg-orange-700 text-white font-black px-3.5 py-1.5 rounded-lg text-xs shadow-xs transition"
                  >
                    {language === 'hi' ? '✨ तुरंत बायोडाटा बनाएं' : '✨ Build Biodata'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'hi' ? 'संक्षिप्त परिचय / कवर लेटर (वैकल्पिक)' : 'Cover Letter / Brief Pitch (Optional)'}
                </label>
                <textarea
                  rows={2}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Share a short note about why you are a great fit for this role..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-md flex items-center justify-center space-x-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{language === 'hi' ? 'आवेदन सबमिट करें' : 'Submit Application Now'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Quick Biodata / Resume Builder Modal */}
      {showBiodataModal && (
        <QuickBiodataModal
          isOpen={showBiodataModal}
          onClose={() => setShowBiodataModal(false)}
          job={job}
          onApplicationSuccess={() => {
            setShowBiodataModal(false);
            setSuccess(true);
            if (onSuccess) onSuccess();
          }}
        />
      )}
    </div>
  );
}
