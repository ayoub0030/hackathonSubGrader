import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  Search, 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Settings, 
  RefreshCw,
  FileSpreadsheet,
  FileJson,
  FileDown,
  Eye,
  Trash2,
  Share2,
  Mail,
  Printer,
  Database,
  Activity,
  Target,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReportData {
  id: string;
  name: string;
  type: string;
  status: "completed" | "processing" | "failed" | "scheduled";
  createdAt: string;
  completedAt?: string;
  size: string;
  format: "csv" | "json" | "pdf" | "excel";
  scheduled?: boolean;
  scheduleFrequency?: "daily" | "weekly" | "monthly";
}

interface ExportTemplate {
  id: string;
  name: string;
  description: string;
  fields: string[];
  format: "csv" | "json" | "pdf" | "excel";
  createdAt: string;
  lastUsed?: string;
  usageCount: number;
}

interface AnalyticsMetric {
  name: string;
  value: number;
  change: number;
  trend: "up" | "down" | "stable";
  icon: React.ReactNode;
}

const ReportingAnalyticsExport = () => {
  const [reports, setReports] = useState<ReportData[]>([
    {
      id: "1",
      name: "Student Performance Report",
      type: "Academic Performance",
      status: "completed",
      createdAt: "2024-01-15T10:30:00Z",
      completedAt: "2024-01-15T10:35:00Z",
      size: "2.4 MB",
      format: "pdf",
    },
    {
      id: "2",
      name: "Grading Analytics Dashboard",
      type: "Analytics",
      status: "processing",
      createdAt: "2024-01-15T11:00:00Z",
      size: "1.8 MB",
      format: "excel",
    },
    {
      id: "3",
      name: "Weekly Submission Summary",
      type: "Submissions",
      status: "scheduled",
      createdAt: "2024-01-15T09:00:00Z",
      size: "0.8 MB",
      format: "csv",
      scheduled: true,
      scheduleFrequency: "weekly",
    },
    {
      id: "4",
      name: "User Activity Log",
      type: "System Logs",
      status: "failed",
      createdAt: "2024-01-15T08:30:00Z",
      size: "0.5 MB",
      format: "json",
    },
  ]);

  const [templates, setTemplates] = useState<ExportTemplate[]>([
    {
      id: "1",
      name: "Student Performance Template",
      description: "Comprehensive student performance data including grades, attendance, and participation",
      fields: ["Student ID", "Name", "Grade", "Attendance", "Participation", "Assignments", "Final Score"],
      format: "excel",
      createdAt: "2024-01-10T00:00:00Z",
      lastUsed: "2024-01-15T10:30:00Z",
      usageCount: 15,
    },
    {
      id: "2",
      name: "Grading Analytics Template",
      description: "Analytics data for grading patterns and instructor performance",
      fields: ["Instructor", "Course", "Average Grade", "Submission Rate", "Grading Time", "Feedback Quality"],
      format: "csv",
      createdAt: "2024-01-08T00:00:00Z",
      lastUsed: "2024-01-14T15:20:00Z",
      usageCount: 8,
    },
    {
      id: "3",
      name: "System Usage Report",
      description: "System-wide usage statistics and performance metrics",
      fields: ["Date", "Active Users", "API Calls", "Response Time", "Error Rate", "Storage Used"],
      format: "json",
      createdAt: "2024-01-05T00:00:00Z",
      usageCount: 3,
    },
  ]);

  const [metrics, setMetrics] = useState<AnalyticsMetric[]>([
    {
      name: "Total Reports Generated",
      value: 1247,
      change: 12.5,
      trend: "up",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      name: "Active Scheduled Reports",
      value: 18,
      change: -5.2,
      trend: "down",
      icon: <Clock className="h-4 w-4" />,
    },
    {
      name: "Export Success Rate",
      value: 98.2,
      change: 0.8,
      trend: "up",
      icon: <CheckCircle2 className="h-4 w-4" />,
    },
    {
      name: "Data Processed (GB)",
      value: 45.6,
      change: 23.1,
      trend: "up",
      icon: <Database className="h-4 w-4" />,
    },
  ]);

  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ExportTemplate | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [dateRange, setDateRange] = useState("30d");
  const [exportFormat, setExportFormat] = useState("csv");
  const [includeCharts, setIncludeCharts] = useState(true);
  const [compressFiles, setCompressFiles] = useState(true);
  const refreshInterval = useRef<NodeJS.Timeout | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    if (autoRefresh) {
      refreshInterval.current = setInterval(() => {
        setMetrics(prev => prev.map(metric => ({
          ...metric,
          value: metric.value + (Math.random() - 0.5) * 10,
          change: (Math.random() - 0.5) * 20,
        })));
      }, 5000);
    }

    return () => {
      if (refreshInterval.current) {
        clearInterval(refreshInterval.current);
      }
    };
  }, [autoRefresh]);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const newReport: ReportData = {
        id: Date.now().toString(),
        name: `Custom Report ${Date.now()}`,
        type: "Custom",
        status: "completed",
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        size: `${(Math.random() * 5).toFixed(1)} MB`,
        format: exportFormat as "csv" | "json" | "pdf" | "excel",
      };

      setReports(prev => [newReport, ...prev]);
      setIsGenerating(false);
      
      toast({
        title: "Report Generated Successfully",
        description: "Your custom report has been generated and is ready for download.",
      });
    }, 3000);
  };

  const handleDownloadReport = (report: ReportData) => {
    toast({
      title: "Download Started",
      description: `Downloading ${report.name} in ${report.format.toUpperCase()} format.`,
    });
  };

  const handleScheduleReport = (report: ReportData) => {
    setReports(prev => prev.map(r => 
      r.id === report.id 
        ? { ...r, scheduled: true, scheduleFrequency: "weekly" as const }
        : r
    ));
    
    toast({
      title: "Report Scheduled",
      description: "The report has been scheduled for automatic generation.",
    });
  };

  const handleDeleteReport = (reportId: string) => {
    setReports(prev => prev.filter(r => r.id !== reportId));
    toast({
      title: "Report Deleted",
      description: "The report has been deleted successfully.",
    });
  };

  const handleCreateTemplate = () => {
    const newTemplate: ExportTemplate = {
      id: Date.now().toString(),
      name: `New Template ${Date.now()}`,
      description: "Custom export template",
      fields: ["Field 1", "Field 2", "Field 3"],
      format: exportFormat as "csv" | "json" | "pdf" | "excel",
      createdAt: new Date().toISOString(),
      usageCount: 0,
    };

    setTemplates(prev => [newTemplate, ...prev]);
    toast({
      title: "Template Created",
      description: "Your export template has been created successfully.",
    });
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || report.type === filterType;
    const matchesStatus = filterStatus === "all" || report.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: ReportData["status"]) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "processing": return "bg-blue-100 text-blue-800";
      case "failed": return "bg-red-100 text-red-800";
      case "scheduled": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "csv": return <FileSpreadsheet className="h-4 w-4" />;
      case "json": return <FileJson className="h-4 w-4" />;
      case "pdf": return <FileText className="h-4 w-4" />;
      case "excel": return <FileSpreadsheet className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reporting & Analytics Export</h1>
            <p className="text-gray-600 mt-2">Generate, schedule, and manage comprehensive reports and data exports</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="auto-refresh"
                checked={autoRefresh}
                onCheckedChange={setAutoRefresh}
              />
              <Label htmlFor="auto-refresh" className="text-sm">Auto Refresh</Label>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value.toLocaleString()}</p>
                  <div className="flex items-center mt-1">
                    {metric.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    ) : metric.trend === "down" ? (
                      <TrendingUp className="h-3 w-3 text-red-500 mr-1 rotate-180" />
                    ) : (
                      <div className="h-3 w-3 bg-gray-400 rounded-full mr-1" />
                    )}
                    <span className={`text-xs ${
                      metric.trend === "up" ? "text-green-500" : 
                      metric.trend === "down" ? "text-red-500" : "text-gray-500"
                    }`}>
                      {metric.change > 0 ? "+" : ""}{metric.change.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  {metric.icon}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="reports" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="space-y-6">
            {/* Report Generation Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Generate New Report</CardTitle>
                <CardDescription>Create custom reports with your preferred format and settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="report-type">Report Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="performance">Student Performance</SelectItem>
                        <SelectItem value="analytics">Grading Analytics</SelectItem>
                        <SelectItem value="submissions">Submission Summary</SelectItem>
                        <SelectItem value="usage">System Usage</SelectItem>
                        <SelectItem value="custom">Custom Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date-range">Date Range</Label>
                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7d">Last 7 days</SelectItem>
                        <SelectItem value="30d">Last 30 days</SelectItem>
                        <SelectItem value="90d">Last 90 days</SelectItem>
                        <SelectItem value="1y">Last year</SelectItem>
                        <SelectItem value="custom">Custom range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="export-format">Export Format</Label>
                    <Select value={exportFormat} onValueChange={setExportFormat}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="include-charts"
                      checked={includeCharts}
                      onCheckedChange={setIncludeCharts}
                    />
                    <Label htmlFor="include-charts">Include Charts</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="compress-files"
                      checked={compressFiles}
                      onCheckedChange={setCompressFiles}
                    />
                    <Label htmlFor="compress-files">Compress Files</Label>
                  </div>
                </div>
                <Button 
                  onClick={handleGenerateReport} 
                  disabled={isGenerating}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating Report...
                    </>
                  ) : (
                    <>
                      <FileDown className="h-4 w-4 mr-2" />
                      Generate Report
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Reports List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Generated Reports</CardTitle>
                    <CardDescription>View, download, and manage your reports</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Search reports..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 w-64"
                      />
                    </div>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Academic Performance">Academic</SelectItem>
                        <SelectItem value="Analytics">Analytics</SelectItem>
                        <SelectItem value="Submissions">Submissions</SelectItem>
                        <SelectItem value="System Logs">System</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {filteredReports.map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            {getFormatIcon(report.format)}
                          </div>
                          <div>
                            <h4 className="font-medium">{report.name}</h4>
                            <p className="text-sm text-gray-600">{report.type} • {report.size}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className={getStatusColor(report.status)}>
                                {report.status}
                              </Badge>
                              {report.scheduled && (
                                <Badge variant="outline">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {report.scheduleFrequency}
                                </Badge>
                              )}
                              <span className="text-xs text-gray-500">
                                {new Date(report.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadReport(report)}
                            disabled={report.status !== "completed"}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleScheduleReport(report)}
                          >
                            <Clock className="h-4 w-4 mr-1" />
                            Schedule
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedReport(report)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteReport(report.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Export Templates</CardTitle>
                    <CardDescription>Manage reusable export templates for consistent reporting</CardDescription>
                  </div>
                  <Button onClick={handleCreateTemplate}>
                    <FileText className="h-4 w-4 mr-2" />
                    Create Template
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templates.map((template) => (
                    <Card key={template.id} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-2 bg-green-100 rounded-lg">
                          {getFormatIcon(template.format)}
                        </div>
                        <Badge variant="outline">{template.format.toUpperCase()}</Badge>
                      </div>
                      <h4 className="font-medium mb-1">{template.name}</h4>
                      <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                      <div className="text-xs text-gray-500 mb-3">
                        <p>Fields: {template.fields.length}</p>
                        <p>Used: {template.usageCount} times</p>
                        <p>Created: {new Date(template.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <FileDown className="h-3 w-3 mr-1" />
                          Use
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Export Trends</CardTitle>
                  <CardDescription>Report generation and download trends over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Export trends chart</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Format Distribution</CardTitle>
                  <CardDescription>Most used export formats</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Format distribution chart</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Popular Report Types</CardTitle>
                  <CardDescription>Most frequently generated report types</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Student Performance", count: 342, percentage: 85 },
                      { name: "Grading Analytics", count: 256, percentage: 64 },
                      { name: "Submission Summary", count: 189, percentage: 47 },
                      { name: "System Usage", count: 145, percentage: 36 },
                    ].map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{item.name}</span>
                          <span className="text-sm text-gray-600">{item.count} reports</span>
                        </div>
                        <Progress value={item.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Processing Performance</CardTitle>
                  <CardDescription>Average processing times and success rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">Success Rate</p>
                          <p className="text-sm text-gray-600">Last 30 days</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-green-600">98.2%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">Avg Processing Time</p>
                          <p className="text-sm text-gray-600">Per report</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-blue-600">2.4s</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Activity className="h-5 w-5 text-purple-600" />
                        <div>
                          <p className="font-medium">Daily Reports</p>
                          <p className="text-sm text-gray-600">Average</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-purple-600">47</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Export Settings</CardTitle>
                  <CardDescription>Configure default export preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="default-format">Default Export Format</Label>
                    <Select defaultValue="csv">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="compression">Compression Level</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Compression</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="auto-include-charts" defaultChecked />
                    <Label htmlFor="auto-include-charts">Auto-include charts in PDF exports</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="encrypt-exports" />
                    <Label htmlFor="encrypt-exports">Encrypt sensitive exports</Label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Scheduling Settings</CardTitle>
                  <CardDescription>Configure automated report generation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="enable-scheduling" defaultChecked />
                    <Label htmlFor="enable-scheduling">Enable report scheduling</Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="default-frequency">Default Frequency</Label>
                    <Select defaultValue="weekly">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="retention-period">Report Retention Period</Label>
                    <Select defaultValue="90d">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30d">30 days</SelectItem>
                        <SelectItem value="90d">90 days</SelectItem>
                        <SelectItem value="180d">180 days</SelectItem>
                        <SelectItem value="1y">1 year</SelectItem>
                        <SelectItem value="never">Never delete</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="email-notifications" defaultChecked />
                    <Label htmlFor="email-notifications">Email notifications for completed reports</Label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Settings</CardTitle>
                  <CardDescription>Optimize export performance and resource usage</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="max-concurrent">Max Concurrent Exports</Label>
                    <Select defaultValue="3">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeout">Export Timeout (seconds)</Label>
                    <Select defaultValue="300">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="60">60</SelectItem>
                        <SelectItem value="300">300</SelectItem>
                        <SelectItem value="600">600</SelectItem>
                        <SelectItem value="1800">1800</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="caching" defaultChecked />
                    <Label htmlFor="caching">Enable export caching</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="background-processing" defaultChecked />
                    <Label htmlFor="background-processing">Background processing</Label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Configure security and access controls</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="access-logs" defaultChecked />
                    <Label htmlFor="access-logs">Log export access</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="role-restriction" defaultChecked />
                    <Label htmlFor="role-restriction">Restrict by user role</Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="data-masking">Data Masking Level</Label>
                    <Select defaultValue="partial">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No masking</SelectItem>
                        <SelectItem value="partial">Partial masking</SelectItem>
                        <SelectItem value="full">Full masking</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="audit-trail" defaultChecked />
                    <Label htmlFor="audit-trail">Enable audit trail</Label>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ReportingAnalyticsExport;
