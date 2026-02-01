import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Users, 
  UserPlus, 
  UserCheck, 
  Search, 
  MoreVertical, 
  Calendar, 
  MapPin, 
  Shield, 
  Award, 
  Activity, 
  TrendingUp, 
  Edit, 
  Trash2, 
  Eye, 
  Download, 
  RefreshCw,
  Crown,
  BarChart3,
  PieChart,
  Mail,
  Clock,
  Pause,
  CheckCircle2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "instructor" | "student" | "ta";
  status: "active" | "inactive" | "suspended" | "pending";
  joinDate: string;
  lastActive: string;
  courses: number;
  averageGrade: number;
  location: string;
  department?: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@university.edu",
      role: "instructor",
      status: "active",
      joinDate: "2023-01-15T00:00:00Z",
      lastActive: "2024-01-15T14:30:00Z",
      courses: 4,
      averageGrade: 92.5,
      location: "New York, USA",
      department: "Computer Science",
    },
    {
      id: "2",
      name: "Michael Chen",
      email: "michael.chen@university.edu",
      role: "student",
      status: "active",
      joinDate: "2023-09-01T00:00:00Z",
      lastActive: "2024-01-15T16:45:00Z",
      courses: 6,
      averageGrade: 88.3,
      location: "San Francisco, USA",
      department: "Computer Science",
    },
    {
      id: "3",
      name: "Prof. James Wilson",
      email: "james.wilson@university.edu",
      role: "admin",
      status: "active",
      joinDate: "2022-08-20T00:00:00Z",
      lastActive: "2024-01-15T09:15:00Z",
      courses: 8,
      averageGrade: 95.2,
      location: "Boston, USA",
      department: "Information Technology",
    },
    {
      id: "4",
      name: "Emily Rodriguez",
      email: "emily.rodriguez@university.edu",
      role: "ta",
      status: "inactive",
      joinDate: "2023-10-10T00:00:00Z",
      lastActive: "2024-01-10T11:20:00Z",
      courses: 3,
      averageGrade: 91.7,
      location: "Austin, USA",
      department: "Mathematics",
    },
    {
      id: "5",
      name: "David Kim",
      email: "david.kim@university.edu",
      role: "student",
      status: "suspended",
      joinDate: "2023-02-28T00:00:00Z",
      lastActive: "2024-01-05T08:45:00Z",
      courses: 4,
      averageGrade: 76.8,
      location: "Seattle, USA",
      department: "Business Administration",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const refreshInterval = useRef<NodeJS.Timeout | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    if (autoRefresh) {
      refreshInterval.current = setInterval(() => {
        setUsers(prev => prev.map(user => ({
          ...user,
          lastActive: new Date().toISOString()
        })));
      }, 5000);
    }

    return () => {
      if (refreshInterval.current) {
        clearInterval(refreshInterval.current);
      }
    };
  }, [autoRefresh]);

  const handleCreateUser = () => {
    setIsCreatingUser(true);
    
    setTimeout(() => {
      const newUser: User = {
        id: Date.now().toString(),
        name: "New User",
        email: `newuser${Date.now()}@university.edu`,
        role: "student",
        status: "pending",
        joinDate: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        courses: 0,
        averageGrade: 0,
        location: "Unknown",
      };

      setUsers(prev => [newUser, ...prev]);
      setIsCreatingUser(false);
      
      toast({
        title: "User Created Successfully",
        description: "New user account has been created and is pending verification.",
      });
    }, 2000);
  };

  const handleUpdateUserStatus = (userId: string, status: User["status"]) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status } : user
    ));
    
    toast({
      title: "User Status Updated",
      description: `User status has been changed to ${status}.`,
    });
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    
    toast({
      title: "User Deleted",
      description: "User account has been permanently deleted.",
    });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "email":
        return a.email.localeCompare(b.email);
      case "role":
        return a.role.localeCompare(b.role);
      case "status":
        return a.status.localeCompare(b.status);
      case "joinDate":
        return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
      case "lastActive":
        return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
      default:
        return 0;
    }
  });

  const getStatusColor = (status: User["status"]) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      case "suspended": return "bg-red-100 text-red-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role: User["role"]) => {
    switch (role) {
      case "admin": return "bg-purple-100 text-purple-800";
      case "instructor": return "bg-blue-100 text-blue-800";
      case "ta": return "bg-green-100 text-green-800";
      case "student": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleIcon = (role: User["role"]) => {
    switch (role) {
      case "admin": return <Crown className="h-4 w-4" />;
      case "instructor": return <UserCheck className="h-4 w-4" />;
      case "ta": return <Users className="h-4 w-4" />;
      case "student": return <Users className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return "Active now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffHours < 168) return `${Math.floor(diffHours / 24)}d ago`;
    return formatDate(dateString);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-2">Manage users, roles, and access control</p>
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
            <Button onClick={handleCreateUser} disabled={isCreatingUser}>
              {isCreatingUser ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-500">+12.5%</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.status === "active").length}
                </p>
                <div className="flex items-center mt-1">
                  <Activity className="h-3 w-3 text-blue-500 mr-1" />
                  <span className="text-xs text-gray-500">
                    {((users.filter(u => u.status === "active").length / users.length) * 100).toFixed(1)}% of total
                  </span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Instructors</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.role === "instructor").length}
                </p>
                <div className="flex items-center mt-1">
                  <Award className="h-3 w-3 text-purple-500 mr-1" />
                  <span className="text-xs text-purple-500">Teaching staff</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Students</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.role === "student").length}
                </p>
                <div className="flex items-center mt-1">
                  <BarChart3 className="h-3 w-3 text-orange-500 mr-1" />
                  <span className="text-xs text-orange-500">Enrolled</span>
                </div>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            {/* User Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search users by name, email, or department..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="instructor">Instructor</SelectItem>
                      <SelectItem value="ta">Teaching Assistant</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="role">Role</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                      <SelectItem value="joinDate">Join Date</SelectItem>
                      <SelectItem value="lastActive">Last Active</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Users List */}
            <Card>
              <CardHeader>
                <CardTitle>User Directory</CardTitle>
                <CardDescription>Manage and monitor all user accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {sortedUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium">{user.name}</h4>
                              <Badge className={getRoleColor(user.role)}>
                                {getRoleIcon(user.role)}
                                <span className="ml-1">{user.role}</span>
                              </Badge>
                              <Badge className={getStatusColor(user.status)}>
                                {user.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                              <span className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {user.location}
                              </span>
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                Joined {formatDate(user.joinDate)}
                              </span>
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {formatLastActive(user.lastActive)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <div className="relative group">
                            <Button variant="outline" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                              <div className="py-1">
                                <button
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
                                  onClick={() => handleUpdateUserStatus(user.id, "active")}
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                                  Activate
                                </button>
                                <button
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
                                  onClick={() => handleUpdateUserStatus(user.id, "suspended")}
                                >
                                  <Pause className="h-4 w-4 mr-2 text-yellow-500" />
                                  Suspend
                                </button>
                                <button
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
                                  onClick={() => handleDeleteUser(user.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Growth Trends</CardTitle>
                  <CardDescription>User registration and activity over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">User growth chart</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Role Distribution</CardTitle>
                  <CardDescription>Breakdown of users by role</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Role distribution chart</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Performers</CardTitle>
                  <CardDescription>Students with highest grades</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users
                      .filter(user => user.role === "student")
                      .sort((a, b) => b.averageGrade - a.averageGrade)
                      .slice(0, 5)
                      .map((user, index) => (
                        <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-gray-600">{user.courses} courses</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{user.averageGrade.toFixed(1)}%</p>
                            <p className="text-xs text-gray-500">Avg Grade</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Activity Metrics</CardTitle>
                  <CardDescription>User engagement statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Activity className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">Daily Active Users</p>
                          <p className="text-sm text-gray-600">Last 24 hours</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-blue-600">
                        {users.filter(u => u.status === "active").length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">Avg Engagement</p>
                          <p className="text-sm text-gray-600">Platform-wide</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-green-600">87.3%</span>
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
                  <CardTitle>User Settings</CardTitle>
                  <CardDescription>Configure user management preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="email-verification" defaultChecked />
                    <Label htmlFor="email-verification">Require email verification</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="two-factor" />
                    <Label htmlFor="two-factor">Require two-factor authentication</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="auto-activate" />
                    <Label htmlFor="auto-activate">Auto-activate new users</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="welcome-email" defaultChecked />
                    <Label htmlFor="welcome-email">Send welcome emails</Label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage security policies</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="session-timeout" defaultChecked />
                    <Label htmlFor="session-timeout">Enable session timeout</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="failed-login" defaultChecked />
                    <Label htmlFor="failed-login">Track failed login attempts</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="password-policy" defaultChecked />
                    <Label htmlFor="password-policy">Enforce strong passwords</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="audit-logs" defaultChecked />
                    <Label htmlFor="audit-logs">Enable audit logs</Label>
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

export default UserManagement;
