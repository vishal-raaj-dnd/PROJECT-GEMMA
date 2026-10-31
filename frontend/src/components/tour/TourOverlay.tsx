import React, { useEffect, useState, useRef } from "react";
import { useTour } from "../../context/TourContext";
import { ChevronRight, ChevronLeft, X, Sparkles, Check } from "lucide-react";

export const TourOverlay: React.FC = () => {
  const { isActive, currentStep, currentStepIndex, totalSteps, nextStep, prevStep, skipTour } = useTour();
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;

    const updatePosition = () => {
      if (!currentStep || currentStep.target === "body") {
        setTargetRect(null);
        // Center position
        const top = Math.max(window.innerHeight / 2 - 140, 40);
        const left = Math.max(window.innerWidth / 2 - 180, 20);
        setTooltipPos({ top, left });
        return;
      }

      const el = document.querySelector(currentStep.target);
      if (el) {
        const rect = el.getBoundingClientRect();
        setTargetRect(rect);

        // Calculate tooltip placement
        const padding = 16;
        const tooltipWidth = 360;
        const tooltipHeight = 200;

        let top = rect.bottom + padding;
        let left = rect.left + rect.width / 2 - tooltipWidth / 2;

        if (currentStep.placement === "right") {
          left = rect.right + padding;
          top = rect.top + rect.height / 2 - tooltipHeight / 2;
        } else if (currentStep.placement === "left") {
          left = rect.left - tooltipWidth - padding;
          top = rect.top + rect.height / 2 - tooltipHeight / 2;
        } else if (currentStep.placement === "top") {
          top = rect.top - tooltipHeight - padding;
          left = rect.left + rect.width / 2 - tooltipWidth / 2;
        } else if (currentStep.placement === "bottom") {
          top = rect.bottom + padding;
          left = rect.left + rect.width / 2 - tooltipWidth / 2;
        }

        // Clamp inside window viewport
        left = Math.max(16, Math.min(window.innerWidth - tooltipWidth - 16, left));
        top = Math.max(16, Math.min(window.innerHeight - tooltipHeight - 16, top));

        setTooltipPos({ top, left });
      } else {
        // Fallback to center if element not currently in DOM
        setTargetRect(null);
        setTooltipPos({
          top: Math.max(window.innerHeight / 2 - 140, 40),
          left: Math.max(window.innerWidth / 2 - 180, 20)
        });
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isActive, currentStep]);

  if (!isActive) return null;

  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === totalSteps - 1;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-auto">
      {/* Target Element Spotlight Cutout */}
      {targetRect && (
        <div
          className="fixed transition-all duration-300 ease-out rounded-2xl pointer-events-none"
          style={{
            top: targetRect.top - 6,
            left: targetRect.left - 6,
            width: targetRect.width + 12,
            height: targetRect.height + 12,
            boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.65), 0 0 24px rgba(34, 211, 238, 0.4)",
            border: "1.5px solid rgba(34, 211, 238, 0.8)",
          }}
        />
      )}

      {/* Backdrop when in center/welcome mode */}
      {!targetRect && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-[2px] transition-opacity duration-300" />
      )}

      {/* Floating Tooltip Card */}
      <div
        ref={tooltipRef}
        className="fixed w-[360px] bg-[#141519] border border-[#2B2D35] rounded-[22px] shadow-2xl p-5 text-white transition-all duration-300 ease-out z-[101]"
        style={{
          top: `${tooltipPos.top}px`,
          left: `${tooltipPos.left}px`,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#22D3EE]/15 border border-[#22D3EE]/30 flex items-center justify-center text-[#22D3EE]">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-mono font-semibold text-[#22D3EE] uppercase tracking-wider">
              Step {currentStepIndex + 1} of {totalSteps}
            </span>
          </div>

          <button
            onClick={skipTour}
            className="p-1 rounded-full text-[#9CA3AF] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close walkthrough"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title & Body */}
        <h3 className="text-base font-semibold text-white tracking-tight mb-1.5 font-heading">
          {currentStep.title}
        </h3>
        <p className="text-xs text-[#9CA3AF] leading-relaxed mb-4">
          {currentStep.description}
        </p>

        {/* Step Indicator dots */}
        <div className="flex items-center justify-between pt-3 border-t border-[#232326]">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  idx === currentStepIndex
                    ? "w-5 bg-[#22D3EE]"
                    : "w-1.5 bg-[#2B2D35]"
                }`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                onClick={prevStep}
                className="px-2.5 py-1 rounded-full text-xs font-medium text-[#9CA3AF] hover:text-white hover:bg-[#232326] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            <button
              onClick={nextStep}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#22D3EE] text-black hover:bg-[#06B6D4] transition-colors flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              <span>{isLast ? "Get Started" : "Next"}</span>
              {isLast ? <Check className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
