import React from "react";
import { HeroSection } from "../components/HeroSection";
import { ProductMockupBand } from "../components/ProductMockupBand";
import { IndustryStrip } from "../components/IndustryStrip";
import { FeatureGrid } from "../components/FeatureGrid";
import { AlternatingFeatureRows } from "../components/AlternatingFeatureRows";
import { MetricsHighlightBand } from "../components/MetricsHighlightBand";
import { TestimonialBand } from "../components/TestimonialBand";
import { FAQSection } from "../components/FAQSection";
import { FinalCTASection } from "../components/FinalCTASection";

export const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col bg-[#060B18]">
      {/* 1. Hero Section with Dribbble-inspired blue atmosphere */}
      <HeroSection />

      {/* 2. Framed Product Mockup Band overlapping under Hero */}
      <ProductMockupBand />

      {/* 3. Quiet Monochrome Industry Logo Strip */}
      <IndustryStrip />

      {/* 4. 3x2 Outlined Architecture Feature Grid */}
      <FeatureGrid />

      {/* 5. Zig-Zag Alternating Feature Rows */}
      <AlternatingFeatureRows />

      {/* 6. Verified Operational Specifications Highlight Band */}
      <MetricsHighlightBand />

      {/* 7. Industrial Reliability Testimonials */}
      <TestimonialBand />

      {/* 8. Technical FAQ Accordion */}
      <FAQSection />

      {/* 9. Final Centered Call-to-Action with Radial Glow */}
      <FinalCTASection />
    </div>
  );
};

