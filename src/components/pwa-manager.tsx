import { useState, useEffect } from "react";
import { Smartphone, Tablet, Monitor, Download, Bell, Home, Settings, User, BookOpen, BarChart3, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface PWAFeature {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  icon: React.ReactNode;
  category: string;
}

export function PWAManager() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [features, setFeatures] = useState<PWAFeature[]>([
    {
      id: "offline",
      title: "Offline Mode",
      description: "Access core features without internet connection",
      enabled: true,
      icon: <Download className="h-5 w-5" />,
      category: "Core"
    },
    {
      id: "notifications",
      title: "Push Notifications",
      description: "Receive alerts for grading completion and updates",
      enabled: false,
      icon: <Bell className="h-5 w-5" />,
      category: "Engagement"
    },
    {
      id: "cache",
      title: "Smart Caching",
      description: "Store frequently used content for faster access",
      enabled: true,
      icon: <BookOpen className="h-5 w-5" />,
      category: "Performance"
    },
    {
      id: "sync",
      title: "Background Sync",
      description: "Automatically sync data when connection is restored",
      enabled: true,
      icon: <BarChart3 className="h-5 w-5" />,
      category: "Data"
    },
    {
      id: "theme",
      title: "Adaptive Theme",
      description: "Automatically adjust theme based on system preferences",
      enabled: true,
      icon: <Monitor className="h-5 w-5" />,
      category: "UI"
    },
    {
      id: "touch",
      title: "Touch Gestures",
      description: "Enhanced touch interactions for mobile devices",
      enabled: true,
      icon: <Smartphone className="h-5 w-5" />,
      category: "Mobile"
    }
  ]);

  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    screenWidth: 0,
    screenHeight: 0,
    pixelRatio: 1,
    orientation: "portrait"
  });

  useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isDesktop = width >= 1024;

      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        screenWidth: width,
        screenHeight: height,
        pixelRatio: window.devicePixelRatio || 1,
        orientation: width > height ? "landscape" : "portrait"
      });
    };

    updateDeviceInfo();
    window.addEventListener("resize", updateDeviceInfo);
    window.addEventListener("orientationchange", updateDeviceInfo);

    return () => {
      window.removeEventListener("resize", updateDeviceInfo);
      window.removeEventListener("orientationchange", updateDeviceInfo);
    };
  }, []);

  useEffect(() => {
    // Check if PWA is already installed
    if ("serviceWorker" in navigator && window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setIsInstalled(true);
      toast({
        title: "Installation successful!",
        description: "CoTeacher has been installed on your device.",
      });
    }

    setDeferredPrompt(null);
  };

  const toggleFeature = (featureId: string) => {
    setFeatures(prev => prev.map(feature => 
      feature.id === featureId ? { ...feature, enabled: !feature.enabled } : feature
    ));
  };

  const getDeviceIcon = () => {
    if (deviceInfo.isMobile) return <Smartphone className="h-8 w-8" />;
    if (deviceInfo.isTablet) return <Tablet className="h-8 w-8" />;
    return <Monitor className="h-8 w-8" />;
  };

  const getDeviceType = () => {
    if (deviceInfo.isMobile) return "Mobile";
    if (deviceInfo.isTablet) return "Tablet";
    return "Desktop";
  };

  const getResponsiveBreakpoints = () => {
    return {
      mobile: "< 768px",
      tablet: "768px - 1023px",
      desktop: "≥ 1024px"
    };
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Mobile & PWA Features</h1>
        <p className="text-muted-foreground">
          Manage progressive web app features and mobile responsiveness
        </p>
      </div>

      {/* Device Information */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Current Device</h2>
          <Badge variant="outline">{getDeviceType()}</Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
            {getDeviceIcon()}
            <div>
              <p className="font-medium">Device Type</p>
              <p className="text-sm text-muted-foreground">{getDeviceType()}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
            <Monitor className="h-8 w-8" />
            <div>
              <p className="font-medium">Screen Size</p>
              <p className="text-sm text-muted-foreground">
                {deviceInfo.screenWidth} × {deviceInfo.screenHeight}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
            <Smartphone className="h-8 w-8" />
            <div>
              <p className="font-medium">Orientation</p>
              <p className="text-sm text-muted-foreground capitalize">{deviceInfo.orientation}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* PWA Installation */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">PWA Installation</h2>
            <p className="text-sm text-muted-foreground">
              Install CoTeacher as a native app on your device
            </p>
          </div>
          {isInstalled && <Badge className="bg-green-100 text-green-800">Installed</Badge>}
        </div>

        <div className="space-y-4">
          {!isInstalled && deferredPrompt ? (
            <div className="flex items-center justify-between p-4 border-2 border-dashed border-primary rounded-lg">
              <div>
                <p className="font-medium">Install CoTeacher</p>
                <p className="text-sm text-muted-foreground">
                  Get the full app experience with offline access
                </p>
              </div>
              <Button onClick={handleInstall}>
                <Download className="h-4 w-4 mr-2" />
                Install
              </Button>
            </div>
          ) : (
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-center text-muted-foreground">
                {isInstalled 
                  ? "CoTeacher is already installed on this device"
                  : "PWA installation is not available on this device or browser"
                }
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Responsive Design Preview */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Responsive Design Preview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Mobile Preview */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              <h3 className="font-medium">Mobile View</h3>
              <Badge variant="outline">320px - 767px</Badge>
            </div>
            <div className="border-2 border-border rounded-lg p-4 bg-background">
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
                <div className="h-3 bg-muted rounded w-5/6"></div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-8 bg-primary rounded"></div>
                  <div className="h-8 bg-secondary rounded"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Tablet Preview */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Tablet className="h-5 w-5" />
              <h3 className="font-medium">Tablet View</h3>
              <Badge variant="outline">768px - 1023px</Badge>
            </div>
            <div className="border-2 border-border rounded-lg p-4 bg-background">
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-2/3"></div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded"></div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-8 bg-primary rounded"></div>
                  <div className="h-8 bg-secondary rounded"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Preview */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              <h3 className="font-medium">Desktop View</h3>
              <Badge variant="outline">1024px+</Badge>
            </div>
            <div className="border-2 border-border rounded-lg p-4 bg-background">
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="grid grid-cols-4 gap-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded"></div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-8 bg-primary rounded"></div>
                  <div className="h-8 bg-secondary rounded"></div>
                  <div className="h-8 bg-accent rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* PWA Features */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">PWA Features</h2>
        
        <div className="space-y-4">
          {["Core", "Engagement", "Performance", "Data", "UI", "Mobile"].map((category) => (
            <div key={category} className="space-y-3">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                {category}
              </h3>
              {features
                .filter(feature => feature.category === category)
                .map((feature) => (
                  <div key={feature.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-lg">
                        {feature.icon}
                      </div>
                      <div>
                        <p className="font-medium">{feature.title}</p>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                    <Switch
                      checked={feature.enabled}
                      onCheckedChange={() => toggleFeature(feature.id)}
                    />
                  </div>
                ))}
            </div>
          ))}
        </div>
      </Card>

      {/* Mobile Navigation Preview */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Mobile Navigation</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-medium">Bottom Navigation Bar</h3>
            <div className="border-2 border-border rounded-lg p-4 bg-background">
              <div className="flex justify-around items-center">
                <div className="flex flex-col items-center gap-1">
                  <Home className="h-5 w-5 text-primary" />
                  <span className="text-xs">Home</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <span className="text-xs">Grade</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <BarChart3 className="h-5 w-5 text-muted-foreground" />
                  <span className="text-xs">Analytics</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <span className="text-xs">Profile</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Hamburger Menu</h3>
            <div className="border-2 border-border rounded-lg p-4 bg-background">
              <div className="flex items-center justify-between mb-4">
                <Menu className="h-6 w-6" />
                <div className="h-6 w-6 bg-muted rounded-full"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
