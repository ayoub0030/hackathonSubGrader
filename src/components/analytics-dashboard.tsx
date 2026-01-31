import { useState, useEffect } from "react";
import { TrendingUp, Users, FileText, Clock, Award, Target, BarChart3, PieChart, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AnalyticsData {
  totalEssays: number;
  totalStudents: number;
  avgGrade: number;
  totalTimeSaved: number;
  weeklyActivity: number[];
  gradeDistribution: { grade: string; count: number; color: string }[];
  topSubjects: { subject: string; count: number }[];
  recentActivity: { action: string; time: string; user: string }[];
}

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setData({
        totalEssays: 1247,
        totalStudents: 342,
        avgGrade: 85.3,
        totalTimeSaved: 156,
        weeklyActivity: [45, 52, 38, 65, 72, 58, 61],
        gradeDistribution: [
          { grade: "A", count: 423, color: "bg-green-500" },
          { grade: "B", count: 512, color: "bg-blue-500" },
          { grade: "C", count: 256, color: "bg-yellow-500" },
          { grade: "D", count: 56, color: "bg-orange-500" },
          { grade: "F", count: 0, color: "bg-red-500" }
        ],
        topSubjects: [
          { subject: "English Literature", count: 342 },
          { subject: "History", count: 276 },
          { subject: "Science", count: 234 },
          { subject: "Mathematics", count: 189 },
          { subject: "Social Studies", count: 206 }
        ],
        recentActivity: [
          { action: "Graded 15 essays", time: "2 minutes ago", user: "Ms. Johnson" },
          { action: "Created new rubric", time: "15 minutes ago", user: "Dr. Chen" },
          { action: "Exported results", time: "1 hour ago", user: "Mr. Smith" },
          { action: "Batch grading completed", time: "2 hours ago", user: "Prof. Davis" }
        ]
      });
      setIsLoading(false);
    };

    loadData();
  }, [timeRange]);

  if (isLoading || !data) {
    return <AnalyticsSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Track your grading performance and insights</p>
        </div>
        <div className="flex gap-2">
          {(["week", "month", "year"] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Essays"
          value={data.totalEssays.toLocaleString()}
          change="+12.5%"
          icon={<FileText className="h-5 w-5" />}
          color="text-blue-600"
          bgColor="bg-blue-100"
        />
        <MetricCard
          title="Students"
          value={data.totalStudents.toLocaleString()}
          change="+8.2%"
          icon={<Users className="h-5 w-5" />}
          color="text-green-600"
          bgColor="bg-green-100"
        />
        <MetricCard
          title="Average Grade"
          value={`${data.avgGrade}%`}
          change="+2.1%"
          icon={<Award className="h-5 w-5" />}
          color="text-purple-600"
          bgColor="bg-purple-100"
        />
        <MetricCard
          title="Time Saved"
          value={`${data.totalTimeSaved}h`}
          change="+18.7%"
          icon={<Clock className="h-5 w-5" />}
          color="text-orange-600"
          bgColor="bg-orange-100"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Weekly Activity</h3>
          </div>
          <div className="space-y-3">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
              <div key={day} className="flex items-center gap-3">
                <span className="text-sm w-8">{day}</span>
                <div className="flex-1">
                  <Progress value={(data.weeklyActivity[index] / 80) * 100} className="h-2" />
                </div>
                <span className="text-sm w-8 text-right">{data.weeklyActivity[index]}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Grade Distribution */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Grade Distribution</h3>
          </div>
          <div className="space-y-3">
            {data.gradeDistribution.map((grade) => {
              const percentage = (grade.count / data.totalEssays) * 100;
              return (
                <div key={grade.grade} className="flex items-center gap-3">
                  <div className="flex items-center gap-2 w-12">
                    <div className={`h-3 w-3 rounded-full ${grade.color}`} />
                    <span className="text-sm font-medium">{grade.grade}</span>
                  </div>
                  <div className="flex-1">
                    <Progress value={percentage} className="h-2" />
                  </div>
                  <span className="text-sm w-12 text-right">{grade.count}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Top Subjects & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Subjects */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Top Subjects</h3>
          </div>
          <div className="space-y-3">
            {data.topSubjects.map((subject, index) => (
              <div key={subject.subject} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">
                    {index + 1}
                  </Badge>
                  <span className="text-sm">{subject.subject}</span>
                </div>
                <span className="text-sm font-medium">{subject.count} essays</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Recent Activity</h3>
          </div>
          <div className="space-y-3">
            {data.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-b-0">
                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                <div className="flex-1">
                  <p className="text-sm">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({ 
  title, 
  value, 
  change, 
  icon, 
  color, 
  bgColor 
}: {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${bgColor}`}>
          <div className={color}>{icon}</div>
        </div>
        <Badge variant="outline" className="text-green-600 border-green-600">
          {change}
        </Badge>
      </div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
    </Card>
  );
}

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-muted rounded animate-pulse" />
          <div className="h-4 w-64 bg-muted rounded animate-pulse" />
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-16 bg-muted rounded animate-pulse" />
          <div className="h-8 w-16 bg-muted rounded animate-pulse" />
          <div className="h-8 w-16 bg-muted rounded animate-pulse" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 bg-muted rounded-lg animate-pulse" />
                <div className="h-6 w-16 bg-muted rounded animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-8 w-24 bg-muted rounded animate-pulse" />
                <div className="h-4 w-32 bg-muted rounded animate-pulse" />
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Card key={i} className="p-6">
            <div className="space-y-4">
              <div className="h-5 w-32 bg-muted rounded animate-pulse" />
              {[1, 2, 3, 4, 5].map((j) => (
                <div key={j} className="flex items-center gap-3">
                  <div className="h-4 w-8 bg-muted rounded animate-pulse" />
                  <div className="flex-1 h-2 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-8 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
