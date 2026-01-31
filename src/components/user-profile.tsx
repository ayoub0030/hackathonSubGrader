import { useState, useEffect } from "react";
import { Trophy, Star, Target, Award, TrendingUp, Calendar, BookOpen, Users, Zap, Medal, Crown, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  points: number;
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

interface UserStats {
  totalEssaysGraded: number;
  totalTimeSaved: number;
  averageGrade: number;
  streak: number;
  level: number;
  experience: number;
  experienceToNext: number;
  rank: string;
  totalPoints: number;
}

export function UserProfile() {
  const [userStats, setUserStats] = useState<UserStats>({
    totalEssaysGraded: 1247,
    totalTimeSaved: 156,
    averageGrade: 85.3,
    streak: 12,
    level: 15,
    experience: 3450,
    experienceToNext: 4000,
    rank: "Expert Grader",
    totalPoints: 2840
  });

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "first-essay",
      title: "First Steps",
      description: "Grade your first essay",
      icon: <BookOpen className="h-6 w-6" />,
      category: "Milestones",
      points: 50,
      unlocked: true,
      unlockedAt: new Date("2026-01-15")
    },
    {
      id: "speed-demon",
      title: "Speed Demon",
      description: "Grade 10 essays in one hour",
      icon: <Zap className="h-6 w-6" />,
      category: "Speed",
      points: 100,
      unlocked: true,
      unlockedAt: new Date("2026-01-20")
    },
    {
      id: "consistency-king",
      title: "Consistency King",
      description: "Maintain a 7-day grading streak",
      icon: <Calendar className="h-6 w-6" />,
      category: "Consistency",
      points: 150,
      unlocked: true,
      unlockedAt: new Date("2026-01-25")
    },
    {
      id: "centurion",
      title: "Centurion",
      description: "Grade 100 essays total",
      icon: <Trophy className="h-6 w-6" />,
      category: "Milestones",
      points: 200,
      unlocked: true,
      unlockedAt: new Date("2026-01-28")
    },
    {
      id: "quality-master",
      title: "Quality Master",
      description: "Achieve 90% average grade over 50 essays",
      icon: <Star className="h-6 w-6" />,
      category: "Quality",
      points: 250,
      unlocked: false,
      progress: 45,
      maxProgress: 50
    },
    {
      id: "time-saver",
      title: "Time Saver",
      description: "Save 100 hours of grading time",
      icon: <Clock className="h-6 w-6" />,
      category: "Impact",
      points: 300,
      unlocked: false,
      progress: 156,
      maxProgress: 100
    },
    {
      id: "mentor",
      title: "Mentor",
      description: "Help 5 other teachers get started",
      icon: <Users className="h-6 w-6" />,
      category: "Community",
      points: 200,
      unlocked: false,
      progress: 2,
      maxProgress: 5
    },
    {
      id: "perfectionist",
      title: "Perfectionist",
      description: "Grade 1000 essays with 95%+ accuracy",
      icon: <Target className="h-6 w-6" />,
      category: "Quality",
      points: 500,
      unlocked: false,
      progress: 247,
      maxProgress: 1000
    }
  ]);

  const getRankIcon = (rank: string) => {
    switch (rank) {
      case "Expert Grader": return <Crown className="h-8 w-8 text-yellow-500" />;
      case "Master Grader": return <Medal className="h-8 w-8 text-purple-500" />;
      case "Senior Grader": return <Award className="h-8 w-8 text-blue-500" />;
      default: return <Trophy className="h-8 w-8 text-green-500" />;
    }
  };

  const getRankColor = (rank: string) => {
    switch (rank) {
      case "Expert Grader": return "text-yellow-600 bg-yellow-100";
      case "Master Grader": return "text-purple-600 bg-purple-100";
      case "Senior Grader": return "text-blue-600 bg-blue-100";
      default: return "text-green-600 bg-green-100";
    }
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const totalAchievementPoints = achievements.reduce((sum, a) => sum + (a.unlocked ? a.points : 0), 0);

  const categories = ["All", "Milestones", "Speed", "Consistency", "Quality", "Impact", "Community"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredAchievements = selectedCategory === "All" 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card className="p-8 bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-foreground">SJ</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Dr. Sarah Johnson</h1>
              <div className="flex items-center gap-3">
                <Badge className={getRankColor(userStats.rank)}>
                  {getRankIcon(userStats.rank)}
                  <span className="ml-2">{userStats.rank}</span>
                </Badge>
                <Badge variant="outline">Level {userStats.level}</Badge>
              </div>
              <p className="text-muted-foreground mt-2">English Professor • State University</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">{userStats.totalPoints}</div>
            <p className="text-sm text-muted-foreground">Total Points</p>
          </div>
        </div>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <span className="text-sm text-muted-foreground">Essays Graded</span>
          </div>
          <div className="text-2xl font-bold">{userStats.totalEssaysGraded.toLocaleString()}</div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="h-5 w-5 text-green-600" />
            <span className="text-sm text-muted-foreground">Time Saved</span>
          </div>
          <div className="text-2xl font-bold">{userStats.totalTimeSaved}h</div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <span className="text-sm text-muted-foreground">Avg Grade</span>
          </div>
          <div className="text-2xl font-bold">{userStats.averageGrade}%</div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="h-5 w-5 text-orange-600" />
            <span className="text-sm text-muted-foreground">Current Streak</span>
          </div>
          <div className="text-2xl font-bold">{userStats.streak} days</div>
        </Card>
      </div>

      {/* Level Progress */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Level Progress</h2>
          <Badge variant="outline">Level {userStats.level}</Badge>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Experience</span>
            <span>{userStats.experience} / {userStats.experienceToNext} XP</span>
          </div>
          <Progress value={(userStats.experience / userStats.experienceToNext) * 100} className="h-3" />
          <p className="text-sm text-muted-foreground">
            {userStats.experienceToNext - userStats.experience} XP to next level
          </p>
        </div>
      </Card>

      {/* Achievements */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Achievements</h2>
          <div className="flex gap-2">
            <Badge variant="outline">{unlockedAchievements.length}/{achievements.length} Unlocked</Badge>
            <Badge variant="outline">{totalAchievementPoints} Points</Badge>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Achievement Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAchievements.map((achievement) => (
            <Card 
              key={achievement.id} 
              className={`p-6 transition-all duration-300 ${
                achievement.unlocked 
                  ? "bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20" 
                  : "opacity-60"
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg ${
                    achievement.unlocked ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                  }`}>
                    {achievement.icon}
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-primary">+{achievement.points}</div>
                    <div className="text-xs text-muted-foreground">points</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold">{achievement.title}</h3>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{achievement.category}</Badge>
                  {achievement.unlocked ? (
                    <div className="text-xs text-green-600">
                      ✓ Unlocked {achievement.unlockedAt?.toLocaleDateString()}
                    </div>
                  ) : (
                    <div className="flex-1">
                      {achievement.progress !== undefined && achievement.maxProgress && (
                        <div className="space-y-1">
                          <Progress 
                            value={(achievement.progress / achievement.maxProgress) * 100} 
                            className="h-2" 
                          />
                          <div className="text-xs text-muted-foreground text-right">
                            {achievement.progress}/{achievement.maxProgress}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Leaderboard Preview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Leaderboard</h2>
          <Button variant="outline" size="sm">View Full Leaderboard</Button>
        </div>
        
        <div className="space-y-4">
          {[
            { rank: 1, name: "Dr. Michael Chen", points: 3420, level: 18 },
            { rank: 2, name: "Prof. Emily Rodriguez", points: 3150, level: 17 },
            { rank: 3, name: "Dr. Sarah Johnson", points: 2840, level: 15 },
            { rank: 4, name: "Mr. James Thompson", points: 2690, level: 14 },
            { rank: 5, name: "Dr. Lisa Wang", points: 2450, level: 13 }
          ].map((user) => (
            <div key={user.rank} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  user.rank === 1 ? "bg-yellow-500 text-white" :
                  user.rank === 2 ? "bg-gray-400 text-white" :
                  user.rank === 3 ? "bg-orange-600 text-white" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {user.rank}
                </div>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-muted-foreground">Level {user.level}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-primary">{user.points}</div>
                <div className="text-sm text-muted-foreground">points</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
