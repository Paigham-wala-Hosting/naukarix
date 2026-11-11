// API Client for Naukarix

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'candidate' | 'employer' | 'admin';
  phone?: string;
  headline?: string;
  bio?: string;
  experience_years?: number;
  skills?: string[] | string;
  education?: string;
  current_city?: string;
  state?: string;
  resume_path?: string;
  company_name?: string;
  company_website?: string;
  company_logo?: string;
  company_description?: string;
  is_active: boolean;
  applications_count?: number;
  saved_jobs_count?: number;
  job_listings_count?: number;
}

export interface Category {
  id: number;
  name_en: string;
  name_hi: string;
  slug: string;
  icon: string;
  is_govt: boolean;
  job_count: number;
}

export interface StateItem {
  id: number;
  name_en: string;
  name_hi: string;
  code: string;
  slug: string;
  is_active: boolean;
  job_listings_count?: number;
}

export interface PricingPlan {
  id: number;
  name: string;
  name_hi?: string;
  slug: string;
  price: number;
  billing_period: string;
  job_post_limit: number;
  duration_days: number;
  is_featured_badge: boolean;
  applicant_contact_access: boolean;
  instant_alerts_to_candidates: boolean;
  social_media_promotion: boolean;
  is_popular: boolean;
  features?: string[];
}

export interface JobListing {
  id: number;
  user_id?: number;
  title: string;
  title_hi?: string;
  slug: string;
  sector: 'government' | 'private';
  job_type: 'full-time' | 'part-time' | 'contract' | 'internship';
  work_mode: 'on-site' | 'remote' | 'hybrid';
  is_fresher: boolean;
  category_id?: number;
  state_id?: number;
  city?: string;
  location_display: string;
  company_name: string;
  company_logo?: string;
  company_website?: string;
  min_salary?: number;
  max_salary?: number;
  salary_type: 'per_month' | 'per_annum';
  salary_currency: string;
  is_salary_disclosed: boolean;
  min_experience: number;
  max_experience: number;
  education_required?: string;
  qualification_level?: '8th_pass' | '10th_pass' | '12th_pass' | 'any_graduate' | 'none';
  vacancies_count: number;
  contact_phone?: string;
  whatsapp_number?: string;
  benefits_included?: string;
  shift_timing?: string;
  description: string;
  description_hi?: string;
  skills_required?: string[] | string;
  responsibilities?: string;
  eligibility_criteria?: string;
  application_fee_details?: string;
  selection_process?: string;
  application_start_date?: string;
  application_deadline?: string;
  official_notification_url?: string;
  official_apply_url?: string;
  is_featured: boolean;
  is_urgent: boolean;
  is_verified: boolean;
  status: 'active' | 'pending_approval' | 'expired' | 'closed';
  views_count: number;
  applications_count: number;
  created_at: string;
  category?: Category;
  state?: StateItem;
}

export interface JobApplication {
  id: number;
  job_listing_id: number;
  user_id?: number;
  full_name: string;
  email: string;
  phone: string;
  current_city?: string;
  total_experience: number;
  current_ctc?: string;
  expected_ctc?: string;
  notice_period?: string;
  resume_url?: string;
  cover_letter?: string;
  status: 'applied' | 'in_review' | 'shortlisted' | 'rejected' | 'selected';
  employer_notes?: string;
  created_at: string;
  job_listing?: JobListing;
  user?: User;
}

export interface Transaction {
  id: number;
  user_id: number;
  pricing_plan_id: number;
  amount: number;
  currency: string;
  payment_method: string;
  transaction_id: string;
  order_id?: string;
  payment_status: 'pending' | 'completed' | 'failed';
  invoice_number: string;
  created_at: string;
  user?: User;
  pricing_plan?: PricingPlan;
}

// Request helper with automatic Bearer token injection
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('naukarix_token') : null;
  
  const headers = new Headers(options.headers || {});
  headers.set('Accept', 'application/json');
  
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || (data.errors ? Object.values(data.errors).flat().join(', ') : 'Request failed'));
  }
  return data;
}

export const api = {
  // Auth
  register: (payload: any) => request<{ success: boolean; user: User; token: string }>('/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  login: (payload: any) => request<{ success: boolean; user: User; token: string }>('/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  me: () => request<{ success: boolean; user: User }>('/me'),
  updateProfile: (payload: any) => request<{ success: boolean; user: User }>('/profile', {
    method: 'PUT',
    body: JSON.stringify(payload),
  }),
  uploadResume: (formData: FormData) => request<{ success: boolean; resume_url: string; file_name: string }>('/upload-resume', {
    method: 'POST',
    body: formData,
  }),
  logout: () => request<{ success: boolean }>('/logout', { method: 'POST' }),

  // Meta
  getCategories: () => request<{ success: boolean; data: Category[] }>('/categories'),
  getStates: () => request<{ success: boolean; data: StateItem[] }>('/states'),
  getPricingPlans: () => request<{ success: boolean; data: PricingPlan[] }>('/pricing-plans'),

  // Jobs
  getJobs: (params?: Record<string, any>) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          searchParams.append(key, String(val));
        }
      });
    }
    const query = searchParams.toString();
    return request<{ success: boolean; data: JobListing[]; meta: any }>(`/jobs${query ? `?${query}` : ''}`);
  },
  getFeaturedJobs: () => request<{ success: boolean; data: JobListing[] }>('/jobs/featured'),
  getJobDetails: (slug: string) => request<{ success: boolean; job: JobListing; related: JobListing[]; schema_json_ld: any }>(`/jobs/${slug}`),
  postJob: (payload: any) => request<{ success: boolean; job: JobListing }>('/jobs', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  updateJob: (id: number, payload: any) => request<{ success: boolean; job: JobListing }>(`/jobs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  }),
  deleteJob: (id: number) => request<{ success: boolean }>(`/jobs/${id}`, {
    method: 'DELETE',
  }),

  // Applications & Saves
  applyJob: (id: number, payload: any) => {
    let body: any;
    if (payload instanceof FormData) {
      body = payload;
    } else {
      body = JSON.stringify(payload);
    }
    return request<{ success: boolean; message: string; application: JobApplication }>(`/jobs/${id}/apply`, {
      method: 'POST',
      body,
    });
  },
  toggleSaveJob: (id: number) => request<{ success: boolean; is_saved: boolean; message: string }>(`/jobs/${id}/save`, {
    method: 'POST',
  }),
  getCandidateApplications: () => request<{ success: boolean; data: JobApplication[] }>('/candidate/applications'),
  getCandidateSavedJobs: () => request<{ success: boolean; data: any[] }>('/candidate/saved-jobs'),
  getEmployerJobs: () => request<{ success: boolean; data: JobListing[]; meta: any }>('/employer/jobs'),
  getEmployerApplications: (params?: any) => {
    const searchParams = new URLSearchParams(params);
    return request<{ success: boolean; data: JobApplication[]; meta: any }>(`/employer/applications?${searchParams.toString()}`);
  },
  updateApplicationStatus: (id: number, status: string, notes?: string) => request<{ success: boolean; application: JobApplication }>(`/employer/applications/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status, employer_notes: notes }),
  }),

  // Alerts
  subscribeJobAlert: (payload: any) => request<{ success: boolean; message: string }>('/job-alerts', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),

  // Payments / Paid Job Posting
  createCheckoutOrder: (planId: number) => request<{ success: boolean; order: any }>('/checkout/create-order', {
    method: 'POST',
    body: JSON.stringify({ plan_id: planId }),
  }),
  verifyPayment: (payload: any) => request<{ success: boolean; message: string; transaction: Transaction }>('/checkout/verify', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),

  // Admin
  getAdminStats: () => request<{ success: boolean; stats: any; recent_applications: JobApplication[]; recent_jobs: JobListing[] }>('/admin/stats'),
  getAdminJobs: (params?: any) => request<{ success: boolean; data: JobListing[]; meta: any }>(`/admin/jobs?${new URLSearchParams(params).toString()}`),
  updateAdminJobStatus: (id: number, payload: any) => request<{ success: boolean; job: JobListing }>(`/admin/jobs/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  }),
  getAdminUsers: (params?: any) => request<{ success: boolean; data: User[]; meta: any }>(`/admin/users?${new URLSearchParams(params).toString()}`),
  toggleAdminUserStatus: (id: number) => request<{ success: boolean; message: string; user: User }>(`/admin/users/${id}/toggle-status`, {
    method: 'PUT',
  }),
  getAdminTransactions: () => request<{ success: boolean; data: Transaction[]; meta: any }>('/admin/transactions'),
  getAdminCategories: () => request<{ success: boolean; data: Category[] }>('/admin/categories'),
  createAdminCategory: (payload: Partial<Category>) => request<{ success: boolean; message: string; category: Category }>('/admin/categories', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  updateAdminCategory: (id: number, payload: Partial<Category>) => request<{ success: boolean; message: string; category: Category }>(`/admin/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  }),
  deleteAdminCategory: (id: number) => request<{ success: boolean; message: string }>(`/admin/categories/${id}`, {
    method: 'DELETE',
  }),
};
