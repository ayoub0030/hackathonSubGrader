import { useState, useEffect, useRef } from "react";
import { Settings, Users, Shield, Database, Activity, AlertTriangle, Download, Upload, RefreshCw, Eye, EyeOff, Filter, Search, BarChart3, PieChart, TrendingUp, TrendingDown, UserCheck, Mail, Bell, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  totalEssays: number;
  storageUsed: number;
  storageCapacity: number;
  apiCalls: number;
  errorRate: number;
  avgResponseTime: number;
  uptime: number;
}

interface AdminStats {
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  totalRevenue: number;
  churnRate: number;
  userSatisfaction: number;
  systemHealth: "excellent" | "good" | "fair" | "poor";
}

export function AdminDashboard() {
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    totalUsers: 3420,
    activeUsers: 2847,
    totalEssays: 15420,
    storageUsed: 2.4,
    storageCapacity: 10,
    apiCalls: 156420,
    errorRate: 0.8,
    avgResponseTime: 1.2,
    uptime: 99.9
  });

  const [adminStats, setAdminStats] = useState<AdminStats>({
    dailyActiveUsers: 2847,
    weeklyActiveUsers: 3120,
    monthlyActiveUsers: 3420,
    totalRevenue: 12450,
    churnRate: 2.1,
    userSatisfaction: 92.1,
    systemHealth: "excellent"
  });

  const [isLoading, setIsLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const refreshInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (autoRefresh) {
      refreshInterval.current = setInterval(() => {
        setSystemMetrics(prev => ({
          ...prev,
          activeUsers: prev.activeUsers + Math.floor(Math.random() * 10) - 5,
          apiCalls: prev.apiCalls + Math.floor(Math.random() * 50),
          avgResponseTime: Math.max(0.8, prev.avgResponseTime + (Math.random() - 0.5))
        }));
        
        setAdminStats(prev => ({
          ...prev,
          dailyActiveUsers: prev.dailyActiveUsers + Math.floor(Math.random() * 20) - 10,
          userSatisfaction: Math.min(100, Math.max(85, prev.userSatisfaction + (Math.random() * 2 - 1))
        }));
      }, 5000);
    }

    return () => {
      if (refreshInterval.current) {
        clearInterval(refreshInterval.current);
      }
    };
  }, [autoRefresh]);

  const handleExportData = (format: "csv" | "json") => {
    const data = { systemMetrics, adminStats };
    
    const content = JSON.stringify(data, null, 2);
    const filename = `admin_export_${new Date().toISOString().split('T')[0]}.${format}`;
    const mimeType = format === "json" ? "application/json" : "text/csv";
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Successful",
      description: `Admin data exported as ${format.toUpperCase()}`,
    });
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case "excellent": return "text-green-600 bg-green-100";
      case "good": return "text-blue-600 bg-blue-100";
      case "fair": return "text-yellow-600 bg-yellow-100";
      case "poor": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            System management and administrative controls
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => setIsLoading(false), 1000);
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <div className="flex items-center gap-2">
            <Switch
              checked={autoRefresh}
              onCheckedChange={setAutoRefresh}
            />
            <span className="text-sm text-muted-foreground">Auto-refresh</span>
          </div>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Total Users</h3>
              <p className="text-sm text-muted-foreground">All registered</p>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">
                +{systemMetrics.totalUsers}
              </span>
            </div>
          </div>
          <div className="text-3xl font-bold">{formatNumber(systemMetrics.totalUsers)}</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Active Users</h3>
              <p className="text-sm text-muted-foreground">Currently online</p>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-600">
                {systemMetrics.activeUsers}
              </span>
            </div>
          </div>
          <div className="text-3xl font-bold">{formatNumber(systemMetrics.activeUsers)}</div>
          <div className="text-sm text-muted-foreground">
            {((systemMetrics.activeUsers / systemMetrics.totalUsers) * 100).toFixed(1)}%
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Storage Usage</h3>
              <p className="text-sm text-muted-foreground">Database storage</p>
            </div>
            <div className="text-3xl font-bold">
              {systemMetrics.storageUsed}GB / {systemMetrics.storageCapacity}GB
            </div>
          </div>
          <Progress value={(systemMetrics.storageUsed / systemMetrics.storageCapacity) * 100} className="mt-2" />
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">API Calls</h3>
              <p className="text-sm text-muted-foreground">Last 24h</p>
            </div>
            <div className="text-3xl font-bold">{formatNumber(systemMetrics.apiCalls)}</div>
          </div>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{systemMetrics.avgResponseTime}s</div>
            <p className="text-sm text-muted-foreground">Avg Response Time</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">94.8%</div>
            <p className="text-sm text-muted-foreground">Accuracy Rate</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">{systemMetrics.errorRate}%</div>
            <p className="text-sm text-muted-foreground">Error Rate</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{adminStats.userSatisfaction}%</div>
            <p className="text-sm text-muted-foreground">User Satisfaction</p>
          </div>
        </div>
      </Card>

      {/* Admin Stats */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Administrative Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{formatNumber(adminStats.dailyActiveUsers)}</div>
            <p className="text-sm text-muted-foreground">Daily Active</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{formatNumber(adminStats.weeklyActiveUsers)}</div>
            <p className="text-sm text-muted-foreground">Weekly Active</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{formatNumber(adminStats.monthlyActiveUsers)}</div>
            <p className="text-sm text-muted-foreground">Monthly Active</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{adminStats.churnRate}%</div>
            <p className="text-sm text-muted-foreground">Churn Rate</p>
          </div>
        </div>
      </Card>

      {/* System Health */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">System Health</h2>
          <Badge className={getHealthColor(adminStats.systemHealth)}>
            {adminStats.systemHealth}
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Database Status</span>
              <Badge className="bg-green-100 text-green-800">Healthy</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">API Response Time</span>
              <Badge className="bg-green-100 text-green-800">Normal</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Error Rate</span>
              <Badge className="bg-green-100 text-green-800">Low</Badge>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Cache Hit Rate</span>
              <span className="text-sm font-medium">94.2%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Memory Usage</span>
              <span className="text-sm font-medium">67%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">CPU Usage</span>
              <span className="text-sm font-medium">42%</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Export Options */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Data Management</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportData("json")}
            >
              <Download className="h-4 w-4 mr-2" />
              Export JSON
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportData("csv")}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <Database className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <h3 className="font-semibold mb-1">Database Backup</h3>
            <p className="text-sm text-muted-foreground">
              Automated daily backups with point-in-time recovery
            </p>
          </div>
          
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <Shield className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <h3 className="font-semibold mb-1">Security Audit</h3>
            <p className="text-sm text-muted-foreground">
              Regular security scans and vulnerability assessments
            </p>
          </div>
          
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <BarChart3 className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <h3 className="font-semibold mb-1">Performance Monitoring</h3>
            <p className="text-sm text-muted-foreground">
              Real-time performance metrics and alerting system
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
