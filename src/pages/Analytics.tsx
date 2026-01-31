import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AnalyticsDashboard } from "@/components/analytics-dashboard";
import { FloatingActionButton } from "@/components/floating-action-button";

const Analytics = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <AnalyticsDashboard />
      </main>
      <FloatingActionButton />
      <Footer />
    </div>
  );
};

export default Analytics;
