import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { APIDocumentation } from "@/components/api-documentation";
import { FloatingActionButton } from "@/components/floating-action-button";

const API = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <APIDocumentation />
      </main>
      <FloatingActionButton />
      <Footer />
    </div>
  );
};

export default API;
