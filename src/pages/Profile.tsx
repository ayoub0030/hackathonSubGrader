import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { UserProfile } from "@/components/user-profile";
import { FloatingActionButton } from "@/components/floating-action-button";

const Profile = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <UserProfile />
      </main>
      <FloatingActionButton />
      <Footer />
    </div>
  );
};

export default Profile;
