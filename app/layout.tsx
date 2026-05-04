import type { Metadata } from 'next';
import { Poppins, Cairo } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { LanguageProvider } from '@/components/ui/LanguageProvider';
import TawkToChat from '@/components/ui/TawkToChat';

// LTR font — Poppins
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

// RTL font — Cairo (Arabic)
const cairo = Cairo({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-cairo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'El7a2ny Tutoring | Expert Tutoring for IGCSE, IB, American & More',
    template: '%s | El7a2ny Tutoring',
  },
  description:
    'El7a2ny offers expert, personalised tutoring across IGCSE, American Diploma, IB, National Systems and University subjects. Achieve top grades with our proven tutors.',
  keywords: ['IGCSE tutoring', 'IB tutoring', 'American Diploma', 'online tutoring', 'El7a2ny', 'university tutoring'],
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'El7a2ny Tutoring',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={`${poppins.variable} ${cairo.variable}`}>
      <body className="bg-white text-[#1B2A44] antialiased font-[var(--font-poppins)] [html[dir=rtl]_&]:font-[var(--font-cairo)]">
        <LanguageProvider>
          <div className="page-wrapper">
            <Navbar />
            <main className="flex-1 bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFC_55%,#FFFFFF_100%)]">{children}</main>
            <Footer />
          </div>
          <TawkToChat />
        </LanguageProvider>
      </body>
    </html>
  );
}

