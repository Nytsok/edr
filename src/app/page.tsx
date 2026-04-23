import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Statement } from "@/components/Statement";
import { Experience } from "@/components/Experience";
import { Audiences } from "@/components/Audiences";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { Differentiation } from "@/components/Differentiation";
import { SocialProof } from "@/components/SocialProof";
import { Waitlist } from "@/components/Waitlist";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <Statement />
        <Experience />
        <Audiences />
        <Features />
        <HowItWorks />
        <Differentiation />
        <SocialProof />
        <Waitlist />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
