import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";

import { WorkspacePage } from "./pages/WorkspacePage";
import { DiagnosticPage } from "./pages/DiagnosticPage";
import { GraphPage } from "./pages/GraphPage";
import { IngestPage } from "./pages/IngestPage";
import { SafetyCompliancePage } from "./pages/SafetyCompliancePage";
import { LandingPage } from "./pages/LandingPage";
import { Navbar } from "./components/Navbar";
import { CapacityFooter } from "./components/CapacityFooter";

// Helper component to scroll to top on route change
const ScrollToTopOnNavigate: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
};

// Layout wrapper for marketing & legacy diagnostic pages
const StandardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0B0D12] text-[#F5F7FF] flex flex-col font-sans selection:bg-[#8B5CF6]/30 selection:text-white">
      <Navbar />
      <main className="flex-1">{children}</main>
      <CapacityFooter />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTopOnNavigate />
      <Routes>
        {/* Primary AI Knowledge Workspace (NotebookLM 3-Panel Experience) */}
        <Route path="/" element={<WorkspacePage />} />
        <Route path="/workspace" element={<WorkspacePage />} />

        {/* Dedicated Industrial Hardware Diagnostics, Safety, and Graph Pages */}
        <Route
          path="/diagnostics"
          element={
            <StandardLayout>
              <DiagnosticPage />
            </StandardLayout>
          }
        />
        <Route
          path="/diagnose"
          element={
            <StandardLayout>
              <DiagnosticPage />
            </StandardLayout>
          }
        />
        <Route
          path="/graph"
          element={
            <StandardLayout>
              <GraphPage />
            </StandardLayout>
          }
        />
        <Route
          path="/ingest"
          element={
            <StandardLayout>
              <IngestPage />
            </StandardLayout>
          }
        />
        <Route
          path="/safety"
          element={
            <StandardLayout>
              <SafetyCompliancePage />
            </StandardLayout>
          }
        />
        <Route
          path="/landing"
          element={
            <StandardLayout>
              <LandingPage />
            </StandardLayout>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
