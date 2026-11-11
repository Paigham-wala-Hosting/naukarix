'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Category, StateItem, api } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { 
  Building2, 
  Landmark, 
  PlusCircle, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  ArrowLeft 
} from 'lucide-react';

export default function PostJobPage() {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [states, setStates] = useState<StateItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [titleHi, setTitleHi] = useState('');
  const [sector, setSector] = useState<'private' | 'government'>('private');
  const [jobType, setJobType] = useState('full-time');
  const [workMode, setWorkMode] = useState('on-site');
  const [isFresher, setIsFresher] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [stateId, setStateId] = useState('');
  const [city, setCity] = useState('');
  const [companyName, setCompanyName] = useState(user?.company_name || '');
  const [companyLogo, setCompanyLogo] = useState(user?.company_logo || '');
  const [companyWebsite, setCompanyWebsite] = useState(user?.company_website || '');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [salaryType, setSalaryType] = useState('per_annum');
  const [minExp, setMinExp] = useState('0');
  const [maxExp, setMaxExp] = useState('2');
  const [vacancies, setVacancies] = useState('1');
  const [deadline, setDeadline] = useState('');
  const [officialNotificationUrl, setOfficialNotificationUrl] = useState('');
  const [officialApplyUrl, setOfficialApplyUrl] = useState('');
  const [description, setDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  useEffect(() => {
    async function loadMeta() {
      try {
        const [catsRes, statesRes] = await Promise.all([
          api.getCategories(),
          api.getStates(),
        ]);
        setCategories(catsRes.data);
        setStates(statesRes.data);
        if (catsRes.data.length > 0) setCategoryId(String(catsRes.data[0].id));
        if (statesRes.data.length > 0) setStateId(String(statesRes.data[0].id));
      } catch (err) {
        console.error(err);
      }
    }
    loadMeta();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload: any = {
        title,
        title_hi: titleHi || null,
        sector,
        job_type: jobType,
        work_mode: workMode,
        is_fresher: isFresher,
        category_id: categoryId ? parseInt(categoryId) : null,
        state_id: stateId ? parseInt(stateId) : null,
        city: city || 'All India',
        company_name: companyName,
        company_logo: companyLogo || null,
        company_website: companyWebsite || null,
        min_salary: minSalary ? parseFloat(minSalary) : null,
        max_salary: maxSalary ? parseFloat(maxSalary) : null,
        salary_type: salaryType,
        min_experience: parseInt(minExp) || 0,
        max_experience: parseInt(maxExp) || 0,
        vacancies_count: parseInt(vacancies) || 1,
        application_deadline: deadline || null,
        official_notification_url: officialNotificationUrl || null,
        official_apply_url: officialApplyUrl || null,
        description,
        responsibilities: responsibilities || null,
        eligibility_criteria: eligibility || null,
        is_featured: isFeatured,
      };

      const res = await api.postJob(payload);
      router.push(`/jobs/${res.job.slug}`);
    } catch (err: any) {
      setError(err.message || 'Failed to post job. Please verify the fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-1.5 text-xs text-slate-500 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Cancel & Go Back</span>
          </button>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md">
          <div className="border-b border-slate-200 pb-5 mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Employer & Recruiter Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Publish a New Vacancy
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Your opening will be indexed instantly across India and sent to matching candidates via alerts.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title English & Hindi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Job Title (English) *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Next.js Developer / SSC CGL Officer"
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  पद का नाम (हिन्दी शीर्षक)
                </label>
                <input
                  type="text"
                  value={titleHi}
                  onChange={(e) => setTitleHi(e.target.value)}
                  placeholder="उदा. सीनियर डेवलपर भर्ती 2026"
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>
            </div>

            {/* Sector, Job Type, Work Mode */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Sector *</label>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value as any)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="private">Private / Corporate</option>
                  <option value="government">Government / Sarkari Exam</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Job Type *</label>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="full-time">Full-Time</option>
                  <option value="part-time">Part-Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Work Mode *</label>
                <select
                  value={workMode}
                  onChange={(e) => setWorkMode(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="on-site">On-Site Office</option>
                  <option value="remote">100% Work From Home (Remote)</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            {/* Category & State */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name_en} ({c.name_hi})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target State / Region *</label>
                <select
                  value={stateId}
                  onChange={(e) => setStateId(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-white"
                >
                  {states.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name_en} ({s.name_hi})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Company Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company / Authority Name *</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Infosys / UPPRPB"
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company Logo URL</label>
                <input
                  type="url"
                  value={companyLogo}
                  onChange={(e) => setCompanyLogo(e.target.value)}
                  placeholder="https://example.com/logo.png"
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City / District</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Noida / Lucknow / Bengaluru"
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 outline-hidden"
                />
              </div>
            </div>

            {/* Salary & Experience */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Min Salary (INR)</label>
                <input
                  type="number"
                  value={minSalary}
                  onChange={(e) => setMinSalary(e.target.value)}
                  placeholder="e.g. 600000"
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Max Salary (INR)</label>
                <input
                  type="number"
                  value={maxSalary}
                  onChange={(e) => setMaxSalary(e.target.value)}
                  placeholder="e.g. 1200000"
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Vacancies Count</label>
                <input
                  type="number"
                  value={vacancies}
                  onChange={(e) => setVacancies(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Last Date (Deadline)</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 outline-hidden"
                />
              </div>
            </div>

            {/* Fresher & Featured Checkboxes */}
            <div className="flex flex-wrap gap-6 pt-2">
              <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFresher}
                  onChange={(e) => setIsFresher(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span>🎓 Fresher Friendly (0-1 Year Experience)</span>
              </label>

              <label className="flex items-center space-x-2 text-xs font-bold text-orange-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 text-orange-600 rounded"
                />
                <span>⭐ Highlight as Featured Vacancy</span>
              </label>
            </div>

            {/* Govt specific URLs */}
            {sector === 'government' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200">
                <div>
                  <label className="block text-xs font-bold text-emerald-950 mb-1">
                    Official Notification PDF Link
                  </label>
                  <input
                    type="url"
                    value={officialNotificationUrl}
                    onChange={(e) => setOfficialNotificationUrl(e.target.value)}
                    placeholder="https://ssc.gov.in/notice.pdf"
                    className="w-full text-xs p-2.5 rounded-xl border border-emerald-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-emerald-950 mb-1">
                    Official Application Portal Link
                  </label>
                  <input
                    type="url"
                    value={officialApplyUrl}
                    onChange={(e) => setOfficialApplyUrl(e.target.value)}
                    placeholder="https://ssc.gov.in"
                    className="w-full text-xs p-2.5 rounded-xl border border-emerald-300 bg-white"
                  />
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Job Description & Role Overview *
              </label>
              <textarea
                rows={6}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detail the job specifications, tech stack, department profile, etc."
                className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl transition text-sm shadow-md flex items-center justify-center space-x-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Publish Vacancy on Naukarix</span>
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
