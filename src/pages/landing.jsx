import Hero from "../components/Hero";
import Features from "../components/feature";
import HowItWorks from "../components/howItworks";
import CTA from "../components/CTA";
import Footer from "../components/footer";

export default function Landing() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </>
  );
}