import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { CapacityFooter } from "./components/CapacityFooter";
import { LandingPage } from "./pages/LandingPage";
import { DiagnosticPage } from "./pages/DiagnosticPage";
import { GraphPage } from "./pages/GraphPage";
import { IngestPage } from "./pages/IngestPage";
import { SafetyCompliancePage } from "./pages/SafetyCompliancePage";

// Helper component to scroll to top on route change
const ScrollToTopOnNavigate: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
};

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTopOnNavigate />
      <div className="min-h-screen bg-[#0B0B0E] text-[#F5F5F7] flex flex-col font-sans selection:bg-[#FF6B35]/30 selection:text-white">
        {/* Sticky Top Nav matching Capacity specification */}
        <Navbar />

        {/* Multi-Page Routes */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/diagnose" element={<DiagnosticPage />} />
            <Route path="/graph" element={<GraphPage />} />
            <Route path="/ingest" element={<IngestPage />} />
            <Route path="/safety" element={<SafetyCompliancePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Multi-column Capacity Footer */}
        <CapacityFooter />
      </div>
    </BrowserRouter>
  );
}
