import { useState, useEffect } from "react";
import { User, Bell, Shield, Palette, Globe, Database, HelpCircle, Download, Upload, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useTheme } from "@/components/theme-provider";

interface UserSettings {
  profile: {
    name: string;
    email: string;
    institution: string;
    bio: string;
  };
  notifications: {
    email: boolean;
    push: boolean;
    gradingComplete: boolean;
    weeklyReport: boolean;
  };
  privacy: {
    dataSharing: boolean;
    analytics: boolean;
    publicProfile: boolean;
  };
  grading: {
    defaultGradeLevel: string;
    defaultRubric: string;
    autoSave: boolean;
    strictMode: boolean;
  };
  appearance: {
    theme: string;
    language: string;
    compactMode: boolean;
  };
}

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({
    profile: {
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@university.edu",
      institution: "State University",
      bio: "English professor with 10+ years of experience in academic writing and composition."
    },
    notifications: {
      email: true,
      push: false,
      gradingComplete: true,
      weeklyReport: true
    },
    privacy: {
      dataSharing: false,
      analytics: true,
      publicProfile: false
    },
    grading: {
      defaultGradeLevel: "college",
      defaultRubric: "general",
      autoSave: true,
      strictMode: false
    },
    appearance: {
      theme: theme,
      language: "en",
      compactMode: false
    }
  });

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "coteacher-settings.json";
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Settings exported",
      description: "Your settings have been downloaded.",
    });
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        setSettings(imported);
        toast({
          title: "Settings imported",
          description: "Your settings have been restored.",
        });
      } catch (error) {
        toast({
          title: "Import failed",
          description: "Invalid settings file.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all settings to defaults?")) {
      // Reset to default values
      setSettings({
        profile: {
          name: "",
          email: "",
          institution: "",
          bio: ""
        },
        notifications: {
          email: true,
          push: false,
          gradingComplete: true,
          weeklyReport: true
        },
        privacy: {
          dataSharing: false,
          analytics: true,
          publicProfile: false
        },
        grading: {
          defaultGradeLevel: "college",
          defaultRubric: "general",
          autoSave: true,
          strictMode: false
        },
        appearance: {
          theme: "system",
          language: "en",
          compactMode: false
        }
      });
      
      toast({
        title: "Settings reset",
        description: "All settings have been reset to defaults.",
      });
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: <User className="h-4 w-4" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="h-4 w-4" /> },
    { id: "privacy", label: "Privacy", icon: <Shield className="h-4 w-4" /> },
    { id: "grading", label: "Grading", icon: <Database className="h-4 w-4" /> },
    { id: "appearance", label: "Appearance", icon: <Palette className="h-4 w-4" /> },
    { id: "advanced", label: "Advanced", icon: <HelpCircle className="h-4 w-4" /> }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences and configuration</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={() => document.getElementById('import-settings')?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <input
            id="import-settings"
            type="file"
            accept=".json"
            onChange={handleImportData}
            className="hidden"
          />
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <Card className="p-4">
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </Card>

        {/* Content */}
        <div className="lg:col-span-3">
          <Card className="p-6">
            {activeTab === "profile" && <ProfileSettings settings={settings} setSettings={setSettings} />}
            {activeTab === "notifications" && <NotificationSettings settings={settings} setSettings={setSettings} />}
            {activeTab === "privacy" && <PrivacySettings settings={settings} setSettings={setSettings} />}
            {activeTab === "grading" && <GradingSettings settings={settings} setSettings={setSettings} />}
            {activeTab === "appearance" && <AppearanceSettings settings={settings} setSettings={setSettings} setTheme={setTheme} />}
            {activeTab === "advanced" && <AdvancedSettings onReset={handleReset} />}
          </Card>
        </div>
      </div>
    </div>
  );
}

function ProfileSettings({ settings, setSettings }: { settings: UserSettings; setSettings: (settings: UserSettings) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={settings.profile.name}
              onChange={(e) => setSettings({
                ...settings,
                profile: { ...settings.profile, name: e.target.value }
              })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={settings.profile.email}
              onChange={(e) => setSettings({
                ...settings,
                profile: { ...settings.profile, email: e.target.value }
              })}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="institution">Institution</Label>
            <Input
              id="institution"
              value={settings.profile.institution}
              onChange={(e) => setSettings({
                ...settings,
                profile: { ...settings.profile, institution: e.target.value }
              })}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              rows={3}
              value={settings.profile.bio}
              onChange={(e) => setSettings({
                ...settings,
                profile: { ...settings.profile, bio: e.target.value }
              })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationSettings({ settings, setSettings }: { settings: UserSettings; setSettings: (settings: UserSettings) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">Receive notifications via email</p>
            </div>
            <Switch
              checked={settings.notifications.email}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                notifications: { ...settings.notifications, email: checked }
              })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Push Notifications</p>
              <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
            </div>
            <Switch
              checked={settings.notifications.push}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                notifications: { ...settings.notifications, push: checked }
              })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Grading Complete</p>
              <p className="text-sm text-muted-foreground">Notify when grading is finished</p>
            </div>
            <Switch
              checked={settings.notifications.gradingComplete}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                notifications: { ...settings.notifications, gradingComplete: checked }
              })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Weekly Reports</p>
              <p className="text-sm text-muted-foreground">Receive weekly activity summaries</p>
            </div>
            <Switch
              checked={settings.notifications.weeklyReport}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                notifications: { ...settings.notifications, weeklyReport: checked }
              })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function PrivacySettings({ settings, setSettings }: { settings: UserSettings; setSettings: (settings: UserSettings) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Privacy & Security</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Data Sharing</p>
              <p className="text-sm text-muted-foreground">Share anonymized data to improve the service</p>
            </div>
            <Switch
              checked={settings.privacy.dataSharing}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                privacy: { ...settings.privacy, dataSharing: checked }
              })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Analytics</p>
              <p className="text-sm text-muted-foreground">Allow usage analytics for improvement</p>
            </div>
            <Switch
              checked={settings.privacy.analytics}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                privacy: { ...settings.privacy, analytics: checked }
              })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Public Profile</p>
              <p className="text-sm text-muted-foreground">Make your profile visible to others</p>
            </div>
            <Switch
              checked={settings.privacy.publicProfile}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                privacy: { ...settings.privacy, publicProfile: checked }
              })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function GradingSettings({ settings, setSettings }: { settings: UserSettings; setSettings: (settings: UserSettings) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Grading Preferences</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="defaultGradeLevel">Default Grade Level</Label>
            <Select
              value={settings.grading.defaultGradeLevel}
              onValueChange={(value) => setSettings({
                ...settings,
                grading: { ...settings.grading, defaultGradeLevel: value }
              })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="elementary">Elementary</SelectItem>
                <SelectItem value="middle">Middle School</SelectItem>
                <SelectItem value="high">High School</SelectItem>
                <SelectItem value="college">College</SelectItem>
                <SelectItem value="graduate">Graduate</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="defaultRubric">Default Rubric Type</Label>
            <Select
              value={settings.grading.defaultRubric}
              onValueChange={(value) => setSettings({
                ...settings,
                grading: { ...settings.grading, defaultRubric: value }
              })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Writing</SelectItem>
                <SelectItem value="argumentative">Argumentative Essay</SelectItem>
                <SelectItem value="narrative">Narrative Essay</SelectItem>
                <SelectItem value="expository">Expository Essay</SelectItem>
                <SelectItem value="research">Research Paper</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-4 mt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Auto-save Drafts</p>
              <p className="text-sm text-muted-foreground">Automatically save essay drafts</p>
            </div>
            <Switch
              checked={settings.grading.autoSave}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                grading: { ...settings.grading, autoSave: checked }
              })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Strict Mode</p>
              <p className="text-sm text-muted-foreground">Apply stricter grading criteria</p>
            </div>
            <Switch
              checked={settings.grading.strictMode}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                grading: { ...settings.grading, strictMode: checked }
              })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function AppearanceSettings({ settings, setSettings, setTheme }: { 
  settings: UserSettings; 
  setSettings: (settings: UserSettings) => void;
  setTheme: (theme: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Appearance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <Select
              value={settings.appearance.theme}
              onValueChange={(value) => {
                setSettings({
                  ...settings,
                  appearance: { ...settings.appearance, theme: value }
                });
                setTheme(value);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select
              value={settings.appearance.language}
              onValueChange={(value) => setSettings({
                ...settings,
                appearance: { ...settings.appearance, language: value }
              })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-4 mt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Compact Mode</p>
              <p className="text-sm text-muted-foreground">Use more compact interface layout</p>
            </div>
            <Switch
              checked={settings.appearance.compactMode}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                appearance: { ...settings.appearance, compactMode: checked }
              })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function AdvancedSettings({ onReset }: { onReset: () => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Advanced Settings</h2>
        <div className="space-y-6">
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Data Management</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Export your settings or reset to defaults
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onReset}>
                <Trash2 className="h-4 w-4 mr-2" />
                Reset to Defaults
              </Button>
            </div>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">About CoTeacher</h3>
            <div className="space-y-2 text-sm">
              <p>Version: 2.0.0</p>
              <p>Last Updated: January 2026</p>
              <div className="flex gap-2">
                <Badge variant="outline">Production</Badge>
                <Badge variant="outline">Secure</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
