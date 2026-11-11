'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { JobApplication, JobListing, api } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { 
  User, 
  FileText, 
  Bookmark, 
  Send, 
  UploadCloud, 
  CheckCircle, 
  Clock, 
  Briefcase, 
  Edit3, 
  Save, 
  Loader2,
  ExternalLink
} from 'lucide-react';

export default function CandidateDashboardPage() {
  const { language, t } = useLanguage();
  const { user, loginAsCandidate, refreshUser } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'applications' | 'saved' | 'profile'>('applications');
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile Form
  const [headline, setHeadline] = useState(user?.headline || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [currentCity, setCurrentCity] = useState(user?.current_city || '');
  const [experienceYears, setExperienceYears] = useState(String(user?.experience_years ?? 0));
  const [bio, setBio] = useState(user?.bio || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setHeadline(user.headline || '');
      setPhone(user.phone || '');
      setCurrentCity(user.current_city || '');
      setExperienceYears(String(user.experience_years ?? 0));
      setBio(user.bio || '');
    }
  }, [user]);

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      try {
        setLoading(true);
        const [appsRes, savedRes] = await Promise.all([
          api.getCandidateApplications(),
          api.getCandidateSavedJobs(),
        ]);
        setApplications(appsRes.data || []);
        setSavedJobs(savedRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setMsg(null);
    try {
      await api.updateProfile({
        headline,
        phone,
        current_city: currentCity,
        experience_years: parseFloat(experienceYears) || 0,
        bio,
      });
      await refreshUser();
      setMsg('Profile updated successfully!');
      setTimeout(() => setMsg(null), 3000);
    } catch (err: any) {
      setMsg(err.message || 'Error updating profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingResume(true);
    setMsg(null);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const res = await api.uploadResume(formData);
      await refreshUser();
      setMsg(`Resume (${res.file_name}) uploaded successfully!`);
      setTimeout(() => setMsg(null), 3000);
    } catch (err: any) {
      setMsg(err.message || 'Failed to upload resume');
    } finally {
      setUploadingResume(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-slate-200 text-center shadow-lg">
          <User className="w-14 h-14 text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            {language === 'hi' ? 'कैंडिडेट लॉगिन आवश्यक है' : 'Candidate Sign In Required'}
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Sign in to access your applied vacancies, saved jobs, and upload your CV.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => loginAsCandidate()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs transition"
            >
              1-Click Demo Candidate Login (Rahul Sharma)
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'shortlisted':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full">🎉 Shortlisted</span>;
      case 'selected':
        return <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2.5 py-1 rounded-full">🏆 Hired / Selected</span>;
      case 'in_review':
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-1 rounded-full">👀 Under Review</span>;
      case 'rejected':
        return <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2.5 py-1 rounded-full">Not Selected</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-full">Applied</span>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-2xl flex items-center justify-center uppercase shadow-md">
              {user.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">{user.name}</h1>
              <p className="text-xs text-slate-500">{user.headline || 'Job Seeker'} • {user.email}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                  {user.experience_years ? `${user.experience_years} Yrs Exp` : 'Fresher'}
                </span>
                <span className="text-xs text-slate-400">📍 {user.current_city || 'India'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <label className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition flex items-center space-x-1.5 shadow-xs">
              <UploadCloud className="w-4 h-4 text-orange-400" />
              <span>{uploadingResume ? 'Uploading...' : 'Update Resume'}</span>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                disabled={uploadingResume}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {msg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-semibold text-emerald-800 flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>{msg}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex space-x-2 border-b border-slate-200 pb-px mb-6">
          <button
            onClick={() => setActiveTab('applications')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition flex items-center space-x-1.5 ${
              activeTab === 'applications'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>My Applications ({applications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition flex items-center space-x-1.5 ${
              activeTab === 'saved'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved Jobs ({savedJobs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition flex items-center space-x-1.5 ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile & CV</span>
          </button>
        </div>

        {/* Tab 1: Applications */}
        {activeTab === 'applications' && (
          <div className="space-y-4">
            {applications.length > 0 ? (
              applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/jobs/${app.job_listing?.slug}`}
                        className="text-base font-bold text-slate-900 hover:text-blue-600 transition"
                      >
                        {app.job_listing?.title}
                      </Link>
                      {getStatusBadge(app.status)}
                    </div>
                    <p className="text-xs text-slate-500">
                      {app.job_listing?.company_name} • Applied on {new Date(app.created_at).toLocaleDateString()}
                    </p>
                    {app.employer_notes && (
                      <p className="text-xs text-blue-700 bg-blue-50 p-2 rounded-lg mt-2">
                        <b>Recruiter Note:</b> {app.employer_notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <Link
                      href={`/jobs/${app.job_listing?.slug}`}
                      className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      View Vacancy
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <Send className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">You haven&apos;t applied to any jobs yet</p>
                <Link
                  href="/jobs"
                  className="inline-block mt-3 bg-blue-600 text-white font-bold px-4 py-2 rounded-xl text-xs"
                >
                  Browse Vacancies
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Saved Jobs */}
        {activeTab === 'saved' && (
          <div className="space-y-4">
            {savedJobs.length > 0 ? (
              savedJobs.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <Link
                      href={`/jobs/${item.job_listing?.slug}`}
                      className="text-base font-bold text-slate-900 hover:text-blue-600 transition"
                    >
                      {item.job_listing?.title}
                    </Link>
                    <p className="text-xs text-slate-500 mt-1">
                      {item.job_listing?.company_name} • {item.job_listing?.location_display}
                    </p>
                  </div>
                  <Link
                    href={`/jobs/${item.job_listing?.slug}`}
                    className="bg-blue-600 text-white font-bold px-4 py-2 rounded-xl text-xs text-center"
                  >
                    Apply Now
                  </Link>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <Bookmark className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">No saved jobs</p>
                <Link
                  href="/jobs"
                  className="inline-block mt-3 bg-blue-600 text-white font-bold px-4 py-2 rounded-xl text-xs"
                >
                  Explore Jobs
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Profile & Resume */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs max-w-2xl">
            <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              Candidate Profile Information
            </h2>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Headline</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Senior Laravel & Next.js Developer"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Current City</label>
                  <input
                    type="text"
                    value={currentCity}
                    onChange={(e) => setCurrentCity(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Years of Experience</label>
                <input
                  type="number"
                  step="0.5"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Professional Bio</label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Write a brief intro about your skills and goals..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-xs transition flex items-center space-x-1.5"
                >
                  {savingProfile && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
