import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'Naukarix - All India Job Portal | Sarkari Naukri & Private Jobs 2026',
  description: 'Search & Apply for 1,45,000+ Latest Government Jobs (Sarkari Naukri), Private Jobs, Fresher Vacancies, Work From Home, and State-wise recruitments across India with official notification PDFs and direct apply links.',
  keywords: [
    'Naukarix',
    'Sarkari Naukri 2026',
    'All India Jobs',
    'Govt Jobs',
    'Private Jobs in India',
    'Work From Home Jobs',
    'Fresher Jobs',
    'SSC CGL',
    'Railway Recruitment',
    'Bank PO Jobs',
    'Police Bharti',
    'UP Jobs',
    'Bihar Jobs',
    'Next.js Jobs'
  ],
  authors: [{ name: 'Naukarix Team' }],
  creator: 'Naukarix',
  publisher: 'Naukarix India',
  metadataBase: new URL('https://naukarix.in'),
  openGraph: {
    title: 'Naukarix - India’s Premier Govt & Private Job Portal',
    description: 'Find official Sarkari Naukri, IT jobs, Remote Careers, and State recruitments with instant alerts.',
    url: 'https://naukarix.in',
    siteName: 'Naukarix',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Naukarix - All India Job Portal',
    description: 'Search & Apply for Government, Private, Fresher, and Work from Home jobs.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0f172a" />
        {/* Core Web Vitals: Preload critical fonts for fast LCP & zero FOIT */}
        <link
          rel="preload"
          href="/fonts/poppins-bold.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/poppins-regular.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-orange-500 selection:text-white">
        {/* WCAG 2.4.1: Bypass Blocks (Skip to Main Content) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-blue-600 focus:text-white focus:rounded-xl focus:shadow-xl focus:font-bold focus:ring-4 focus:ring-blue-300 transition"
        >
          मुख्य सामग्री पर जाएं (Skip to main content)
        </a>
        <LanguageProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
