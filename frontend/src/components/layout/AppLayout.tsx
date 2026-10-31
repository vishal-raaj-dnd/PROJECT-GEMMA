import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";
import { CreateNotebookModal } from "../modals/CreateNotebookModal";
import { GlobalSearchModal } from "../modals/GlobalSearchModal";
import { useMecG } from "../../context/MecGContext";
import { CheckCircle2 } from "lucide-react";

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { toastMessage } = useMecG();

  return (
    <div className="min-h-screen bg-[#101318] text-[#F3F4F6] flex font-sans selection:bg-[#F2B544]/30 selection:text-white">
      {/* Persistent Left Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Wrapper */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          sidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        {/* Top Navigation Bar */}
        <TopNavbar sidebarCollapsed={sidebarCollapsed} />

        {/* Page Content Viewport */}
        <main className="flex-1 mt-16 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Global Modals */}
      <CreateNotebookModal />
      <GlobalSearchModal />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#171A21] border border-[#F2B544]/60 text-white shadow-2xl shadow-black/60 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#F2B544] shrink-0" />
          <span className="text-xs font-mono font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

