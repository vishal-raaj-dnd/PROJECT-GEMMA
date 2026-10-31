import React, { createContext, useContext, useState, ReactNode } from "react";
import { Sparkles, Flame } from "lucide-react";

interface ProcessingContextType {
  isProcessing: boolean;
  status: string;
  setProcessing: (active: boolean, statusText?: string) => void;
}

const ProcessingContext = createContext<ProcessingContextType>({
  isProcessing: false,
  status: "",
  setProcessing: () => {},
});

export const useProcessing = () => useContext(ProcessingContext);

export const ProcessingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("Gemma 4 is synthesizing grounded response...");

  const setProcessing = (active: boolean, statusText?: string) => {
    setIsProcessing(active);
    if (statusText) {
      setStatus(statusText);
    }
  };

  return (
    <ProcessingContext.Provider value={{ isProcessing, status, setProcessing }}>
      {children}
      <GlobalFlameBackground isProcessing={isProcessing} status={status} />
    </ProcessingContext.Provider>
  );
};

export const GlobalFlameBackground: React.FC<{ isProcessing: boolean; status: string }> = ({
  isProcessing,
  status,
}) => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* Base Subtle Ambient Vignette */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#0B0B0C]/40 to-[#0B0B0C]" />

      {/* Radiant AI Plasma Flame Orbs (Smoothly transitions between deep idle and radiant processing) */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
          isProcessing ? "opacity-100" : "opacity-25"
        }`}
      >
        {/* Core Electric Cyan Flame */}
        <div className="flame-orb-1 absolute -top-40 -left-40 w-[620px] h-[620px] rounded-full bg-gradient-to-tr from-[#06B6D4]/35 via-[#3B82F6]/30 to-transparent filter blur-[95px]" />

        {/* Deep Violet / Indigo Flame */}
        <div className="flame-orb-2 absolute -bottom-48 -right-40 w-[720px] h-[720px] rounded-full bg-gradient-to-bl from-[#8B5CF6]/30 via-[#6366F1]/25 to-transparent filter blur-[110px]" />

        {/* Amber / Fire Embers Core Tip */}
        <div className="flame-orb-3 absolute bottom-0 left-1/4 w-[540px] h-[540px] rounded-full bg-gradient-to-t from-[#F59E0B]/25 via-[#FB923C]/20 to-transparent filter blur-[85px]" />

        {/* Undulating Horizon Plasma Wave */}
        <div className="flame-wave-motion absolute -bottom-10 inset-x-0 h-72 bg-gradient-to-t from-[#22D3EE]/15 via-[#8B5CF6]/10 to-transparent filter blur-[70px]" />

        {/* Rising Particle Embers when Processing */}
        {isProcessing && (
          <div className="absolute inset-0 overflow-hidden">
            <span
              className="absolute bottom-12 left-1/4 w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-md shadow-cyan-400"
              style={{ animation: "ember-rise 4.2s ease-out infinite", animationDelay: "0.2s" }}
            />
            <span
              className="absolute bottom-16 left-1/3 w-2 h-2 rounded-full bg-amber-400 shadow-md shadow-amber-500"
              style={{ animation: "ember-rise 5.1s ease-out infinite", animationDelay: "1.4s" }}
            />
            <span
              className="absolute bottom-10 left-1/2 w-1.5 h-1.5 rounded-full bg-purple-400 shadow-md shadow-purple-500"
              style={{ animation: "ember-rise 4.7s ease-out infinite", animationDelay: "0.8s" }}
            />
            <span
              className="absolute bottom-14 left-2/3 w-2 h-2 rounded-full bg-cyan-400 shadow-md shadow-cyan-400"
              style={{ animation: "ember-rise 5.5s ease-out infinite", animationDelay: "2.1s" }}
            />
            <span
              className="absolute bottom-8 left-3/4 w-1.5 h-1.5 rounded-full bg-amber-300 shadow-md shadow-amber-400"
              style={{ animation: "ember-rise 4.9s ease-out infinite", animationDelay: "1.7s" }}
            />
          </div>
        )}
      </div>

      {/* Floating Modern AI Processing Capsule Pill */}
      {isProcessing && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#18181A]/90 backdrop-blur-xl border border-[#22D3EE]/40 shadow-2xl shadow-cyan-500/20 text-xs font-medium text-white">
            <div className="relative flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping absolute" />
              <span className="w-2 h-2 rounded-full bg-cyan-400 relative" />
            </div>
            <span className="font-semibold tracking-tight text-white font-heading">{status}</span>
            <Sparkles className="w-3.5 h-3.5 text-[#22D3EE] animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
};
