import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SettingsPage } from "@/components/settings-page";
import { FloatingActionButton } from "@/components/floating-action-button";

const Settings = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <SettingsPage />
      </main>
      <FloatingActionButton />
      <Footer />
    </div>
  );
};

export default Settings;
