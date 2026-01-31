import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdvancedNotificationSystem } from "@/components/advanced-notification-system";
import { FloatingActionButton } from "@/components/floating-action-button";

const Notifications = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <AdvancedNotificationSystem />
      </main>
      <FloatingActionButton />
      <Footer />
    </div>
  );
};

export default Notifications;
