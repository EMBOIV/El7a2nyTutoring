// Home page — server component (SSG by default in Next.js App Router)
// Heavy client components are dynamically imported to reduce initial JS bundle
import dynamic from 'next/dynamic';
import Hero from '@/components/home/Hero';
import Stats from '@/components/home/Stats';
import Features from '@/components/home/Features';
import HowItWorks from '@/components/home/HowItWorks';
import CTASection from '@/components/home/CTASection';

// Dynamic imports with loading skeletons — code split per section
const SubjectsPreview = dynamic(() => import('@/components/home/SubjectsPreview'), {
  loading: () => <div className="h-96 skeleton rounded-2xl mx-4" />,
});

const Testimonials = dynamic(() => import('@/components/home/Testimonials'), {
  loading: () => <div className="h-64 skeleton rounded-2xl mx-4" />,
});

export const metadata = {
  title: 'Expert Tutoring for IGCSE, IB, American & More | El7a2ny',
  description: 'El7a2ny offers expert, personalised tutoring for IGCSE, IB, American Diploma, National Systems, University Subjects, and Project Assistance. Achieve top grades with our proven tutors.'
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <Features />
      <SubjectsPreview />
      <HowItWorks />
      <Testimonials />
      <CTASection />
    </>
  );
}
