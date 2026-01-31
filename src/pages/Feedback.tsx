import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FeedbackSystem } from "@/components/feedback-system";
import { FloatingActionButton } from "@/components/floating-action-button";

const Feedback = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <FeedbackSystem />
      </main>
      <FloatingActionButton />
      <Footer />
    </div>
  );
};

export default Feedback;
