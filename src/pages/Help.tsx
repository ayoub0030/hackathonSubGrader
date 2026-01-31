import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HelpCenter } from "@/components/help-center";
import { FloatingActionButton } from "@/components/floating-action-button";

const Help = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <HelpCenter />
      </main>
      <FloatingActionButton />
      <Footer />
    </div>
  );
};

export default Help;
