import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdminDashboard } from "@/components/admin-dashboard";
import { FloatingActionButton } from "@/components/floating-action-button";

const Admin = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <AdminDashboard />
      </main>
      <FloatingActionButton />
      <Footer />
    </div>
  );
};

export default Admin;
