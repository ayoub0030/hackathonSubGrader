import { useState, useEffect } from "react";
import { Home, BookOpen, BarChart3, User, Settings, HelpCircle, Menu, X, Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useLocation, useNavigate } from "react-router-dom";
import { useNotifications } from "@/components/notification-provider";
import { useTheme } from "@/components/theme-provider";

interface MobileNavProps {
  className?: string;
}

export function MobileNav({ className }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();
  const { theme } = useTheme();

  const mainNavItems = [
    { href: "/", label: "Home", icon: <Home className="h-5 w-5" /> },
    { href: "/class-exam", label: "Grade", icon: <BookOpen className="h-5 w-5" /> },
    { href: "/analytics", label: "Analytics", icon: <BarChart3 className="h-5 w-5" /> },
    { href: "/profile", label: "Profile", icon: <User className="h-5 w-5" /> },
  ];

  const secondaryNavItems = [
    { href: "/settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
    { href: "/help", label: "Help", icon: <HelpCircle className="h-5 w-5" /> },
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleNavClick = (href: string) => {
    navigate(href);
    setIsOpen(false);
  };

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Navigation Bar */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 ${className}`}>
        <div className="flex items-center justify-around px-2 py-2">
          {mainNavItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleNavClick(item.href)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                isActive(item.href)
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.icon}
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
          
          {/* More Options */}
          <button
            onClick={() => setIsOpen(true)}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          >
            <Menu className="h-5 w-5" />
            <span className="text-xs font-medium">More</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-80 bg-background shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold">Menu</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Search */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    className="pl-9"
                    onFocus={() => setShowSearch(true)}
                    onBlur={() => setShowSearch(false)}
                  />
                </div>
              </div>

              {/* Main Navigation */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Navigation
                </h3>
                <div className="space-y-1">
                  {[...mainNavItems, ...secondaryNavItems].map((item) => (
                    <button
                      key={item.href}
                      onClick={() => handleNavClick(item.href)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive(item.href)
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                      {item.href === "/profile" && unreadCount > 0 && (
                        <Badge className="ml-auto" variant="secondary">
                          {unreadCount}
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      navigate("/class-exam");
                      setIsOpen(false);
                    }}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Quick Grade
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      navigate("/analytics");
                      setIsOpen(false);
                    }}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                </div>
              </div>

              {/* Theme Toggle */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Appearance
                </h3>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <span className="text-sm font-medium">Theme</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground capitalize">{theme}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // Toggle theme logic here
                        const newTheme = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
                        // setTheme(newTheme);
                      }}
                    >
                      Switch
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {showSearch && (
        <div className="md:hidden fixed inset-x-4 top-4 z-40">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search essays, students, or settings..."
              className="pl-9 pr-10"
              autoFocus
              onBlur={() => setShowSearch(false)}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2"
              onClick={() => setShowSearch(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>

export function MobileSearchBar({ className }: { className?: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className={`md:hidden ${className}`}>
      <div className={`relative transition-all duration-300 ${
        isExpanded ? "w-full" : "w-10"
      }`}>
        {isExpanded ? (
          <>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-10"
              autoFocus
              onBlur={() => {
                if (!searchQuery) setIsExpanded(false);
              }}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2"
              onClick={() => {
                setSearchQuery("");
                setIsExpanded(false);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10"
            onClick={() => setIsExpanded(true)}
          >
            <Search className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
}

export function MobileNotificationButton({ className }: { className?: string }) {
  const { unreadCount } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`md:hidden ${className}`}>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            variant="destructive"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </Button>
    </div>
  );
}
