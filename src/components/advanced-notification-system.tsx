import { useState, useEffect, useRef } from "react";
import { Bell, BellRing, CheckCircle2, AlertTriangle, Info, X, Settings, Filter, Search, Clock, Calendar, User, Mail, MessageSquare, Zap, Volume2, VolumeX, FileText, Users, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { useNotifications } from "@/components/notification-provider";

interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error" | "system" | "grading" | "collaboration" | "achievement";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: "low" | "medium" | "high" | "urgent";
  category: string;
  userId?: string;
  userName?: string;
  actionUrl?: string;
  actionText?: string;
  metadata?: Record<string, any>;
  expiresAt?: Date;
}

interface NotificationSettings {
  email: {
    enabled: boolean;
    types: string[];
    frequency: "immediate" | "hourly" | "daily" | "weekly";
  };
  push: {
    enabled: boolean;
    types: string[];
    sound: boolean;
    vibration: boolean;
  };
  inApp: {
    enabled: boolean;
    sound: boolean;
    desktop: boolean;
    badge: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
    timezone: string;
  };
  categories: {
    system: boolean;
    grading: boolean;
    collaboration: boolean;
    achievements: boolean;
    updates: boolean;
  };
}

export function AdvancedNotificationSystem() {
  const { unreadCount, markAsRead } = useNotifications();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "success",
      title: "Essay Graded Successfully",
      message: "Your essay 'The Impact of Technology on Education' has been graded with a score of 92%",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      priority: "medium",
      category: "grading",
      userId: "user_123",
      userName: "Dr. Sarah Johnson",
      actionUrl: "/essays/result/123",
      actionText: "View Results"
    },
    {
      id: "2",
      type: "info",
      title: "New Collaboration Request",
      message: "Prof. Michael Chen has invited you to collaborate on grading 15 essays",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      read: false,
      priority: "medium",
      category: "collaboration",
      userId: "user_456",
      userName: "Prof. Michael Chen",
      actionUrl: "/collaborative/invite/789",
      actionText: "View Request"
    },
    {
      id: "3",
      type: "achievement",
      title: "Achievement Unlocked!",
      message: "Congratulations! You've unlocked the 'Speed Demon' achievement for grading 10 essays in one hour",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: false,
      priority: "high",
      category: "achievements",
      userId: "user_123",
      userName: "Dr. Sarah Johnson",
      actionUrl: "/profile/achievements",
      actionText: "View Achievement"
    },
    {
      id: "4",
      type: "warning",
      title: "Storage Limit Warning",
      message: "You're approaching your storage limit. Consider upgrading your plan or deleting old essays.",
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      read: true,
      priority: "high",
      category: "system",
      actionUrl: "/settings/plans",
      actionText: "Upgrade Plan"
    },
    {
      id: "5",
      type: "error",
      title: "Grading Failed",
      message: "Failed to grade essay due to network error. Please try again.",
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      read: true,
      priority: "urgent",
      category: "grading",
      userId: "user_789",
      userName: "Ms. Emily Rodriguez",
      actionUrl: "/essays/retry/456",
      actionText: "Retry Grading"
    },
    {
      id: "6",
      type: "system",
      title: "System Maintenance Scheduled",
      message: "System maintenance is scheduled for tonight at 2:00 AM UTC. The system will be unavailable for approximately 30 minutes.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
      priority: "medium",
      category: "system",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    }
  ]);

  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      enabled: true,
      types: ["success", "error", "warning"],
      frequency: "immediate"
    },
    push: {
      enabled: true,
      types: ["success", "error", "urgent"],
      sound: true,
      vibration: true
    },
    inApp: {
      enabled: true,
      sound: true,
      desktop: true,
      badge: true
    },
    quietHours: {
      enabled: false,
      start: "22:00",
      end: "08:00",
      timezone: "UTC"
    },
    categories: {
      system: true,
      grading: true,
      collaboration: true,
      achievements: true,
      updates: true
    }
  });

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element for notification sounds
    audioRef.current = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoAAAC1hYmFaaF1YmFaaF1");
  }, []);

  const playNotificationSound = (type: Notification["type"]) => {
    if (!soundEnabled || !settings.inApp.sound) return;
    
    // In a real implementation, you'd have different sound files for different notification types
    try {
      audioRef.current?.play();
    } catch (error) {
      console.log("Audio playback failed:", error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast({
      title: "Notification deleted",
      description: "The notification has been removed.",
    });
  };

  const handleClearAll = () => {
    setNotifications([]);
    toast({
      title: "All notifications cleared",
      description: "All notifications have been removed.",
    });
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesCategory = selectedCategory === "all" || notification.category === selectedCategory;
    const matchesPriority = selectedPriority === "all" || notification.priority === selectedPriority;
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesPriority && matchesSearch;
  });

  const unreadNotifications = filteredNotifications.filter(n => !n.read);
  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
  const sortedNotifications = [...unreadNotifications, ...filteredNotifications.filter(n => n.read)]
    .sort((a, b) => {
      if (a.read !== b.read) return a.read ? 1 : -1;
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success": return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "error": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "warning": return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "info": return <Info className="h-4 w-4 text-blue-600" />;
      case "system": return <Settings className="h-4 w-4 text-purple-600" />;
      case "grading": return <FileText className="h-4 w-4 text-orange-600" />;
      case "collaboration": return <Users className="h-4 w-4 text-indigo-600" />;
      case "achievement": return <Award className="h-4 w-4 text-yellow-600" />;
      default: return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: Notification["priority"]) => {
    switch (priority) {
      case "urgent": return "border-red-500 bg-red-50";
      case "high": return "border-orange-500 bg-orange-50";
      case "medium": return "border-yellow-500 bg-yellow-50";
      case "low": return "border-gray-500 bg-gray-50";
      default: return "border-gray-500 bg-gray-50";
    }
  };

  const getTypeColor = (type: Notification["type"]) => {
    switch (type) {
      case "success": return "text-green-600";
      case "error": return "text-red-600";
      case "warning": return "text-yellow-600";
      case "info": return "text-blue-600";
      case "system": return "text-purple-600";
      case "grading": return "text-orange-600";
      case "collaboration": return "text-indigo-600";
      case "achievement": return "text-yellow-600";
      default: return "text-gray-600";
    }
  };

  const categories = ["all", "system", "grading", "collaboration", "achievements", "updates"];
  const priorities = ["all", "urgent", "high", "medium", "low"];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            Manage your notifications and alert preferences
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <div className="flex items-center gap-2">
            <Switch
              checked={soundEnabled}
              onCheckedChange={setSoundEnabled}
            />
            <span className="text-sm text-muted-foreground">
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Notifications Panel */}
        <div className={`flex-1 ${isExpanded ? "max-w-4xl" : "max-w-2xl"}`}>
          {/* Filters and Search */}
          <Card className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority === "all" ? "All Priorities" : priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={unreadNotifications.length === 0}
              >
                Mark All Read
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                disabled={notifications.length === 0}
              >
                Clear All
              </Button>
            </div>
          </Card>

          {/* Notifications List */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BellRing className="h-5 w-5" />
                <h3 className="font-semibold">Notifications</h3>
                <Badge variant="outline">
                  {unreadNotifications.length} unread
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "Collapse" : "Expand"}
              </Button>
            </div>
            
            <ScrollArea className="h-[600px]">
              <div className="space-y-2">
                {sortedNotifications.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                    <p className="text-muted-foreground">
                      You're all caught up! Check back later for new notifications.
                    </p>
                  </div>
                ) : (
                  sortedNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                        !notification.read ? getPriorityColor(notification.priority) : "bg-muted/30"
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          !notification.read ? "bg-white" : "bg-muted/50"
                        }`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <div className="flex-1">
                              <h4 className={`font-medium text-sm ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}>
                                {notification.title}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {notification.category}
                                </Badge>
                                <Badge variant="outline" className={`text-xs ${getTypeColor(notification.type)}`}>
                                  {notification.type}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {notification.priority}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteNotification(notification.id);
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <p className={`text-sm ${!notification.read ? "text-foreground" : "text-muted-foreground"} mb-2`}>
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{notification.timestamp.toLocaleDateString()} at {notification.timestamp.toLocaleTimeString()}</span>
                              {notification.userName && (
                                <>
                                  <span>•</span>
                                  <User className="h-3 w-3" />
                                  <span>{notification.userName}</span>
                                </>
                              )}
                            </div>
                            
                            {notification.actionText && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleNotificationClick(notification);
                                }}
                              >
                                {notification.actionText}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </Card>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <Card className="w-80 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Notification Settings</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">In-App Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="inAppEnabled">Enable notifications</Label>
                      <Switch
                        id="inAppEnabled"
                        checked={settings.inApp.enabled}
                        onCheckedChange={(checked) =>
                          setSettings(prev => ({
                            ...prev,
                            inApp: { ...prev.inApp, enabled: checked }
                          }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="inAppSound">Sound effects</Label>
                      <Switch
                        id="inAppSound"
                        checked={settings.inApp.sound}
                        onCheckedChange={(checked) =>
                          setSettings(prev => ({
                            ...prev,
                            inApp: { ...prev.inApp, sound: checked }
                          }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="inAppDesktop">Desktop notifications</Label>
                      <Switch
                        id="inAppDesktop"
                        checked={settings.inApp.desktop}
                        onCheckedChange={(checked) =>
                          setSettings(prev => ({
                            ...prev,
                            inApp: { ...prev.inApp, desktop: checked }
                          }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="inAppBadge">Badge notifications</Label>
                      <Switch
                        id="inAppBadge"
                        checked={settings.inApp.badge}
                        onCheckedChange={(checked) =>
                          setSettings(prev => ({
                            ...prev,
                            inApp: { ...prev.inApp, badge: checked }
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Email Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="emailEnabled">Enable email notifications</Label>
                      <Switch
                        id="emailEnabled"
                        checked={settings.email.enabled}
                        onCheckedChange={(checked) =>
                          setSettings(prev => ({
                            ...prev,
                            email: { ...prev.email, enabled: checked }
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emailFrequency">Frequency</Label>
                      <Select
                        value={settings.email.frequency}
                        onValueChange={(value: "immediate" | "hourly" | "daily" | "weekly") =>
                          setSettings(prev => ({
                            ...prev,
                            email: { ...prev.email, frequency: value }
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediate">Immediate</SelectItem>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Push Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="pushEnabled">Enable push notifications</Label>
                      <Switch
                        id="pushEnabled"
                        checked={settings.push.enabled}
                        onCheckedChange={(checked) =>
                          setSettings(prev => ({
                            ...prev,
                            push: { ...prev.push, enabled: checked }
                          }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="pushSound">Sound</Label>
                      <Switch
                        id="pushSound"
                        checked={settings.push.sound}
                        onCheckedChange={(checked) =>
                          setSettings(prev => ({
                            ...prev,
                            push: { ...prev.push, sound: checked }
                          }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="pushVibration">Vibration</Label>
                      <Switch
                        id="pushVibration"
                        checked={settings.push.vibration}
                        onCheckedChange={(checked) =>
                          setSettings(prev => ({
                            ...prev,
                            push: { ...prev.push, vibration: checked }
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Quiet Hours</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="quietHoursEnabled">Enable quiet hours</Label>
                      <Switch
                        id="quietHoursEnabled"
                        checked={settings.quietHours.enabled}
                        onCheckedChange={(checked) =>
                          setSettings(prev => ({
                            ...prev,
                            quietHours: { ...prev.quietHours, enabled: checked }
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quietHoursStart">Start time</Label>
                      <Input
                        id="quietHoursStart"
                        type="time"
                        value={settings.quietHours.start}
                        onChange={(e) =>
                          setSettings(prev => ({
                            ...prev,
                            quietHours: { ...prev.quietHours, start: e.target.value }
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quietHoursEnd">End time</Label>
                      <Input
                        id="quietHoursEnd"
                        type="time"
                        value={settings.quietHours.end}
                        onChange={(e) =>
                          setSettings(prev => ({
                            ...prev,
                            quietHours: { ...prev.quietHours, end: e.target.value }
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="categories" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Notification Categories</h3>
                  <div className="space-y-3">
                    {Object.entries(settings.categories).map(([key, enabled]) => (
                      <div key={key} className="flex items-center justify-between">
                        <Label htmlFor={`category-${key}`}>
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </Label>
                        <Switch
                          id={`category-${key}`}
                          checked={enabled}
                          onCheckedChange={(checked) =>
                            setSettings(prev => ({
                              ...prev,
                              categories: { ...prev.categories, [key]: checked }
                            }))
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        )}
      </div>
    </div>
  );
}
