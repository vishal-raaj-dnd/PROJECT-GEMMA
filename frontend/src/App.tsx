import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";

import { ProcessingProvider } from "./context/ProcessingContext";
import { WorkspacePage } from "./pages/WorkspacePage";
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
      <ProcessingProvider>
        <ScrollToTopOnNavigate />
        <Routes>
          {/* Primary AI Knowledge Workspace (NotebookLM 3-Panel Experience) */}
          <Route path="/" element={<WorkspacePage />} />
          <Route path="/workspace" element={<WorkspacePage />} />

          {/* Dedicated Modern MECH-G Industrial Engineering Pages */}
          <Route path="/diagnostics" element={<DiagnosticPage />} />
          <Route path="/diagnose" element={<DiagnosticPage />} />
          <Route path="/graph" element={<GraphPage />} />
          <Route path="/ingest" element={<IngestPage />} />
          <Route path="/safety" element={<SafetyCompliancePage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ProcessingProvider>
    </BrowserRouter>
  );
}
