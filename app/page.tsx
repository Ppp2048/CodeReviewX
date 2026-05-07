import { FeatureGrid } from "@/components/landing/feature-grid";
import { Hero } from "@/components/landing/hero";
import { Workflow } from "@/components/landing/workflow";
import { SiteHeader } from "@/components/layout/site-header";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <Hero />
      <FeatureGrid />
      <Workflow />
    </div>
  );
}
