import { displayFont, sansFont } from "@/lib/fonts";
import LandingHeader from "@/components/landing/LandingHeader";
import Hero from "@/components/landing/Hero";
import ProblemSection from "@/components/landing/ProblemSection";
import HowItWorks from "@/components/landing/HowItWorks";
import FeatureGrid from "@/components/landing/FeatureGrid";
import FinalCta from "@/components/landing/FinalCta";
import LandingFooter from "@/components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <div className={`${displayFont.variable} ${sansFont.variable} bg-[#f4f8f7] font-sans`}>
      <LandingHeader />
      <main>
        <Hero />
        <ProblemSection />
        <HowItWorks />
        <FeatureGrid />
        <FinalCta />
      </main>
      <LandingFooter />
    </div>
  );
}
