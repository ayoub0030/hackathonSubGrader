import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PWAManager } from "@/components/pwa-manager";
import { FloatingActionButton } from "@/components/floating-action-button";

const PWA = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <PWAManager />
      </main>
      <FloatingActionButton />
      <Footer />
    </div>
  );
};

export default PWA;
