/**
 * Index — главная страница лендинга
 * Порядок секций: Navbar → Hero → About → Process → Services → WhyChoose → Testimonials → CTA → Footer
 */
import { lazy, Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { SectionSkeleton } from "@/components/ui/LoadingFallback";

// PERF: below-fold компоненты загружаются лениво для ускорения первого рендера
const About = lazy(() => import("@/components/About").then(m => ({ default: m.About })));
const Process = lazy(() => import("@/components/Process").then(m => ({ default: m.Process })));
const Services = lazy(() => import("@/components/Services").then(m => ({ default: m.Services })));
const WhyChoose = lazy(() => import("@/components/WhyChoose").then(m => ({ default: m.WhyChoose })));
const Testimonials = lazy(() => import("@/components/Testimonials").then(m => ({ default: m.Testimonials })));
const CTA = lazy(() => import("@/components/CTA").then(m => ({ default: m.CTA })));
const Footer = lazy(() => import("@/components/Footer").then(m => ({ default: m.Footer })));
const ScrollToTop = lazy(() => import("@/components/ScrollToTop").then(m => ({ default: m.ScrollToTop })));

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Suspense fallback={<SectionSkeleton />}>
        <About />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <Process />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <Services />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <WhyChoose />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <Testimonials />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <CTA />
      </Suspense>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
      <Suspense fallback={null}>
        <ScrollToTop />
      </Suspense>
    </div>
  );
};

export default Index;
