import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { MecGProvider } from "./context/MecGContext";
import { AppLayout } from "./components/layout/AppLayout";

// MEC-G Complete Page Modules
import { OverviewDashboard } from "./pages/OverviewDashboard";
import { NotebooksPage } from "./pages/NotebooksPage";
import { NotebookWorkspacePage } from "./pages/NotebookWorkspacePage";
import { DiagnosePage } from "./pages/DiagnosePage";
import { KnowledgeLibraryPage } from "./pages/KnowledgeLibraryPage";
import { KnowledgeGraphPage } from "./pages/KnowledgeGraphPage";
import { SearchDocumentsPage } from "./pages/SearchDocumentsPage";
import { DiagnosticHistoryPage } from "./pages/DiagnosticHistoryPage";
import { SafetyCompliancePage } from "./pages/SafetyCompliancePage";
import { AuditTrailPage } from "./pages/AuditTrailPage";
import { SettingsPage } from "./pages/SettingsPage";
import { HelpSupportPage } from "./pages/HelpSupportPage";

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
    <MecGProvider>
      <BrowserRouter>
        <ScrollToTopOnNavigate />
        <AppLayout>
          <Routes>
            {/* WORKSPACE */}
            <Route path="/" element={<OverviewDashboard />} />
            <Route path="/notebooks" element={<NotebooksPage />} />
            <Route path="/notebooks/:id" element={<NotebookWorkspacePage />} />
            <Route path="/diagnose" element={<DiagnosePage />} />

            {/* KNOWLEDGE */}
            <Route path="/library" element={<KnowledgeLibraryPage />} />
            <Route path="/graph" element={<KnowledgeGraphPage />} />
            <Route path="/search" element={<SearchDocumentsPage />} />

            {/* OPERATIONS */}
            <Route path="/history" element={<DiagnosticHistoryPage />} />
            <Route path="/safety" element={<SafetyCompliancePage />} />
            <Route path="/audit" element={<AuditTrailPage />} />

            {/* SYSTEM */}
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/help" element={<HelpSupportPage />} />

            {/* BACKWARD COMPATIBILITY ALIASES */}
            <Route path="/ingest" element={<Navigate to="/library" replace />} />

            {/* CATCH-ALL REDIRECT */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </MecGProvider>
  );
}
