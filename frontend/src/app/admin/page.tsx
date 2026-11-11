'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { JobListing, User, Transaction, JobApplication, Category, api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { 
  ShieldCheck, 
  Briefcase, 
  Users, 
  IndianRupee, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Lock,
  Sparkles, 
  TrendingUp, 
  Landmark, 
  LayoutDashboard, 
  CreditCard, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  PlusCircle, 
  ExternalLink, 
  Bell, 
  ChevronRight,
  Filter,
  Eye,
  Trash2,
  Check,
  Building2,
  Clock,
  Layers,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  FolderPlus,
  Edit3,
  UserCheck,
  CheckCircle,
  AlertCircle,
  RotateCcw
} from 'lucide-react';

export default function AdminPortalPage() {
  const { user, logout, loginAsAdmin } = useAuth();
  const router = useRouter();

  // Navigation state
  const [activeTab, setActiveTab] = useState<
    'overview' | 'jobs' | 'categories' | 'employers' | 'candidates' | 'admins' | 'applications' | 'revenue' | 'settings'
  >('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data state
  const [stats, setStats] = useState<any>(null);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter states
  const [jobSearch, setJobSearch] = useState('');
  const [jobSectorFilter, setJobSectorFilter] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [categorySearch, setCategorySearch] = useState('');

  // Category Modal State (Add / Edit)
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [catFormNameEn, setCatFormNameEn] = useState('');
  const [catFormNameHi, setCatFormNameHi] = useState('');
  const [catFormSlug, setCatFormSlug] = useState('');
  const [catFormIcon, setCatFormIcon] = useState('Briefcase');
  const [catFormIsGovt, setCatFormIsGovt] = useState(false);
  const [catSaving, setCatSaving] = useState(false);
  const [catError, setCatError] = useState<string | null>(null);
  const [selectedBiodataApp, setSelectedBiodataApp] = useState<JobApplication | null>(null);

  useEffect(() => {
    async function loadAdminData() {
      if (!user || user.role !== 'admin') return;
      try {
        setLoading(true);
        const [statsRes, jobsRes, usersRes, txRes, appsRes, catRes] = await Promise.all([
          api.getAdminStats(),
          api.getAdminJobs(),
          api.getAdminUsers(),
          api.getAdminTransactions(),
          api.getEmployerApplications(),
          api.getAdminCategories(),
        ]);
        setStats(statsRes.stats);
        setJobs(jobsRes.data);
        setUsers(usersRes.data);
        setTransactions(txRes.data);
        setApplications(appsRes.data || []);
        setCategories(catRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, [user]);

  // Job Actions
  const handleToggleJobFeatured = async (id: number, current: boolean) => {
    try {
      await api.updateAdminJobStatus(id, { is_featured: !current });
      setJobs(prev => prev.map(j => j.id === id ? { ...j, is_featured: !current } : j));
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleJobStatus = async (id: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'closed' : 'active';
    try {
      await api.updateAdminJobStatus(id, { status: nextStatus });
      setJobs(prev => prev.map(j => j.id === id ? { ...j, status: nextStatus as any } : j));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteJob = async (id: number) => {
    if (!confirm('Are you sure you want to permanently delete this job listing?')) return;
    try {
      await api.deleteJob(id);
      setJobs(prev => prev.filter(j => j.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // User Actions
  const handleToggleUserStatus = async (id: number) => {
    try {
      const res = await api.toggleAdminUserStatus(id);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, is_active: res.user.is_active } : u));
    } catch (err) {
      console.error(err);
    }
  };

  // Category Actions
  const openAddCategoryModal = () => {
    setEditingCategory(null);
    setCatFormNameEn('');
    setCatFormNameHi('');
    setCatFormSlug('');
    setCatFormIcon('Briefcase');
    setCatFormIsGovt(false);
    setCatError(null);
    setCatModalOpen(true);
  };

  const openEditCategoryModal = (cat: Category) => {
    setEditingCategory(cat);
    setCatFormNameEn(cat.name_en);
    setCatFormNameHi(cat.name_hi);
    setCatFormSlug(cat.slug);
    setCatFormIcon(cat.icon || 'Briefcase');
    setCatFormIsGovt(Boolean(cat.is_govt));
    setCatError(null);
    setCatModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catFormNameEn || !catFormNameHi) {
      setCatError('Both English and Hindi names are required.');
      return;
    }

    setCatSaving(true);
    setCatError(null);

    try {
      if (editingCategory) {
        // Update
        const res = await api.updateAdminCategory(editingCategory.id, {
          name_en: catFormNameEn,
          name_hi: catFormNameHi,
          slug: catFormSlug || undefined,
          icon: catFormIcon,
          is_govt: catFormIsGovt,
        });
        setCategories(prev => prev.map(c => c.id === editingCategory.id ? res.category : c));
      } else {
        // Create
        const res = await api.createAdminCategory({
          name_en: catFormNameEn,
          name_hi: catFormNameHi,
          slug: catFormSlug || undefined,
          icon: catFormIcon,
          is_govt: catFormIsGovt,
        });
        setCategories(prev => [res.category, ...prev]);
      }
      setCatModalOpen(false);
    } catch (err: any) {
      setCatError(err.message || 'Failed to save category');
    } finally {
      setCatSaving(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await api.deleteAdminCategory(id);
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      alert(err.message || 'Cannot delete category');
    }
  };

  // If not logged in as Admin, show clean access gate
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
        <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700 text-center shadow-2xl max-w-md w-full text-white">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-red-400">Restricted Access</span>
          <h1 className="text-2xl font-black mt-1 mb-2">Naukarix Admin Portal</h1>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            Please log in with administrator privileges to manage jobs, screen applicants, and monitor portal revenues.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => loginAsAdmin()}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl text-xs transition shadow-md flex items-center justify-center space-x-2"
            >
              <Lock className="w-4 h-4" />
              <span>1-Click Admin Access (admin@naukarix.in)</span>
            </button>
            <Link
              href="/"
              className="block w-full border border-slate-700 text-slate-300 font-semibold py-2.5 rounded-xl text-xs hover:bg-slate-700 transition"
            >
              Return to Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filtered jobs
  const filteredJobs = jobs.filter(j => {
    if (jobSectorFilter && j.sector !== jobSectorFilter) return false;
    if (jobSearch) {
      const q = jobSearch.toLowerCase();
      return (j.title || '').toLowerCase().includes(q) || 
             (j.company_name || '').toLowerCase().includes(q) || 
             (j.location_display || '').toLowerCase().includes(q) ||
             (j.city || '').toLowerCase().includes(q);
    }
    return true;
  });

  // SEPARATED USERS (Candidate, Employer, Admin separated into dedicated lists)
  const employersList = users.filter(u => u.role === 'employer').filter(u => {
    if (!userSearch) return true;
    const q = userSearch.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.company_name || '').toLowerCase().includes(q) || (u.current_city || '').toLowerCase().includes(q);
  });

  const candidatesList = users.filter(u => u.role === 'candidate').filter(u => {
    if (!userSearch) return true;
    const q = userSearch.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.phone || '').includes(q) || (u.current_city || '').toLowerCase().includes(q);
  });

  const adminsList = users.filter(u => u.role === 'admin').filter(u => {
    if (!userSearch) return true;
    const q = userSearch.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  // Filtered Categories
  const filteredCategories = categories.filter(c => {
    if (!categorySearch) return true;
    const q = categorySearch.toLowerCase();
    return c.name_en.toLowerCase().includes(q) || c.name_hi.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q);
  });

  const navItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard, badge: null },
    { id: 'jobs', label: 'Manage Jobs', icon: Briefcase, badge: jobs.length },
    { id: 'categories', label: 'Job Categories', icon: Layers, badge: categories.length },
    { id: 'employers', label: 'Recruiters & Companies', icon: Building2, badge: employersList.length },
    { id: 'candidates', label: 'Job Candidates', icon: Users, badge: candidatesList.length },
    { id: 'admins', label: 'Admin Staff', icon: ShieldCheck, badge: adminsList.length },
    { id: 'applications', label: 'All Applications', icon: FileText, badge: applications.length },
    { id: 'revenue', label: 'Revenue & Invoices', icon: CreditCard, badge: `₹${(stats?.total_revenue || 0).toLocaleString('en-IN')}` },
    { id: 'settings', label: 'Portal & SEO Health', icon: Settings, badge: 'Live' },
  ];

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100 font-sans selection:bg-red-600 selection:text-white">
      {/* 1. LEFT SIDEBAR (COLLAPSIBLE / DESKTOP STICKY) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div>
          {/* Brand Logo & Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-orange-500 flex items-center justify-center text-white font-black shadow-md">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-white">
                  Naukari<span className="text-red-500">x</span>
                </span>
                <span className="block text-[9px] uppercase font-bold tracking-widest text-slate-400 -mt-1">
                  Admin Control Suite
                </span>
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items List */}
          <div className="px-3 py-4 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
            <p className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2">
              Main Operations
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    isSelected
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== null && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                      isSelected ? 'bg-red-700 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom User Info & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-amber-600 text-white font-bold flex items-center justify-center uppercase text-sm">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
            </div>
          </div>

          <div className="flex space-x-2">
            <Link
              href="/"
              className="flex-1 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-[11px] font-bold text-center text-slate-300 transition"
            >
              Live Site
            </Link>
            <button
              onClick={() => logout()}
              className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[11px] font-bold transition flex items-center justify-center"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <Menu className="w-5 h-5" />
            </button>

            <h1 className="text-base font-bold text-white capitalize flex items-center space-x-2">
              <span>
                {activeTab === 'overview' && 'System Analytics & Overview'}
                {activeTab === 'jobs' && 'Vacancy Management'}
                {activeTab === 'categories' && 'Job Categories & Sectors'}
                {activeTab === 'employers' && 'Verified Recruiters & Companies'}
                {activeTab === 'candidates' && 'Job Seekers & Candidates'}
                {activeTab === 'admins' && 'System Administrators'}
                {activeTab === 'applications' && 'Applicant Screening'}
                {activeTab === 'revenue' && 'Revenue & Payment Gateways'}
                {activeTab === 'settings' && 'SEO & Portal Settings'}
              </span>
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/employer/post-job"
              className="hidden sm:flex items-center space-x-1.5 bg-red-600 hover:bg-red-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post New Vacancy</span>
            </Link>

            <Link
              href="/"
              target="_blank"
              className="text-xs text-slate-400 hover:text-white border border-slate-700 px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1"
            >
              <span>View Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-slate-400 text-xs">
              <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mr-3"></div>
              <span>Synchronizing Naukarix Data...</span>
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && stats && (
                <div className="space-y-6">
                  {/* Top 4 KPI Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-bold uppercase">Active Vacancies</span>
                        <Briefcase className="w-5 h-5 text-red-500" />
                      </div>
                      <p className="text-3xl font-black text-white mt-2">{stats.total_jobs}</p>
                      <p className="text-[11px] text-emerald-400 mt-2 font-bold flex items-center">
                        <TrendingUp className="w-3.5 h-3.5 mr-1" />
                        {stats.pvt_jobs} Private • {stats.govt_jobs} Govt
                      </p>
                    </div>

                    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-bold uppercase">Registered Employers</span>
                        <Building2 className="w-5 h-5 text-amber-500" />
                      </div>
                      <p className="text-3xl font-black text-white mt-2">{stats.total_employers}</p>
                      <p className="text-[11px] text-slate-400 mt-2">BPOs, Hotels & Local Businesses</p>
                    </div>

                    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-bold uppercase">Job Applications</span>
                        <FileText className="w-5 h-5 text-blue-500" />
                      </div>
                      <p className="text-3xl font-black text-white mt-2">{stats.total_applications}</p>
                      <p className="text-[11px] text-blue-400 mt-2">{stats.total_candidates} Registered Seekers</p>
                    </div>

                    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-bold uppercase">Total Revenue</span>
                        <IndianRupee className="w-5 h-5 text-emerald-400" />
                      </div>
                      <p className="text-3xl font-black text-emerald-400 mt-2">
                        ₹{stats.total_revenue.toLocaleString('en-IN')}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-2">Paid Recruiter Plans (INR)</p>
                    </div>
                  </div>

                  {/* Two Column Section: Recent Applications + Top Jobs */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Applications */}
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-blue-400" />
                          <span>Recent Applicant Submissions</span>
                        </h3>
                        <button
                          onClick={() => setActiveTab('applications')}
                          className="text-xs text-red-400 hover:text-red-300 font-bold"
                        >
                          View All →
                        </button>
                      </div>

                      <div className="space-y-3">
                        {applications.slice(0, 5).map((app) => (
                          <div key={app.id} className="p-3 bg-slate-800/50 rounded-xl flex items-center justify-between">
                            <div>
                              <p className="text-xs font-bold text-white">{app.full_name}</p>
                              <p className="text-[11px] text-slate-400">{app.job_listing?.title} • {app.phone}</p>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">
                              {app.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* System & Architecture Health */}
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
                      <h3 className="text-sm font-bold text-white flex items-center space-x-2 pb-3 border-b border-slate-800 mb-4">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>Naukarix Engine Status</span>
                      </h3>

                      <div className="space-y-3 text-xs">
                        <div className="flex items-center justify-between p-2.5 bg-slate-800/60 rounded-xl">
                          <span className="text-slate-400">Google JobPosting Schema</span>
                          <span className="text-emerald-400 font-bold flex items-center">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Active (Valid JSON-LD)
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-2.5 bg-slate-800/60 rounded-xl">
                          <span className="text-slate-400">IP City Detection & Geolocation</span>
                          <span className="text-emerald-400 font-bold flex items-center">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Enabled (Auto City + State Fallback)
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-2.5 bg-slate-800/60 rounded-xl">
                          <span className="text-slate-400">Instant Biodata Maker</span>
                          <span className="text-emerald-400 font-bold flex items-center">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Active (/resume-builder)
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-2.5 bg-slate-800/60 rounded-xl">
                          <span className="text-slate-400">Mobile API Service</span>
                          <span className="text-emerald-400 font-bold flex items-center">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Ready (GET /api/app/home)
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-2.5 bg-slate-800/60 rounded-xl">
                          <span className="text-slate-400">Typography Engine</span>
                          <span className="text-amber-400 font-bold">Laila (Regular 400 & Bold 700)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: MANAGE JOBS */}
              {activeTab === 'jobs' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="Search by title, company, city..."
                        value={jobSearch}
                        onChange={(e) => setJobSearch(e.target.value)}
                        className="w-full bg-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-700 text-white outline-hidden focus:border-red-500"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <select
                        value={jobSectorFilter}
                        onChange={(e) => setJobSectorFilter(e.target.value)}
                        className="bg-slate-800 text-xs py-2 px-3 rounded-xl border border-slate-700 text-slate-300 outline-hidden"
                      >
                        <option value="">All Sectors</option>
                        <option value="private">Private / Local Staffing</option>
                        <option value="government">Government / Sarkari</option>
                      </select>
                    </div>
                  </div>

                  {/* Jobs Table */}
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                          <tr>
                            <th className="py-3 px-4 font-bold">Vacancy Title & Company</th>
                            <th className="py-3 px-4 font-bold">Sector</th>
                            <th className="py-3 px-4 font-bold">Location</th>
                            <th className="py-3 px-4 font-bold">Qualification</th>
                            <th className="py-3 px-4 font-bold">Applications</th>
                            <th className="py-3 px-4 font-bold">Featured</th>
                            <th className="py-3 px-4 font-bold">Status</th>
                            <th className="py-3 px-4 font-bold text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-slate-300">
                          {filteredJobs.map((j) => (
                            <tr key={j.id} className="hover:bg-slate-800/50">
                              <td className="py-3 px-4">
                                <span className="font-bold text-white block">{j.title}</span>
                                <span className="text-[11px] text-slate-400">{j.company_name}</span>
                              </td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  j.sector === 'government' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                                }`}>
                                  {j.sector}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-slate-400">{j.location_display}</td>
                              <td className="py-3 px-4">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300">
                                  {j.qualification_level?.replace('_', ' ') || 'Any'}
                                </span>
                              </td>
                              <td className="py-3 px-4 font-bold text-white">{j.applications_count ?? 0}</td>
                              <td className="py-3 px-4">
                                <button
                                  onClick={() => handleToggleJobFeatured(j.id, j.is_featured)}
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                                    j.is_featured ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-500 hover:text-white'
                                  }`}
                                >
                                  {j.is_featured ? '⭐ Featured' : 'Normal'}
                                </button>
                              </td>
                              <td className="py-3 px-4">
                                <button
                                  onClick={() => handleToggleJobStatus(j.id, j.status)}
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    j.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                                  }`}
                                >
                                  {j.status}
                                </button>
                              </td>
                              <td className="py-3 px-4 text-right space-x-2">
                                <Link href={`/jobs/${j.slug}`} target="_blank" className="text-blue-400 hover:text-blue-300 font-bold">
                                  View
                                </Link>
                                <button
                                  onClick={() => handleDeleteJob(j.id)}
                                  className="text-red-400 hover:text-red-300 font-bold"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: JOB CATEGORIES (ADD & EDIT CATEGORIES) */}
              {activeTab === 'categories' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="Search categories (English / Hindi)..."
                        value={categorySearch}
                        onChange={(e) => setCategorySearch(e.target.value)}
                        className="w-full bg-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-700 text-white outline-hidden"
                      />
                    </div>

                    <button
                      onClick={openAddCategoryModal}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md flex items-center space-x-2"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>+ Add New Category (नई श्रेणी जोड़ें)</span>
                    </button>
                  </div>

                  {/* Categories Table */}
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                          <tr>
                            <th className="py-3 px-4 font-bold">Category Name (English & Hindi)</th>
                            <th className="py-3 px-4 font-bold">Slug / URL</th>
                            <th className="py-3 px-4 font-bold">Icon</th>
                            <th className="py-3 px-4 font-bold">Sector</th>
                            <th className="py-3 px-4 font-bold">Active Jobs</th>
                            <th className="py-3 px-4 font-bold text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-slate-300">
                          {filteredCategories.map((cat) => (
                            <tr key={cat.id} className="hover:bg-slate-800/50">
                              <td className="py-3 px-4">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 font-bold">
                                    <Layers className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <span className="font-bold text-white block">{cat.name_en}</span>
                                    <span className="text-[11px] text-amber-400">{cat.name_hi}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                                {cat.slug}
                              </td>
                              <td className="py-3 px-4">
                                <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-mono">
                                  {cat.icon || 'Briefcase'}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  cat.is_govt ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                                }`}>
                                  {cat.is_govt ? 'Government' : 'Private'}
                                </span>
                              </td>
                              <td className="py-3 px-4 font-bold text-white">
                                {cat.job_count ?? 0}
                              </td>
                              <td className="py-3 px-4 text-right space-x-2">
                                <button
                                  onClick={() => openEditCategoryModal(cat)}
                                  className="text-xs font-bold text-amber-400 hover:text-amber-300 inline-flex items-center space-x-1"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteCategory(cat.id)}
                                  className="text-xs font-bold text-red-400 hover:text-red-300 inline-flex items-center space-x-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: RECRUITERS & EMPLOYERS (SEPARATED) */}
              {activeTab === 'employers' && (
                <div className="space-y-4">
                  {/* Sub-navigation pill switchers */}
                  <div className="flex items-center space-x-2 pb-1 border-b border-slate-800 text-xs">
                    <button
                      onClick={() => setActiveTab('employers')}
                      className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 flex items-center space-x-2"
                    >
                      <Building2 className="w-4 h-4" />
                      <span>🏢 Recruiters & Companies ({employersList.length})</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('candidates')}
                      className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white font-bold flex items-center space-x-2"
                    >
                      <Users className="w-4 h-4" />
                      <span>👨‍🎓 Job Candidates ({candidatesList.length})</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('admins')}
                      className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white font-bold flex items-center space-x-2"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>🛡️ Admin Staff ({adminsList.length})</span>
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="Search recruiters by company, name, email..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="w-full bg-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-700 text-white outline-hidden"
                      />
                    </div>
                    <span className="text-xs text-slate-400">Total {employersList.length} Registered Recruiters</span>
                  </div>

                  <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                          <tr>
                            <th className="py-3 px-4 font-bold">Company & Recruiter Name</th>
                            <th className="py-3 px-4 font-bold">Official Email & Phone</th>
                            <th className="py-3 px-4 font-bold">City / Location</th>
                            <th className="py-3 px-4 font-bold">Jobs Posted</th>
                            <th className="py-3 px-4 font-bold">Status</th>
                            <th className="py-3 px-4 font-bold text-right">Moderation</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-slate-300">
                          {employersList.map((emp) => (
                            <tr key={emp.id} className="hover:bg-slate-800/50">
                              <td className="py-3 px-4">
                                <span className="font-bold text-white block">{emp.company_name || 'Independent Employer'}</span>
                                <span className="text-[11px] text-amber-400">Contact: {emp.name}</span>
                              </td>
                              <td className="py-3 px-4">
                                <span className="text-slate-300 block">{emp.email}</span>
                                <span className="text-[11px] text-slate-500">{emp.phone || 'No phone'}</span>
                              </td>
                              <td className="py-3 px-4 text-slate-400">{emp.current_city || 'All India'}</td>
                              <td className="py-3 px-4 font-bold text-white">
                                {jobs.filter(j => j.user_id === emp.id).length || 1}
                              </td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  emp.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                                }`}>
                                  {emp.is_active ? 'Active' : 'Suspended'}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <button
                                  onClick={() => handleToggleUserStatus(emp.id)}
                                  className={`text-xs font-bold ${emp.is_active ? 'text-red-400 hover:text-red-300' : 'text-emerald-400 hover:text-emerald-300'}`}
                                >
                                  {emp.is_active ? 'Suspend Recruiter' : 'Activate'}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: JOB CANDIDATES (SEPARATED) */}
              {activeTab === 'candidates' && (
                <div className="space-y-4">
                  {/* Sub-navigation pill switchers */}
                  <div className="flex items-center space-x-2 pb-1 border-b border-slate-800 text-xs">
                    <button
                      onClick={() => setActiveTab('employers')}
                      className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white font-bold flex items-center space-x-2"
                    >
                      <Building2 className="w-4 h-4" />
                      <span>🏢 Recruiters & Companies ({employersList.length})</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('candidates')}
                      className="px-4 py-2 rounded-xl bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30 flex items-center space-x-2"
                    >
                      <Users className="w-4 h-4" />
                      <span>👨‍🎓 Job Candidates ({candidatesList.length})</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('admins')}
                      className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white font-bold flex items-center space-x-2"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>🛡️ Admin Staff ({adminsList.length})</span>
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="Search candidate by name, phone, city..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="w-full bg-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-700 text-white outline-hidden"
                      />
                    </div>
                    <span className="text-xs text-slate-400">Total {candidatesList.length} Job Seekers</span>
                  </div>

                  <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                          <tr>
                            <th className="py-3 px-4 font-bold">Candidate Name</th>
                            <th className="py-3 px-4 font-bold">Mobile & WhatsApp</th>
                            <th className="py-3 px-4 font-bold">City / State</th>
                            <th className="py-3 px-4 font-bold">Experience / Qualification</th>
                            <th className="py-3 px-4 font-bold">Resume / Biodata</th>
                            <th className="py-3 px-4 font-bold">Status</th>
                            <th className="py-3 px-4 font-bold text-right">Moderation</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-slate-300">
                          {candidatesList.map((cand) => (
                            <tr key={cand.id} className="hover:bg-slate-800/50">
                              <td className="py-3 px-4">
                                <span className="font-bold text-white block">{cand.name}</span>
                                <span className="text-[11px] text-slate-400">{cand.email}</span>
                              </td>
                              <td className="py-3 px-4">
                                <span className="font-bold text-emerald-400 block">{cand.phone || 'N/A'}</span>
                              </td>
                              <td className="py-3 px-4 text-slate-300">
                                {cand.current_city || 'Lucknow'}, {cand.state || 'UP'}
                              </td>
                              <td className="py-3 px-4">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                                  {cand.experience_years ? `${cand.experience_years} Yrs Exp` : 'Fresher'}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                {cand.resume_path ? (
                                  <span className="text-emerald-400 font-bold flex items-center text-[11px]">
                                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                    Available
                                  </span>
                                ) : (
                                  <span className="text-amber-400 text-[11px]">Direct Biodata</span>
                                )}
                              </td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  cand.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                                }`}>
                                  {cand.is_active ? 'Active' : 'Suspended'}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <button
                                  onClick={() => handleToggleUserStatus(cand.id)}
                                  className={`text-xs font-bold ${cand.is_active ? 'text-red-400 hover:text-red-300' : 'text-emerald-400 hover:text-emerald-300'}`}
                                >
                                  {cand.is_active ? 'Suspend' : 'Activate'}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: ADMIN STAFF (SEPARATED) */}
              {activeTab === 'admins' && (
                <div className="space-y-4">
                  {/* Sub-navigation pill switchers */}
                  <div className="flex items-center space-x-2 pb-1 border-b border-slate-800 text-xs">
                    <button
                      onClick={() => setActiveTab('employers')}
                      className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white font-bold flex items-center space-x-2"
                    >
                      <Building2 className="w-4 h-4" />
                      <span>🏢 Recruiters & Companies ({employersList.length})</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('candidates')}
                      className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white font-bold flex items-center space-x-2"
                    >
                      <Users className="w-4 h-4" />
                      <span>👨‍🎓 Job Candidates ({candidatesList.length})</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('admins')}
                      className="px-4 py-2 rounded-xl bg-red-500/20 text-red-300 font-bold border border-red-500/30 flex items-center space-x-2"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>🛡️ Admin Staff ({adminsList.length})</span>
                    </button>
                  </div>

                  <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                        <tr>
                          <th className="py-3 px-4 font-bold">Admin Full Name</th>
                          <th className="py-3 px-4 font-bold">Email Address</th>
                          <th className="py-3 px-4 font-bold">Contact Phone</th>
                          <th className="py-3 px-4 font-bold">Role & Permissions</th>
                          <th className="py-3 px-4 font-bold">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        {adminsList.map((adm) => (
                          <tr key={adm.id} className="hover:bg-slate-800/50">
                            <td className="py-3 px-4 font-bold text-white flex items-center space-x-2">
                              <ShieldCheck className="w-4 h-4 text-red-400" />
                              <span>{adm.name}</span>
                            </td>
                            <td className="py-3 px-4 text-slate-300">{adm.email}</td>
                            <td className="py-3 px-4 text-slate-400">{adm.phone || '+91 98765 43210'}</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 uppercase">
                                Super Administrator
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-emerald-400 font-bold text-xs flex items-center">
                                <CheckCircle className="w-3.5 h-3.5 mr-1" /> Active
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 7: ALL APPLICATIONS */}
              {activeTab === 'applications' && (
                <div className="space-y-4">
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4">
                    <h3 className="font-bold text-white text-sm">All Candidate Applications</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Direct resume downloads and applicant tracking across all portal jobs.</p>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {applications.map((app) => (
                      <div key={app.id} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-white text-sm">{app.full_name}</span>
                            <span className="text-slate-600">•</span>
                            <span className="text-xs text-slate-400">{app.email}</span>
                            <span className="text-xs text-slate-400">({app.phone})</span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                            <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                              Role: <strong className="text-white">{app.job_listing?.title}</strong>
                            </span>
                            <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                              Company: <strong className="text-white">{app.job_listing?.company_name}</strong>
                            </span>
                            <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                              City: <strong className="text-white">{app.current_city || 'Not specified'}</strong>
                            </span>
                            <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                              Exp: <strong className="text-white">{app.total_experience} Yrs</strong>
                            </span>
                          </div>

                          {app.cover_letter && (
                            <p className="text-xs text-slate-400 mt-2 line-clamp-2 bg-slate-950 p-2 rounded-lg font-mono">
                              {app.cover_letter}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center space-x-3 shrink-0">
                          {app.resume_url === 'AUTO_GENERATED_BIODATA' || (!app.resume_url && app.cover_letter) ? (
                            <button
                              type="button"
                              onClick={() => setSelectedBiodataApp(app)}
                              className="px-3.5 py-1.5 rounded-xl border border-orange-500/30 bg-orange-500/10 hover:bg-orange-500/20 text-xs text-orange-400 font-bold transition flex items-center space-x-1"
                            >
                              <FileText className="w-3.5 h-3.5 text-orange-400" />
                              <span>View Biodata</span>
                            </button>
                          ) : app.resume_url ? (
                            <a
                              href={app.resume_url.startsWith('http') ? app.resume_url : (app.resume_url.startsWith('/storage') ? `http://127.0.0.1:8000${app.resume_url}` : app.resume_url)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3.5 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs text-white font-bold transition flex items-center space-x-1"
                            >
                              <FileText className="w-3.5 h-3.5 text-blue-400" />
                              <span>View Resume PDF</span>
                            </a>
                          ) : null}

                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            app.status === 'applied' ? 'bg-blue-500/20 text-blue-400' :
                            app.status === 'shortlisted' ? 'bg-emerald-500/20 text-emerald-400' :
                            'bg-slate-800 text-slate-300'
                          }`}>
                            {app.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 8: REVENUE & INVOICES */}
              {activeTab === 'revenue' && (
                <div className="space-y-4">
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-white text-base">Transactions & Paid Recruiter Packages</h3>
                      <p className="text-xs text-slate-400 mt-1">Live Razorpay / UPI simulated payment ledger.</p>
                    </div>

                    <div className="bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-700 text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Total Cleared Revenue</span>
                      <p className="text-xl font-black text-emerald-400">₹{(stats?.total_revenue || 0).toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                          <tr>
                            <th className="py-3 px-4 font-bold">Transaction Ref</th>
                            <th className="py-3 px-4 font-bold">Recruiter</th>
                            <th className="py-3 px-4 font-bold">Package Plan</th>
                            <th className="py-3 px-4 font-bold">Amount</th>
                            <th className="py-3 px-4 font-bold">Gateway / Method</th>
                            <th className="py-3 px-4 font-bold">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-slate-300">
                          {transactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-slate-800/50">
                              <td className="py-3 px-4 font-mono font-bold text-white">{tx.transaction_id || tx.invoice_number}</td>
                              <td className="py-3 px-4">{tx.user?.company_name || tx.user?.name}</td>
                              <td className="py-3 px-4 font-bold text-amber-400">{tx.pricing_plan?.name}</td>
                              <td className="py-3 px-4 font-black text-emerald-400">₹{tx.amount}</td>
                              <td className="py-3 px-4 uppercase text-[10px]">{tx.payment_method}</td>
                              <td className="py-3 px-4">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                                  {tx.payment_status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 9: SETTINGS & SEO */}
              {activeTab === 'settings' && (
                <div className="space-y-6 max-w-4xl">
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
                    <h3 className="font-bold text-white text-base flex items-center space-x-2">
                      <Settings className="w-5 h-5 text-red-500" />
                      <span>Portal Settings & SEO Infrastructure</span>
                    </h3>

                    <div className="space-y-4 text-xs">
                      <div className="p-4 bg-slate-800/60 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="font-bold text-white">Google Schema.org JobPosting Structured Data</p>
                          <p className="text-slate-400 text-[11px]">Generates JSON-LD scripts on every job page for Google Jobs search integration.</p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">Enabled</span>
                      </div>

                      <div className="p-4 bg-slate-800/60 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="font-bold text-white">Automated XML Sitemap & Robots.txt</p>
                          <p className="text-slate-400 text-[11px]">Real-time sitemap for all private, government, and state-wise jobs.</p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">Active (/sitemap.xml)</span>
                      </div>

                      <div className="p-4 bg-slate-800/60 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="font-bold text-white">IP Geolocation City + State Fallback</p>
                          <p className="text-slate-400 text-[11px]">Detects user IP for local staffing and falls back to statewide jobs automatically.</p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">Active</span>
                      </div>

                      <div className="p-4 bg-slate-800/60 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="font-bold text-white">Mobile Application REST API</p>
                          <p className="text-slate-400 text-[11px]">Dedicated mobile feed endpoints for Flutter, Android & iOS.</p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">Active (/api/app/home)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* CATEGORY ADD / EDIT MODAL */}
      {catModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white flex items-center space-x-2">
                <Layers className="w-5 h-5 text-red-500" />
                <span>
                  {editingCategory ? 'Edit Job Category (कैटेगरी बदलें)' : 'Add New Category (नई श्रेणी जोड़ें)'}
                </span>
              </h3>
              <button
                onClick={() => setCatModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {catError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 font-bold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{catError}</span>
              </div>
            )}

            <form onSubmit={handleSaveCategory} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">
                  Category Name in English *
                </label>
                <input
                  type="text"
                  required
                  value={catFormNameEn}
                  onChange={(e) => setCatFormNameEn(e.target.value)}
                  placeholder="e.g. Security & Facility"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-hidden focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">
                  Category Name in Hindi (हिंदी नाम) *
                </label>
                <input
                  type="text"
                  required
                  value={catFormNameHi}
                  onChange={(e) => setCatFormNameHi(e.target.value)}
                  placeholder="उदा. सुरक्षा व गार्ड सेवाएं"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-hidden focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">
                  Slug (URL identifier - optional)
                </label>
                <input
                  type="text"
                  value={catFormSlug}
                  onChange={(e) => setCatFormSlug(e.target.value)}
                  placeholder="e.g. security-facility (auto-generated if left blank)"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-hidden focus:border-red-500 font-mono text-[11px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">
                    Icon Name
                  </label>
                  <select
                    value={catFormIcon}
                    onChange={(e) => setCatFormIcon(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-hidden"
                  >
                    <option value="Briefcase">Briefcase (सामान्य)</option>
                    <option value="Headphones">Headphones (कॉल सेंटर)</option>
                    <option value="Hotel">Hotel (होटल/रेस्टोरेंट)</option>
                    <option value="ShoppingBag">ShoppingBag (दुकान/सेल्स)</option>
                    <option value="GraduationCap">GraduationCap (फ्रेशर्स)</option>
                    <option value="ShieldCheck">ShieldCheck (सुरक्षा/सिक्योरिटी)</option>
                    <option value="Laptop">Laptop (WFH/कंप्यूटर)</option>
                    <option value="Car">Car (ड्राइवर/डिलीवरी)</option>
                    <option value="Landmark">Landmark (सरकारी)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">
                    Sector Type
                  </label>
                  <select
                    value={catFormIsGovt ? 'govt' : 'private'}
                    onChange={(e) => setCatFormIsGovt(e.target.value === 'govt')}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-hidden font-bold"
                  >
                    <option value="private">Private (प्राइवेट जॉब्स)</option>
                    <option value="govt">Government (सरकारी भर्ती)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex space-x-2">
                <button
                  type="submit"
                  disabled={catSaving}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl transition shadow-md flex items-center justify-center space-x-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{catSaving ? 'Saving...' : (editingCategory ? 'Update Category' : 'Save Category')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCatModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-bold hover:bg-slate-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Applicant Biodata Viewer Modal */}
      {selectedBiodataApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-4 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-white text-base">{selectedBiodataApp.full_name}</h3>
                <p className="text-xs text-slate-400">Applicant Bio-Data Sheet • {selectedBiodataApp.phone}</p>
              </div>
              <button
                onClick={() => setSelectedBiodataApp(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs whitespace-pre-wrap text-slate-300 leading-relaxed">
              {selectedBiodataApp.cover_letter || 'No additional biodata details provided.'}
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => window.print()}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition"
              >
                Print / Save PDF
              </button>
              <button
                onClick={() => setSelectedBiodataApp(null)}
                className="border border-slate-700 text-slate-300 font-bold px-4 py-2 rounded-xl text-xs hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
