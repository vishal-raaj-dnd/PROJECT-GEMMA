import React from "react";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { ProblemSolution } from "./components/ProblemSolution";
import { ArchitectureWorkflow } from "./components/ArchitectureWorkflow";
import { DiagnosticWorkbench } from "./components/DiagnosticWorkbench";
import { KnowledgeGraphPreview } from "./components/KnowledgeGraphPreview";
import { DocumentIngestionTab } from "./components/DocumentIngestionTab";
import { FAQSection } from "./components/FAQSection";
import { Footer } from "./components/Footer";

export default function App() {
  const scrollToWorkbench = () => {
    const el = document.getElementById("workbench");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToDocs = () => {
    const el = document.getElementById("documents");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToFAQ = () => {
    const el = document.getElementById("faq");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white flex flex-col font-sans selection:bg-[#6C4CF1]/40 selection:text-white">
      {/* 1. Header: Slim bar with tiny logo + wordmark and right links */}
      <Navbar
        onScrollToWorkbench={scrollToWorkbench}
        onScrollToDocs={scrollToDocs}
      />

      <main className="flex-1">
        {/* 2. Hero: Centred single column, massive headline with inline icon, pill input, mascot cropped by fold, 4 orbiting badges */}
        <HeroSection onScrollToWorkbench={scrollToWorkbench} />

        {/* 3. The Frontline Problem vs OKF Solution */}
        <ProblemSolution />

        {/* 4. Architecture Workflow Pipeline (4 steps) */}
        <ArchitectureWorkflow />

        {/* 5. Live Diagnostic Workbench (Where users actually try the model & check results) */}
        <DiagnosticWorkbench />

        {/* 6. In-Memory Knowledge Graph Preview & Mermaid Flowchart */}
        <KnowledgeGraphPreview />

        {/* 7. Document Ingestion: Try sample OEM manuals & compile to OKF */}
        <DocumentIngestionTab />

        {/* 8. FAQ Section: 2-column layout with circular accent buttons (+/-) */}
        <FAQSection />
      </main>

      {/* 9. Footer & Signature Close: Giant GEMMAOPS wordmark ~20vw on purple radial glow */}
      <Footer
        onScrollToTop={scrollToTop}
        onScrollToWorkbench={scrollToWorkbench}
        onScrollToFAQ={scrollToFAQ}
      />
    </div>
  );
}
