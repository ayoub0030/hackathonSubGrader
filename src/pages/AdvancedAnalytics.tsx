import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdvancedAnalytics } from "@/components/advanced-analytics";
import { FloatingActionButton } from "@/components/floating-action-button";

const AdvancedAnalyticsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <AdvancedAnalytics />
      </main>
      <FloatingActionButton />
      <Footer />
    </div>
  );
};

export default AdvancedAnalyticsPage;
