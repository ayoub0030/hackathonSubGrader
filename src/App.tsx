import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { NotificationProvider } from "@/components/notification-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ClassExam from "./pages/ClassExam";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import Feedback from "./pages/Feedback";
import Profile from "./pages/Profile";
import Collaborative from "./pages/Collaborative";
import PWA from "./pages/PWA";
import API from "./pages/API";
import AdvancedAnalytics from "./pages/AdvancedAnalytics";
import Admin from "./pages/Admin";
import Notifications from "./pages/Notifications";
import Reporting from "./pages/Reporting";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="coTeacher-ui-theme">
      <NotificationProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/class-exam" element={<ClassExam />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/help" element={<Help />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/collaborative" element={<Collaborative />} />
              <Route path="/pwa" element={<PWA />} />
              <Route path="/api" element={<API />} />
              <Route path="/advanced-analytics" element={<AdvancedAnalytics />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/reporting" element={<Reporting />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </NotificationProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
