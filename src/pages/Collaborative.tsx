import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CollaborativeGrading } from "@/components/collaborative-grading";
import { FloatingActionButton } from "@/components/floating-action-button";

const Collaborative = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <CollaborativeGrading />
      </main>
      <FloatingActionButton />
      <Footer />
    </div>
  );
};

export default Collaborative;
