import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Problem from '@/components/Problem';
import Solution from '@/components/Solution';
import HowItWorks from '@/components/HowItWorks';
import ImageCarousel from '@/components/ImageCarousel';
import Features from '@/components/Features';
import Download from '@/components/Download';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div style={{ width: '100%', minHeight: '100vh', margin: 0, padding: 0 }}>
      <Header />
      <main style={{ width: '100%', paddingTop: '4rem' }}>{/* Header height offset */}
        <Hero />
        <section id="problem" style={{ width: '100%' }}><Problem /></section>
        <section id="solution" style={{ width: '100%' }}><Solution /></section>
        <HowItWorks />
        <ImageCarousel />
        <section id="features" style={{ width: '100%' }}><Features /></section>
        <Download />
      </main>
      <Footer />
    </div>
  );
}
