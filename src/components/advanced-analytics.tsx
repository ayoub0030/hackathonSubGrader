import { useState, useEffect, useRef } from "react";
import { TrendingUp, TrendingDown, BarChart3, Calendar, Clock, Users, FileText, Award, Activity, Download, Filter, RefreshCw, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

interface AnalyticsData {
  overview: {
    totalEssays: number;
    totalStudents: number;
    avgGrade: number;
    totalTimeSaved: number;
    weeklyGrowth: number;
    monthlyGrowth: number;
  };
  performance: {
    gradingSpeed: number;
    accuracy: number;
    satisfaction: number;
    retention: number;
  };
  realTime: {
    currentUsers: number;
    activeGrading: number;
    queueSize: number;
    avgResponseTime: number;
  };
}

export function AdvancedAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("week");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const refreshInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: AnalyticsData = {
        overview: {
          totalEssays: 15420,
          totalStudents: 3420,
          avgGrade: 87.3,
          totalTimeSaved: 1240,
          weeklyGrowth: 12.5,
          monthlyGrowth: 28.3
        },
        performance: {
          gradingSpeed: 95.2,
          accuracy: 94.8,
          satisfaction: 92.1,
          retention: 88.7
        },
        realTime: {
          currentUsers: 342,
          activeGrading: 12,
          queueSize: 3,
          avgResponseTime: 1.2
        }
      };
      
      setData(mockData);
      setIsLoading(false);
    };

    fetchAnalytics();
    
    if (autoRefresh) {
      refreshInterval.current = setInterval(fetchAnalytics, 30000);
    }

    return () => {
      if (refreshInterval.current) {
        clearInterval(refreshInterval.current);
      }
    };
  }, [autoRefresh]);

  const handleExportData = (format: "csv" | "json") => {
    if (!data) return;
    
    let content = "";
    let filename = "";
    let mimeType = "";

    switch (format) {
      case "csv":
        content = "Date,Essays Graded,Average Grade,Time Saved\n" +
          "2026-01-01,150,85,8\n" +
          "2026-01-02,180,88,10\n" +
          "2026-01-03,120,82,12";
        filename = "analytics_export.csv";
        mimeType = "text/csv";
        break;
      case "json":
        content = JSON.stringify(data, null, 2);
        filename = "analytics_export.json";
        mimeType = "application/json";
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Successful",
      description: `Data exported as ${format.toUpperCase()}`,
    });
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Advanced Analytics</h1>
          <p className="text-muted-foreground">Loading analytics data...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6">
              <div className="h-4 bg-muted rounded animate-pulse mb-4" />
              <div className="h-8 bg-muted rounded animate-pulse mb-2" />
              <div className="h-4 bg-muted rounded animate-pulse" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Advanced Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into your grading performance and user engagement
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
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="year">Year</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Switch
              checked={autoRefresh}
              onCheckedChange={setAutoRefresh}
            />
            <span className="text-sm text-muted-foreground">Auto-refresh</span>
          </div>
        </div>
      </div>

      {/* Real-time Stats */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Real-time Activity</h2>
          <Badge variant="outline" className="animate-pulse">
            <Activity className="h-3 w-3 mr-1" />
            Live
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{data.realTime.currentUsers}</div>
            <p className="text-sm text-muted-foreground">Active Users</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{data.realTime.activeGrading}</div>
            <p className="text-sm text-muted-foreground">Grading Now</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{data.realTime.queueSize}</div>
            <p className="text-sm text-muted-foreground">In Queue</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{data.realTime.avgResponseTime}s</div>
            <p className="text-sm text-muted-foreground">Avg Response</p>
          </div>
        </div>
      </Card>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Total Essays</h3>
              <p className="text-sm text-muted-foreground">All time</p>
            </div>
            <div className="flex items-center gap-2">
              {data.overview.weeklyGrowth > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span className={`text-sm font-medium ${
                data.overview.weeklyGrowth > 0 ? "text-green-600" : "text-red-600"
              }`}>
                {data.overview.weeklyGrowth > 0 ? "+" : ""}{data.overview.weeklyGrowth}%
              </span>
            </div>
          </div>
          <div className="text-3xl font-bold">{formatNumber(data.overview.totalEssays)}</div>
          <Progress value={85} className="mt-2" />
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Students</h3>
              <p className="text-sm text-muted-foreground">Active users</p>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-600">
                +{data.overview.monthlyGrowth}%
              </span>
            </div>
          </div>
          <div className="text-3xl font-bold">{formatNumber(data.overview.totalStudents)}</div>
          <Progress value={92} className="mt-2" />
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Average Grade</h3>
              <p className="text-sm text-muted-foreground">All essays</p>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-600">
                Excellent
              </span>
            </div>
          </div>
          <div className="text-3xl font-bold">{data.overview.avgGrade}%</div>
          <Progress value={87.3} className="mt-2" />
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Time Saved</h3>
              <p className="text-sm text-muted-foreground">For teachers</p>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">
                {formatTime(data.overview.totalTimeSaved)}
              </span>
            </div>
          </div>
          <div className="text-3xl font-bold">{formatTime(data.overview.totalTimeSaved)}</div>
          <Progress value={78} className="mt-2" />
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{data.performance.gradingSpeed}%</div>
            <p className="text-sm text-muted-foreground">Grading Speed</p>
            <Progress value={data.performance.gradingSpeed} className="mt-2" />
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{data.performance.accuracy}%</div>
            <p className="text-sm text-muted-foreground">Accuracy Rate</p>
            <Progress value={data.performance.accuracy} className="mt-2" />
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{data.performance.satisfaction}%</div>
            <p className="text-sm text-muted-foreground">User Satisfaction</p>
            <Progress value={data.performance.satisfaction} className="mt-2" />
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">{data.performance.retention}%</div>
            <p className="text-sm text-muted-foreground">User Retention</p>
            <Progress value={data.performance.retention} className="mt-2" />
          </div>
        </div>
      </Card>

      {/* Export Options */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Export Data</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportData("csv")}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportData("json")}
            >
              <Download className="h-4 w-4 mr-2" />
              Export JSON
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <FileText className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <h3 className="font-semibold mb-1">Comprehensive Data</h3>
            <p className="text-sm text-muted-foreground">
              Export all analytics data in various formats
            </p>
          </div>
          
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <BarChart3 className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <h3 className="font-semibold mb-1">Custom Reports</h3>
            <p className="text-sm text-muted-foreground">
              Generate custom reports with filters
            </p>
          </div>
          
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <h3 className="font-semibold mb-1">Scheduled Exports</h3>
            <p className="text-sm text-muted-foreground">
              Automated weekly/monthly reports
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
