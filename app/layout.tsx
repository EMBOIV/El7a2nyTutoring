import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ChatWidget from '@/components/ui/ChatWidget';

// next/font: fonts are loaded at build time — zero CLS, zero FOUT
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap', // performance: show fallback font immediately
});

export const metadata: Metadata = {
  title: {
    default: 'El7a2ny Tutoring | Expert IGCSE Tutoring',
    template: '%s | El7a2ny Tutoring',
  },
  description:
    'El7a2ny offers expert, personalised IGCSE tutoring across all core subjects. Achieve top grades with our proven tutors.',
  keywords: ['IGCSE tutoring', 'IGCSE maths', 'IGCSE science', 'online tutoring', 'El7a2ny'],
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'El7a2ny Tutoring',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="bg-white text-[#1B2A44] antialiased">
        <div className="page-wrapper">
          <Navbar />
          <main className="flex-1 bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFC_55%,#FFFFFF_100%)]">{children}</main>
          <Footer />
        </div>
        {/* Chatbot widget — loaded lazily */}
        <ChatWidget />
      </body>
    </html>
  );
}
