/*
 * COOKIE CHAIN — HOME PAGE
 * Design: "Dark Forge" — Solana-inspired deep black + amber/mint/purple
 * Sections: Hero → Tokenomics → Performance → Bridge → Governance → Ecosystem → Roadmap → Footer
 */

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import Tokenomics from "@/components/sections/Tokenomics";
import Performance from "@/components/sections/Performance";
import Bridge from "@/components/sections/Bridge";
import Governance from "@/components/sections/Governance";
import Ecosystem from "@/components/sections/Ecosystem";
import Roadmap from "@/components/sections/Roadmap";
import LiveChainStats from "@/components/sections/LiveChainStats";
import ValidatorMap from "@/components/sections/ValidatorMap";

export default function Home() {
  return (
    <div style={{ background: "var(--cook-bg)", minHeight: "100vh", transition: "background 0.3s ease" }}>
      <Nav />
      <Hero />
      <LiveChainStats />
      <Tokenomics />
      <Performance />
      <Bridge />
      <Governance />
      <ValidatorMap />
      <Ecosystem />
      <Roadmap />
      <Footer />
    </div>
  );
}
