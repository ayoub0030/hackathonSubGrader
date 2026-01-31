import { GraduationCap, FileText, Sparkles, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationCenter } from "@/components/notification-center";
import { KeyboardShortcuts, defaultShortcuts } from "@/components/keyboard-shortcuts";
import { useState } from "react";
import { useLocation } from "react-router-dom";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight">
            CoTeacher
          </span>
        </a>

        <div className="flex items-center gap-3">
          <nav className="hidden md:flex items-center gap-6">
            {location.pathname === "/" ? (
              <>
                <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </a>
                <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  How it works
                </a>
                <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </a>
              </>
            ) : null}
            <a href="/analytics" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Analytics
            </a>
            <a href="/settings" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Settings
            </a>
            <a href="/help" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Help
            </a>
            <a href="/feedback" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Feedback
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <KeyboardShortcuts shortcuts={defaultShortcuts} />
            <NotificationCenter />
            <ThemeToggle />
            {location.pathname === "/" ? (
              <a href="/class-exam">
                <Button size="sm" variant="outline">
                  Class grading
                </Button>
              </a>
            ) : (
              <a href="/">
                <Button size="sm" variant="outline">
                  Simple grading
                </Button>
              </a>
            )}
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background p-4 animate-slide-up">
          <nav className="flex flex-col gap-3">
            {location.pathname === "/" ? (
              <>
                <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2">
                  Features
                </a>
                <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2">
                  How it works
                </a>
                <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2">
                  Pricing
                </a>
              </>
            ) : null}
            <div className="flex gap-2 pt-3 border-t border-border">
              <NotificationCenter />
              <ThemeToggle />
              {location.pathname === "/" ? (
                <a href="/class-exam" className="flex-1">
                  <Button size="sm" className="w-full">
                    Class grading
                  </Button>
                </a>
              ) : (
                <a href="/" className="flex-1">
                  <Button size="sm" className="w-full">
                    Simple grading
                  </Button>
                </a>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
