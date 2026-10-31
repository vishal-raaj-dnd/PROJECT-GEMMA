import React, { useState } from "react";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { ProblemSolution } from "./components/ProblemSolution";
import { ArchitectureWorkflow } from "./components/ArchitectureWorkflow";
import { KnowledgeGraphPreview } from "./components/KnowledgeGraphPreview";
import { DiagnosticWorkbench } from "./components/DiagnosticWorkbench";
import { DocumentIngestionTab } from "./components/DocumentIngestionTab";
import { Footer } from "./components/Footer";

export default function App() {
  const [activeTab, setActiveTab] = useState<"workbench" | "knowledge">("workbench");

  const scrollToWorkbench = () => {
    const el = document.getElementById("workbench");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onScrollToWorkbench={scrollToWorkbench}
      />

      <main className="flex-1">
        {/* Section 1: Hero Banner & Narrative */}
        <HeroSection
          onExploreClick={scrollToWorkbench}
          onSampleClick={scrollToWorkbench}
        />

        {/* Section 2: Problem vs. Solution Bento Grid */}
        <ProblemSolution />

        {/* Section 3: Architecture Workflow Pipeline */}
        <ArchitectureWorkflow />

        {/* Section 4: Live Diagnostic Workbench (Where users try the model & test samples) */}
        <DiagnosticWorkbench />

        {/* Section 5: Local OKF Knowledge Graph Explorer */}
        <KnowledgeGraphPreview />

        {/* Section 6: Document Ingestion & OmniOKF Ingest Compiler */}
        <DocumentIngestionTab />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
