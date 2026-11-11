'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import JobCard from '@/components/JobCard';
import ApplyModal from '@/components/ApplyModal';
import JobAlertModal from '@/components/JobAlertModal';
import { JobListing, Category, StateItem, api } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Search, 
  MapPin, 
  Filter, 
  RotateCcw, 
  Briefcase, 
  Landmark, 
  Building2, 
  Laptop, 
  GraduationCap, 
  SlidersHorizontal,
  X,
  ChevronDown
} from 'lucide-react';

function JobsContent() {
  const { language, t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Filters State
  const [q, setQ] = useState(searchParams.get('q') || '');
  const [sector, setSector] = useState(searchParams.get('sector') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [state, setState] = useState(searchParams.get('state') || '');
  const [workMode, setWorkMode] = useState(searchParams.get('work_mode') || '');
  const [isFresher, setIsFresher] = useState(searchParams.get('is_fresher') === 'true');
  const [minSalary, setMinSalary] = useState(searchParams.get('min_salary') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'latest');

  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [states, setStates] = useState<StateItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Apply Modal
  const [selectedJobForApply, setSelectedJobForApply] = useState<JobListing | null>(null);
  const [alertModalOpen, setAlertModalOpen] = useState(false);

  // Sync state if URL changes
  useEffect(() => {
    setQ(searchParams.get('q') || '');
    setSector(searchParams.get('sector') || '');
    setCategory(searchParams.get('category') || '');
    setState(searchParams.get('state') || '');
    setWorkMode(searchParams.get('work_mode') || '');
    setIsFresher(searchParams.get('is_fresher') === 'true');
    setMinSalary(searchParams.get('min_salary') || '');
    setSortBy(searchParams.get('sort') || 'latest');
  }, [searchParams]);

  // Fetch jobs
  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true);
        const params: Record<string, any> = {};
        if (q) params.q = q;
        if (sector) params.sector = sector;
        if (category) params.category = category;
        if (state) params.state = state;
        if (workMode) params.work_mode = workMode;
        if (isFresher) params.is_fresher = true;
        if (minSalary) params.min_salary = minSalary;
        if (sortBy) params.sort = sortBy;

        const [jobsRes, catsRes, statesRes] = await Promise.all([
          api.getJobs(params),
          categories.length === 0 ? api.getCategories() : Promise.resolve({ data: categories }),
          states.length === 0 ? api.getStates() : Promise.resolve({ data: states }),
        ]);

        setJobs(jobsRes.data);
        setTotalCount(jobsRes.meta?.total || jobsRes.data.length);
        if (categories.length === 0) setCategories(catsRes.data);
        if (states.length === 0) setStates(statesRes.data);
      } catch (err) {
        console.error('Failed to load jobs', err);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, [q, sector, category, state, workMode, isFresher, minSalary, sortBy]);

  const updateFilters = (newFilters: Record<string, any>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val === undefined || val === null || val === '' || val === false) {
        params.delete(key);
      } else {
        params.set(key, String(val));
      }
    });
    router.push(`/jobs?${params.toString()}`);
  };

  const resetFilters = () => {
    setQ('');
    setSector('');
    setCategory('');
    setState('');
    setWorkMode('');
    setIsFresher(false);
    setMinSalary('');
    setSortBy('latest');
    router.push('/jobs');
  };

  const FilterPanel = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-1.5">
          <SlidersHorizontal className="w-4 h-4 text-blue-600" />
          <span>{t('filters_title')}</span>
        </h3>
        <button
          onClick={resetFilters}
          className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-1"
        >
          <RotateCcw className="w-3 h-3" />
          <span>{t('clear_filters')}</span>
        </button>
      </div>

      {/* Sector */}
      <div>
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          {t('filter_sector')}
        </label>
        <div className="space-y-1.5">
          {[
            { id: '', label: t('filter_sector_all') },
            { id: 'government', label: t('filter_sector_govt'), icon: Landmark, color: 'text-emerald-700' },
            { id: 'private', label: t('filter_sector_pvt'), icon: Building2, color: 'text-blue-700' },
          ].map((sec) => (
            <label
              key={sec.id}
              className={`flex items-center space-x-2 text-xs p-2 rounded-xl cursor-pointer transition ${
                sector === sec.id ? 'bg-blue-50 font-bold text-blue-800' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="sector"
                checked={sector === sec.id}
                onChange={() => updateFilters({ sector: sec.id })}
                className="text-blue-600 focus:ring-blue-500 rounded"
              />
              <span>{sec.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Work Mode */}
      <div>
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          {t('filter_workmode')}
        </label>
        <div className="space-y-1.5">
          {[
            { id: '', label: t('filter_workmode_all') },
            { id: 'remote', label: t('filter_workmode_wfh') },
            { id: 'on-site', label: t('filter_workmode_onsite') },
            { id: 'hybrid', label: t('filter_workmode_hybrid') },
          ].map((wm) => (
            <label
              key={wm.id}
              className={`flex items-center space-x-2 text-xs p-2 rounded-xl cursor-pointer transition ${
                workMode === wm.id ? 'bg-indigo-50 font-bold text-indigo-800' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="work_mode"
                checked={workMode === wm.id}
                onChange={() => updateFilters({ work_mode: wm.id })}
                className="text-indigo-600 focus:ring-indigo-500"
              />
              <span>{wm.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Freshers Checkbox */}
      <div className="pt-2">
        <label className="flex items-center space-x-2 text-xs p-2.5 rounded-xl border border-amber-200 bg-amber-50/60 text-amber-900 font-semibold cursor-pointer">
          <input
            type="checkbox"
            checked={isFresher}
            onChange={(e) => updateFilters({ is_fresher: e.target.checked })}
            className="rounded text-amber-600 focus:ring-amber-500"
          />
          <span>{t('filter_fresher_only')}</span>
        </label>
      </div>

      {/* State Selection */}
      <div>
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          {t('filter_state')}
        </label>
        <select
          value={state}
          onChange={(e) => updateFilters({ state: e.target.value })}
          className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
        >
          <option value="">{language === 'hi' ? 'सभी राज्य (All India)' : 'All States (Pan India)'}</option>
          {states.map((st) => (
            <option key={st.id} value={st.slug}>
              {language === 'hi' ? st.name_hi : st.name_en}
            </option>
          ))}
        </select>
      </div>

      {/* Category Selection */}
      <div>
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          {t('filter_category')}
        </label>
        <select
          value={category}
          onChange={(e) => updateFilters({ category: e.target.value })}
          className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
        >
          <option value="">{language === 'hi' ? 'सभी श्रेणियां' : 'All Categories'}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {language === 'hi' ? c.name_hi : c.name_en} ({c.job_count})
            </option>
          ))}
        </select>
      </div>

      {/* Minimum Salary */}
      <div>
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          {t('filter_min_salary')}
        </label>
        <select
          value={minSalary}
          onChange={(e) => updateFilters({ min_salary: e.target.value })}
          className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
        >
          <option value="">Any Salary</option>
          <option value="300000">₹3 Lakhs+ / PA</option>
          <option value="600000">₹6 Lakhs+ / PA</option>
          <option value="1000000">₹10 Lakhs+ / PA</option>
          <option value="1500000">₹15 Lakhs+ / PA</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar onOpenAlertModal={() => setAlertModalOpen(true)} />

      {/* Top Search bar banner */}
      <div className="bg-slate-900 text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-black mb-4">
            {language === 'hi' ? 'भारत भर में नौकरियां खोजें' : 'Browse All Jobs Across India'}
          </h1>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateFilters({ q });
            }}
            className="flex flex-col sm:flex-row gap-2 max-w-3xl"
          >
            <div className="flex-1 flex items-center bg-white rounded-xl px-3 py-2 text-slate-900 border border-slate-300">
              <Search className="w-5 h-5 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t('search_keyword_placeholder')}
                className="w-full text-sm outline-hidden"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition"
            >
              {t('search_btn')}
            </button>
          </form>
        </div>
      </div>

      {/* Main Content with Sidebar Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Results Bar */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200">
          <div>
            <p className="text-sm text-slate-600">
              Showing <b className="text-slate-900">{totalCount}</b> {language === 'hi' ? 'रिक्तियां उपलब्ध' : 'vacancies available'}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Mobile Filter Trigger */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center space-x-1.5 bg-white border border-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 shadow-xs"
            >
              <Filter className="w-3.5 h-3.5 text-blue-600" />
              <span>{t('filters_title')}</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-500 hidden sm:inline">{t('filter_sort')}:</span>
              <select
                value={sortBy}
                onChange={(e) => updateFilters({ sort: e.target.value })}
                className="bg-white border border-slate-300 text-slate-800 text-xs rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-hidden font-medium"
              >
                <option value="latest">{t('sort_latest')}</option>
                <option value="salary_high">{t('sort_salary')}</option>
                <option value="views">{t('sort_views')}</option>
                <option value="deadline">{t('sort_deadline')}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-6">
          {/* Desktop Left Sidebar Filters */}
          <aside className="hidden lg:block lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs h-fit sticky top-24">
            <FilterPanel />
          </aside>

          {/* Job Listings Column */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="h-60 rounded-2xl bg-slate-200/70 animate-pulse" />
                ))}
              </div>
            ) : jobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onApplyClick={(j) => setSelectedJobForApply(j)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-800">
                  {language === 'hi' ? 'कोई भर्ती नहीं मिली' : 'No jobs found matching criteria'}
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  {language === 'hi'
                    ? 'कृपया अपने फिल्टर को रीसेट करें या कोई भिन्न कीवर्ड अथवा राज्य चुनें।'
                    : 'Try relaxing your filter options or searching for a broader skill.'}
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 bg-blue-600 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs"
                >
                  {t('clear_filters')}
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-xs h-full p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
              <h3 className="font-bold text-slate-900">{t('filters_title')}</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <FilterPanel />
            <div className="mt-8 pt-4 border-t border-slate-200">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl text-xs"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <ApplyModal
        job={selectedJobForApply}
        isOpen={!!selectedJobForApply}
        onClose={() => setSelectedJobForApply(null)}
      />

      <JobAlertModal
        isOpen={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
      />
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading Naukarix Jobs...</div>}>
      <JobsContent />
    </Suspense>
  );
}
