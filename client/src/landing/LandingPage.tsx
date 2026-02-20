import { LandingNavbar } from './components/LandingNavbar';
import { Hero } from './components/Hero';
import ProductShowcase from './components/ProductShowcase';
import { ProblemRelief } from './components/ProblemRelief';
import { Capabilities } from './components/Capabilities';
import { TrustSecurity } from './components/TrustSecurity';
import { HowItWorks } from './components/HowItWorks';
import { FinalCTA } from './components/FinalCTA';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SEO } from './SEO';
import { StructuredData } from './StructuredData';

export const LandingPage = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [hash]);

  return (
    <div className='min-h-screen bg-slate-950 text-white font-sans selection:bg-emerald-500/30 overflow-x-hidden'>
      <SEO />
      <StructuredData />
      <LandingNavbar />

      <main className='relative z-10 w-full'>
        <Hero />
        <ProductShowcase />
        <ProblemRelief />
        <Capabilities />
        <TrustSecurity />
        <HowItWorks />
        <FinalCTA />
        <FAQ />
      </main>

      <Footer />
    </div>
  );
};
