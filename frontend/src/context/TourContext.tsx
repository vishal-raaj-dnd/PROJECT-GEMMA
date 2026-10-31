import React, { createContext, useContext, useState, useEffect } from "react";

export interface TourStep {
  id: string;
  target: string;
  title: string;
  description: string;
  placement?: "top" | "bottom" | "left" | "right" | "center";
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: "welcome",
    target: "body",
    title: "Welcome to MECH-G",
    description: "Your domain-aware AI engineering workspace for equipment manuals, fault diagnosis, and safety compliance.",
    placement: "center"
  },
  {
    id: "sources",
    target: '[data-tour="sources"]',
    title: "Document Knowledge Base",
    description: "Upload OEM manuals (PDF, DOCX, Markdown). Select or unselect sources to isolate grounded technical context.",
    placement: "right"
  },
  {
    id: "chat",
    target: '[data-tour="chat"]',
    title: "Citation-Grounded Assistant",
    description: "Ask engineering questions, troubleshoot failures, and generate interactive workflow diagrams with strict citations.",
    placement: "top"
  },
  {
    id: "graph",
    target: '[data-tour="graph"]',
    title: "Live Knowledge Graph",
    description: "Inspect subsystem hierarchies, part cross-references, and safety dependencies extracted into an interactive graph.",
    placement: "left"
  },
  {
    id: "diagnostics",
    target: '[data-tour="nav-diagnostics"]',
    title: "Multimodal Diagnostics",
    description: "Input fault codes, sensor telemetry, and upload inspection photos for AI-powered root-cause analysis.",
    placement: "bottom"
  },
  {
    id: "safety",
    target: '[data-tour="nav-safety"]',
    title: "Safety Compliance & LOTO",
    description: "Simulate Lockout/Tagout procedures step-by-step to verify zero-energy states before physical maintenance.",
    placement: "bottom"
  }
];

interface TourContextType {
  isActive: boolean;
  currentStepIndex: number;
  currentStep: TourStep;
  totalSteps: number;
  startTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
}

const TourContext = createContext<TourContextType | null>(null);

const STORAGE_KEY = "mechg_tour_completed";

export const TourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  useEffect(() => {
    const hasCompleted = localStorage.getItem(STORAGE_KEY);
    if (!hasCompleted) {
      // Auto-start for first-time visitors after short initial paint delay
      const timer = setTimeout(() => {
        setIsActive(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const startTour = () => {
    setCurrentStepIndex(0);
    setIsActive(true);
  };

  const nextStep = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      skipTour();
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const skipTour = () => {
    setIsActive(false);
    localStorage.setItem(STORAGE_KEY, "true");
  };

  const currentStep = TOUR_STEPS[currentStepIndex];

  return (
    <TourContext.Provider
      value={{
        isActive,
        currentStepIndex,
        currentStep,
        totalSteps: TOUR_STEPS.length,
        startTour,
        nextStep,
        prevStep,
        skipTour
      }}
    >
      {children}
    </TourContext.Provider>
  );
};

export const useTour = (): TourContextType => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error("useTour must be used within a TourProvider");
  }
  return context;
};
