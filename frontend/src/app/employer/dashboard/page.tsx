'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { JobListing, JobApplication, api } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { 
  Building2, 
  PlusCircle, 
  Users, 
  Briefcase, 
  Eye, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ExternalLink, 
  Sparkles,
  Search,
  Filter,
  Trash2
} from 'lucide-react';

export default function EmployerDashboardPage() {
  const { language, t } = useLanguage();
  const { user, loginAsEmployer } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'jobs' | 'applications'>('jobs');
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchCandidate, setSearchCandidate] = useState('');
  const [selectedBiodata, setSelectedBiodata] = useState<JobApplication | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      try {
        setLoading(true);
        const [jobsRes, appsRes] = await Promise.all([
          api.getEmployerJobs(),
          api.getEmployerApplications(),
        ]);
        setJobs(jobsRes.data || []);
        setApplications(appsRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const handleUpdateStatus = async (appId: number, newStatus: string) => {
    try {
      await api.updateApplicationStatus(appId, newStatus);
      setApplications(prev =>
        prev.map(a => a.id === appId ? { ...a, status: newStatus as any } : a)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteJob = async (jobId: number) => {
    if (!confirm('Are you sure you want to delete this job posting?')) return;
    try {
      await api.deleteJob(jobId);
      setJobs(prev => prev.filter(j => j.id !== jobId));
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-slate-200 text-center shadow-lg">
          <Building2 className="w-14 h-14 text-orange-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Recruiter Sign In Required</h2>
          <p className="text-xs text-slate-500 mb-6">
            Sign in as an employer to view incoming applicant resumes and post new vacancies.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => loginAsEmployer()}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 rounded-xl text-xs transition"
            >
              1-Click Demo Recruiter Login (Ananya @ Infosys)
            </button>
            <Link
              href="/auth/login"
              className="block w-full border border-slate-300 text-slate-700 font-semibold py-2.5 rounded-xl text-xs hover:bg-slate-50 transition"
            >
              Go to Login Page
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const filteredApplications = applications.filter((app) => {
    if (statusFilter && app.status !== statusFilter) return false;
    if (searchCandidate) {
      const q = searchCandidate.toLowerCase();
      return (
        app.full_name.toLowerCase().includes(q) ||
        app.email.toLowerCase().includes(q) ||
        (app.job_listing?.title || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              Recruiter Command Center
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
              {user.company_name || user.name}&apos;s Hiring Panel
            </h1>
            <p className="text-xs text-slate-500">
              Manage live job postings, screen applicant resumes, and track candidates.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/pricing"
              className="px-4 py-2 rounded-xl text-xs font-bold text-orange-700 bg-orange-50 border border-orange-200 hover:bg-orange-100 transition"
            >
              Upgrade Recruiter Plan
            </Link>

            <Link
              href="/employer/post-job"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-xs transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post New Vacancy</span>
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{jobs.length}</p>
              <p className="text-xs text-slate-500 font-medium">Active Vacancies</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{applications.length}</p>
              <p className="text-xs text-slate-500 font-medium">Total Applicants Received</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">
                {applications.filter(a => a.status === 'shortlisted' || a.status === 'selected').length}
              </p>
              <p className="text-xs text-slate-500 font-medium">Shortlisted Candidates</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 border-b border-slate-200 pb-px mb-6">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition flex items-center space-x-1.5 ${
              activeTab === 'jobs'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>My Posted Jobs ({jobs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('applications')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition flex items-center space-x-1.5 ${
              activeTab === 'applications'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Candidate Applications ({applications.length})</span>
          </button>
        </div>

        {/* Tab 1: My Jobs */}
        {activeTab === 'jobs' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 font-bold">Job Title</th>
                    <th className="py-3 px-4 font-bold">Sector</th>
                    <th className="py-3 px-4 font-bold">Views</th>
                    <th className="py-3 px-4 font-bold">Applications</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                    <th className="py-3 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4">
                        <Link href={`/jobs/${job.slug}`} className="font-bold text-slate-900 hover:text-blue-600">
                          {job.title}
                        </Link>
                        <p className="text-[11px] text-slate-400 mt-0.5">{job.location_display}</p>
                      </td>
                      <td className="py-3 px-4 capitalize">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          job.sector === 'government' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {job.sector}
                        </span>
                      </td>
                      <td className="py-3 px-4">{job.views_count}</td>
                      <td className="py-3 px-4 font-bold text-blue-600">{job.applications_count}</td>
                      <td className="py-3 px-4">
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                          {job.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <Link
                          href={`/jobs/${job.slug}`}
                          className="text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="text-red-500 hover:text-red-700 font-semibold"
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
        )}

        {/* Tab 2: Candidate Applications */}
        {activeTab === 'applications' && (
          <div className="space-y-4">
            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between bg-white p-4 rounded-2xl border border-slate-200">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter candidate by name, job..."
                  value={searchCandidate}
                  onChange={(e) => setSearchCandidate(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 outline-hidden"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs p-1.5 rounded-xl border border-slate-300 bg-white"
              >
                <option value="">All Statuses</option>
                <option value="applied">Applied</option>
                <option value="in_review">In Review</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="selected">Selected</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {filteredApplications.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {filteredApplications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 text-sm">{app.full_name}</span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-600">{app.email}</span>
                        <span className="text-xs text-slate-600">({app.phone})</span>
                      </div>
                      <p className="text-xs font-medium text-blue-700 mt-1">
                        Applied for: <b>{app.job_listing?.title}</b>
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs text-slate-500 mt-2">
                        <span>Exp: {app.total_experience} Yrs</span>
                        <span>•</span>
                        <span>City: {app.current_city || 'N/A'}</span>
                        <span>•</span>
                        <span>Notice: {app.notice_period || 'Immediate'}</span>
                        <span>•</span>
                        <span>Expected CTC: {app.expected_ctc || 'Negotiable'}</span>
                      </div>
                      {app.cover_letter && (
                        <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl mt-2 max-w-2xl italic">
                          &ldquo;{app.cover_letter}&rdquo;
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                      {app.resume_url === 'AUTO_GENERATED_BIODATA' || (!app.resume_url && app.cover_letter) ? (
                        <button
                          type="button"
                          onClick={() => setSelectedBiodata(app)}
                          className="bg-orange-50 hover:bg-orange-100 text-orange-800 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1 border border-orange-200"
                        >
                          <FileText className="w-3.5 h-3.5 text-orange-600" />
                          <span>View Biodata</span>
                        </button>
                      ) : app.resume_url ? (
                        <a
                          href={app.resume_url.startsWith('http') ? app.resume_url : (app.resume_url.startsWith('/storage') ? `http://127.0.0.1:8000${app.resume_url}` : app.resume_url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1"
                        >
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                          <span>View Resume PDF</span>
                        </a>
                      ) : null}

                      <select
                        value={app.status}
                        onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border outline-hidden ${
                          app.status === 'shortlisted' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' :
                          app.status === 'rejected' ? 'bg-red-50 border-red-300 text-red-800' :
                          app.status === 'selected' ? 'bg-purple-50 border-purple-300 text-purple-800' :
                          'bg-white border-slate-300 text-slate-800'
                        }`}
                      >
                        <option value="applied">Applied</option>
                        <option value="in_review">In Review</option>
                        <option value="shortlisted">Shortlist Candidate</option>
                        <option value="selected">Hire / Select</option>
                        <option value="rejected">Reject</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">No applications match filter</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Biodata Viewer Modal */}
      {selectedBiodata && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900 text-base">{selectedBiodata.full_name}</h3>
                <p className="text-xs text-slate-500">Applicant Bio-Data • {selectedBiodata.phone}</p>
              </div>
              <button
                onClick={() => setSelectedBiodata(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-xs whitespace-pre-wrap text-slate-800 leading-relaxed">
              {selectedBiodata.cover_letter || 'No additional biodata details provided.'}
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => window.print()}
                className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-4 py-2 rounded-xl text-xs"
              >
                Print / Save PDF
              </button>
              <button
                onClick={() => setSelectedBiodata(null)}
                className="border border-slate-300 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
