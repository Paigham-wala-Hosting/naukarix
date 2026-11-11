'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import JobCard from '@/components/JobCard';
import ApplyModal from '@/components/ApplyModal';
import JobAlertModal from '@/components/JobAlertModal';
import PaymentModal from '@/components/PaymentModal';
import { JobListing, Category, StateItem, PricingPlan, api } from '@/lib/api';
import { detectUserLocation, saveSelectedLocation, UserLocation } from '@/lib/geo';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Building2, 
  Headphones, 
  Hotel, 
  Utensils, 
  ShoppingBag, 
  Bike, 
  UserCheck, 
  GraduationCap, 
  Laptop, 
  Landmark, 
  PhoneCall, 
  MessageCircle, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  SlidersHorizontal,
  X,
  AlertTriangle
} from 'lucide-react';

export default function HomePage() {
  const { language, t } = useLanguage();
  const router = useRouter();

  // Location State
  const [userLoc, setUserLoc] = useState<UserLocation>({
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    isDetected: false,
  });
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [fallbackNotice, setFallbackNotice] = useState<string | null>(null);

  // Search & Filter State
  const [keyword, setKeyword] = useState('');
  const [activeTab, setActiveTab] = useState<'all_pvt' | 'call_center' | 'hotel' | '8th_pass' | '10th_pass' | '12th_pass' | 'wfh' | 'govt'>('all_pvt');

  // Data State
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [states, setStates] = useState<StateItem[]>([]);
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedJobForApply, setSelectedJobForApply] = useState<JobListing | null>(null);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [paymentPlan, setPaymentPlan] = useState<PricingPlan | null>(null);

  // Top Indian Cities for quick selection
  const popularCities = [
    { city: 'Lucknow', state: 'Uttar Pradesh' },
    { city: 'Delhi NCR', state: 'Delhi NCR' },
    { city: 'Noida', state: 'Uttar Pradesh' },
    { city: 'Patna', state: 'Bihar' },
    { city: 'Jaipur', state: 'Rajasthan' },
    { city: 'Kanpur', state: 'Uttar Pradesh' },
    { city: 'Varanasi', state: 'Uttar Pradesh' },
    { city: 'Mumbai', state: 'Maharashtra' },
    { city: 'Bengaluru', state: 'Karnataka' },
    { city: 'Bhopal', state: 'Madhya Pradesh' },
    { city: 'Indore', state: 'Madhya Pradesh' },
  ];

  // 1. Initial IP Location Detection
  useEffect(() => {
    async function initLocation() {
      try {
        const detected = await detectUserLocation();
        setUserLoc(detected);
        loadJobsForLocation(detected.city, detected.state);
      } catch (err) {
        loadJobsForLocation('Lucknow', 'Uttar Pradesh');
      }
    }
    initLocation();
  }, []);

  // 2. Load Jobs for City/State
  const loadJobsForLocation = async (targetCity: string, targetState: string) => {
    try {
      setLoading(true);
      setFallbackNotice(null);

      // Call API with city and state
      const [jobsRes, catsRes, statesRes, plansRes] = await Promise.all([
        api.getJobs({ city: targetCity, state: targetState, per_page: 15 }),
        api.getCategories(),
        api.getStates(),
        api.getPricingPlans(),
      ]);

      setJobs(jobsRes.data);
      setCategories(catsRes.data);
      setStates(statesRes.data);
      setPricingPlans(plansRes.data);

      // Check if backend fell back from city to state
      if (jobsRes.meta?.fallback_to_state) {
        setFallbackNotice(
          language === 'hi'
            ? `आपके शहर "${targetCity}" में अभी कोई नई रिक्ति नहीं मिलने पर आपके राज्य "${targetState}" की सभी नौकरियां दिखाई जा रही हैं।`
            : `No open vacancies found specifically in "${targetCity}". Showing available jobs across "${targetState}".`
        );
      } else if (jobsRes.data.length === 0) {
        // Fallback to all private jobs
        const allPvt = await api.getJobs({ sector: 'private', per_page: 15 });
        setJobs(allPvt.data);
        setFallbackNotice(
          language === 'hi'
            ? `आपके शहर में कोई रिक्ति न होने पर अन्य शहरों की लोकप्रिय नौकरियां दिखाई जा रही हैं।`
            : `Showing popular jobs across other cities.`
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCity = (city: string, state: string) => {
    setUserLoc({ city, state, isDetected: false });
    saveSelectedLocation(city, state);
    setIsCityModalOpen(false);
    loadJobsForLocation(city, state);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.append('q', keyword);
    if (userLoc.city) params.append('city', userLoc.city);
    params.append('sector', 'private');
    router.push(`/jobs?${params.toString()}`);
  };

  // Filter Jobs based on active tab
  const filteredJobs = jobs.filter((j) => {
    if (activeTab === 'call_center') return j.category?.slug === 'call-center-bpo';
    if (activeTab === 'hotel') return j.category?.slug === 'hotel-hospitality' || j.category?.slug === 'restaurant-food';
    if (activeTab === '8th_pass') return j.qualification_level === '8th_pass';
    if (activeTab === '10th_pass') return j.qualification_level === '10th_pass';
    if (activeTab === '12th_pass') return j.qualification_level === '12th_pass';
    if (activeTab === 'wfh') return j.work_mode === 'remote';
    if (activeTab === 'govt') return j.sector === 'government';
    return j.sector === 'private';
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar
        onOpenAlertModal={() => setAlertModalOpen(true)}
        userCity={userLoc.city}
        onCityClick={() => setIsCityModalOpen(true)}
      />

      {/* Hero Section - 100% PRIVATE JOB & LOCAL STAFFING ORIENTED */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* IP Detected City Badge */}
          <div className="inline-flex items-center space-x-2 bg-slate-800/90 border border-slate-700 rounded-full px-4 py-1.5 text-xs text-slate-200 mb-5 shadow-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>
              {language === 'hi' ? '📍 आपके शहर' : '📍 Jobs near'}{' '}
              <b className="text-amber-400 font-extrabold underline">{userLoc.city}</b>{' '}
              {language === 'hi' ? 'में लोकल स्टाफिंग भर्ती' : 'Staffing & Local Hiring'}
            </span>
            <button
              onClick={() => setIsCityModalOpen(true)}
              className="text-[11px] text-blue-300 hover:text-white underline font-semibold ml-1"
            >
              {language === 'hi' ? '[शहर बदलें]' : '[Change City]'}
            </button>
          </div>

          {/* Headline - Call Center, Hotel, Restaurant, Showroom, 8th-12th Pass */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-normal leading-[1.35] sm:leading-[1.4] mb-6 overflow-visible">
            {language === 'hi' ? (
              <>
                <span className="block pt-2 sm:pt-3 pb-1 mb-1 sm:mb-2 overflow-visible">
                  कॉल सेंटर, होटल, रेस्टोरेंट एवं दुकान में
                </span>
                <span className="block pt-2 sm:pt-3 pb-2 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-emerald-400 overflow-visible">
                  8वीं, 10वीं व 12वीं पास नौकरियां
                </span>
              </>
            ) : (
              <>
                <span className="block pt-2 sm:pt-3 pb-1 mb-1 sm:mb-2 overflow-visible">
                  Call Center, Hotel, Restaurant & Store Jobs
                </span>
                <span className="block pt-2 sm:pt-3 pb-2 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-emerald-400 overflow-visible">
                  Direct Hiring for 8th, 10th & 12th Pass
                </span>
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
            {language === 'hi'
              ? 'बिना किसी दलाल या फीस के सीधे कंपनी और स्टोर मालिक से बात करें। दैनिक व मासिक वेतन, रहने-खाने की सुविधा व तुरंत जॉइनिंग।'
              : 'Direct connection with local employers, showrooms, BPOs, and hotels. No consultancy charges, in-hand monthly salary, and immediate joining.'}
          </p>

          {/* Search Box */}
          <form
            onSubmit={handleSearch}
            className="bg-white p-2.5 sm:p-3 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 text-slate-900 max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3 items-center">
              {/* Keyword input */}
              <div className="sm:col-span-6 flex items-center px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 focus-within:border-blue-500 focus-within:bg-white transition">
                <Search className="w-5 h-5 text-slate-400 mr-2 shrink-0" aria-hidden="true" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  aria-label={language === 'hi' ? 'पद या कौशल खोजें' : 'Job role or keyword'}
                  placeholder={language === 'hi' ? 'पद खोजें (जैसे टेलीकॉलर, वेटर, हेल्पर, प्यून, कैशियर)...' : 'Role (e.g. Telecaller, Waiter, Sales Helper, Peon)...'}
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-hidden font-medium"
                />
              </div>

              {/* City selector display (Accessible semantic button) */}
              <button
                type="button"
                onClick={() => setIsCityModalOpen(true)}
                aria-haspopup="dialog"
                aria-label={language === 'hi' ? `शहर बदलें, वर्तमान शहर ${userLoc.city}` : `Change city, current city ${userLoc.city}`}
                className="sm:col-span-4 flex items-center px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition text-left cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                <MapPin className="w-5 h-5 text-red-500 mr-2 shrink-0" aria-hidden="true" />
                <div className="text-left overflow-hidden">
                  <span className="block text-[10px] text-slate-500 uppercase font-bold">Selected City</span>
                  <span className="block text-xs font-bold text-slate-800 truncate">
                    {userLoc.city}, {userLoc.state}
                  </span>
                </div>
              </button>

              {/* Search button */}
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 sm:py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center space-x-1 text-xs sm:text-sm"
                >
                  <Search className="w-4 h-4" />
                  <span>{language === 'hi' ? 'नौकरी खोजें' : 'Search Jobs'}</span>
                </button>
              </div>
            </div>
          </form>

          {/* Quick Categories Bar (Buttons style) */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold">{language === 'hi' ? 'लोकप्रिय काम:' : 'Trending:'}</span>
            {[
              { label: '🎧 टेलीकॉलर (Telecaller)', q: 'Telecaller' },
              { label: '🏨 होटल स्टाफ (Hotel)', q: 'Hotel' },
              { label: '🍽️ रेस्टोरेंट व वेटर (Waiter)', q: 'Restaurant' },
              { label: '🛍️ शोरूम सेल्समैन (Retail)', q: 'Sales' },
              { label: '🛵 डिलीवरी बॉय (Delivery)', q: 'Delivery' },
              { label: '💼 ऑफिस प्यून (Peon)', q: 'Peon' },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setKeyword(item.q);
                  router.push(`/jobs?q=${encodeURIComponent(item.q)}&city=${encodeURIComponent(userLoc.city)}`);
                }}
                className="bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white px-3 py-1 rounded-xl border border-slate-700 transition font-medium"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Location Notice Banner if fallback occurred */}
      {fallbackNotice && (
        <div className="bg-amber-50 border-b border-amber-200 py-3 px-4 text-xs font-semibold text-amber-900">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{fallbackNotice}</span>
            </div>
            <button
              onClick={() => setIsCityModalOpen(true)}
              className="text-xs font-bold text-amber-800 underline hover:text-amber-950 shrink-0 ml-3"
            >
              {language === 'hi' ? 'दूसरा शहर चुनें' : 'Choose Another City'}
            </button>
          </div>
        </div>
      )}

      {/* Target Focus Sectors (Call Center, Hotel, Restaurant, Retail, Delivery, Office Guard) */}
      <section className="bg-white border-b border-slate-200 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3 text-center sm:text-left">
            {language === 'hi' ? 'प्रमुख प्राइवेट रोजगार श्रेणियां' : 'Primary Private Staffing Sectors'}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              {
                icon: Headphones,
                name_hi: 'कॉल सेंटर व BPO',
                name_en: 'Call Center & BPO',
                slug: 'call-center-bpo',
                color: 'bg-purple-100 text-purple-700 border-purple-200',
              },
              {
                icon: Hotel,
                name_hi: 'होटल स्टाफ',
                name_en: 'Hotel Staff',
                slug: 'hotel-hospitality',
                color: 'bg-amber-100 text-amber-800 border-amber-200',
              },
              {
                icon: Utensils,
                name_hi: 'रेस्टोरेंट व कैफे',
                name_en: 'Restaurant & Cafe',
                slug: 'restaurant-food',
                color: 'bg-orange-100 text-orange-800 border-orange-200',
              },
              {
                icon: ShoppingBag,
                name_hi: 'दुकान व शोरूम',
                name_en: 'Retail & Showroom',
                slug: 'retail-showroom',
                color: 'bg-blue-100 text-blue-700 border-blue-200',
              },
              {
                icon: Bike,
                name_hi: 'डिलीवरी पार्टनर',
                name_en: 'Delivery Partner',
                slug: 'delivery-logistics',
                color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
              },
              {
                icon: UserCheck,
                name_hi: 'प्यून, गार्ड व ड्राइवर',
                name_en: 'Peon, Guard & Driver',
                slug: 'office-staff-guard',
                color: 'bg-slate-100 text-slate-800 border-slate-200',
              },
            ].map((sec) => (
              <button
                key={sec.slug}
                onClick={() => router.push(`/jobs?category=${sec.slug}&city=${encodeURIComponent(userLoc.city)}`)}
                className="bg-white hover:bg-slate-50 p-3 rounded-2xl border border-slate-200 hover:border-blue-400 transition shadow-2xs flex items-center space-x-2.5 text-left group"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${sec.color}`}>
                  <sec.icon className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 truncate transition">
                    {language === 'hi' ? sec.name_hi : sec.name_en}
                  </p>
                  <p className="text-[10px] text-slate-400">तुरंत आवेदन</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Job Feed */}
      <main id="main-content" tabIndex={-1} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full outline-hidden">
        {/* Section Heading & Filter Button Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-blue-100 text-blue-800 text-[10px] font-black uppercase px-2 py-0.5 rounded">
                LOCAL & PRIVATE JOBS
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                📍 {userLoc.city}, {userLoc.state}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 leading-snug">
              {language === 'hi' ? `${userLoc.city} व नजदीकी क्षेत्रों में नई नौकरियां` : `Latest Vacancies in & around ${userLoc.city}`}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'hi'
                ? '8वीं, 10वीं, 12वीं पास और ग्रेजुएट युवाओं के लिए सत्यापित प्राइवेट नौकरियां'
                : 'Verified openings for 8th, 10th, 12th pass & undergraduates'}
            </p>
          </div>

          {/* Filter Pills - ALL STYLED AS BUTTONS */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveTab('all_pvt')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-2xs border ${
                activeTab === 'all_pvt'
                  ? 'bg-blue-600 text-white border-blue-700'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              🏢 सभी प्राइवेट (All)
            </button>

            <button
              onClick={() => setActiveTab('8th_pass')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-2xs border ${
                activeTab === '8th_pass'
                  ? 'bg-emerald-600 text-white border-emerald-700'
                  : 'bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50'
              }`}
            >
              🎓 8वीं पास
            </button>

            <button
              onClick={() => setActiveTab('10th_pass')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-2xs border ${
                activeTab === '10th_pass'
                  ? 'bg-blue-600 text-white border-blue-700'
                  : 'bg-white text-blue-800 border-blue-200 hover:bg-blue-50'
              }`}
            >
              🎓 10वीं पास
            </button>

            <button
              onClick={() => setActiveTab('12th_pass')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-2xs border ${
                activeTab === '12th_pass'
                  ? 'bg-purple-600 text-white border-purple-700'
                  : 'bg-white text-purple-800 border-purple-200 hover:bg-purple-50'
              }`}
            >
              🎓 12वीं पास
            </button>

            <button
              onClick={() => setActiveTab('call_center')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-2xs border ${
                activeTab === 'call_center'
                  ? 'bg-indigo-600 text-white border-indigo-700'
                  : 'bg-white text-indigo-800 border-indigo-200 hover:bg-indigo-50'
              }`}
            >
              🎧 कॉल सेंटर
            </button>

            <button
              onClick={() => setActiveTab('hotel')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-2xs border ${
                activeTab === 'hotel'
                  ? 'bg-amber-600 text-white border-amber-700'
                  : 'bg-white text-amber-900 border-amber-200 hover:bg-amber-50'
              }`}
            >
              🏨 होटल/रेस्टोरेंट
            </button>

            <button
              onClick={() => setActiveTab('wfh')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-2xs border ${
                activeTab === 'wfh'
                  ? 'bg-teal-600 text-white border-teal-700'
                  : 'bg-white text-teal-800 border-teal-200 hover:bg-teal-50'
              }`}
            >
              💻 Work From Home
            </button>
          </div>
        </div>

        {/* Job Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-64 rounded-2xl bg-slate-200/70 animate-pulse" />
            ))}
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredJobs.map((job) => (
              <div key={job.id} className="job-feed-item">
                <JobCard
                  job={job}
                  onApplyClick={(j) => setSelectedJobForApply(j)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">
              {language === 'hi' ? `${userLoc.city} में इस श्रेणी की नौकरी अभी उपलब्ध नहीं है` : 'No vacancies match this filter'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {language === 'hi'
                ? 'आप अपना शहर बदल सकते हैं अथवा सभी प्राइवेट नौकरियां देख सकते हैं।'
                : 'Try switching to another qualification tab or select another city.'}
            </p>
            <div className="mt-4 flex justify-center space-x-3">
              <button
                onClick={() => setIsCityModalOpen(true)}
                className="bg-blue-600 text-white font-bold px-4 py-2 rounded-xl text-xs"
              >
                Change City
              </button>
              <button
                onClick={() => setActiveTab('all_pvt')}
                className="border border-slate-300 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs hover:bg-slate-50"
              >
                View All Private Jobs
              </button>
            </div>
          </div>
        )}

        {/* View All Openings CTA */}
        <div className="mt-10 text-center">
          <Link
            href={`/jobs?sector=private&city=${encodeURIComponent(userLoc.city)}`}
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-7 py-3.5 rounded-2xl shadow-md transition transform active:scale-95 text-xs sm:text-sm"
          >
            <span>{language === 'hi' ? `और भी प्राइवेट नौकरियां देखें (${userLoc.city} व राज्य)` : 'Browse More Local Jobs'}</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {/* Recruiter / Local Business Banner (Direct Call to hire 8th-12th pass staff) */}
        <section className="mt-16 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {language === 'hi' ? 'होटल, रेस्टोरेंट व दुकान मालिकों के लिए' : 'For Local Businesses & Hotels'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mt-2 leading-snug sm:leading-normal">
              {language === 'hi'
                ? 'क्या आपको कॉल सेंटर, होटल या दुकान के लिए स्टाफ चाहिए?'
                : 'Need Reliable Staff for your Store, Hotel or Call Center?'}
            </h2>
            <p className="text-xs sm:text-sm text-orange-100 mt-2 leading-relaxed">
              {language === 'hi'
                ? '8वीं, 10वीं व 12वीं पास मेहनती लड़कों और लड़कियों को अपनी दुकान या फर्म के लिए 24 घंटे के अंदर भर्ती करें। पहली जॉब पोस्टिंग बिल्कुल मुफ्त।'
                : 'Post your job for free. Connect with verified local candidates ready for immediate joining.'}
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <Link
              href="/employer/post-job"
              className="bg-white text-orange-700 hover:bg-orange-50 font-black px-6 py-3.5 rounded-2xl text-xs sm:text-sm shadow-md transition text-center"
            >
              {language === 'hi' ? 'मुफ्त में स्टाफ की नौकरी पोस्ट करें' : 'Post Free Job Now'}
            </Link>
            <Link
              href="/pricing"
              className="border border-white/60 text-white hover:bg-white/10 font-bold px-5 py-3.5 rounded-2xl text-xs sm:text-sm transition text-center"
            >
              {language === 'hi' ? 'रिक्रूटर प्लान देखें' : 'View Recruiter Plans'}
            </Link>
          </div>
        </section>
      </main>

      <Footer />

      {/* City Switcher Modal */}
      {isCityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setIsCityModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                {language === 'hi' ? 'स्थान चुनें' : 'Select Location'}
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                {language === 'hi' ? 'आप किस शहर में नौकरी ढूंढ रहे हैं?' : 'Which city are you looking for jobs in?'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {language === 'hi'
                  ? 'अपने शहर का चयन करें ताकि आपको नजदीकी कॉल सेंटर, होटल और दुकानें दिखाई दें।'
                  : 'Select your city to get local vacancies and immediate joining jobs.'}
              </p>
            </div>

            {/* Popular Cities Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {popularCities.map((item) => (
                <button
                  key={item.city}
                  onClick={() => handleSelectCity(item.city, item.state)}
                  className={`p-3 rounded-2xl border text-left transition flex items-start space-x-2 ${
                    userLoc.city === item.city
                      ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold block">{item.city}</span>
                    <span className="text-[10px] text-slate-400 block">{item.state}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
              <span>Current: <b>{userLoc.city}</b> ({userLoc.state})</span>
              <button
                onClick={() => setIsCityModalOpen(false)}
                className="text-blue-600 font-bold hover:underline"
              >
                Close
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

      <PaymentModal
        plan={paymentPlan}
        isOpen={!!paymentPlan}
        onClose={() => setPaymentPlan(null)}
        onPaymentSuccess={() => {
          setPaymentPlan(null);
          router.push('/employer/post-job');
        }}
      />
    </div>
  );
}
