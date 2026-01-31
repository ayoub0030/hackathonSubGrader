import { useState } from "react";
import { Search, Book, Video, FileText, HelpCircle, ChevronRight, ExternalLink, Download, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface HelpArticle {
  id: string;
  title: string;
  category: string;
  content: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  readTime: number;
  lastUpdated: string;
}

interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  category: string;
}

interface FAQ {
  question: string;
  answer: string;
  category: string;
  helpful: number;
}

export function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("articles");

  const articles: HelpArticle[] = [
    {
      id: "getting-started",
      title: "Getting Started with CoTeacher",
      category: "Basics",
      content: "Learn how to set up your account and start grading your first essay...",
      difficulty: "beginner",
      readTime: 5,
      lastUpdated: "2026-01-15"
    },
    {
      id: "batch-grading",
      title: "Batch Grading Guide",
      category: "Advanced",
      content: "Master the art of grading multiple essays efficiently...",
      difficulty: "intermediate",
      readTime: 8,
      lastUpdated: "2026-01-20"
    },
    {
      id: "rubric-creation",
      title: "Creating Custom Rubrics",
      category: "Customization",
      content: "Design personalized rubrics that match your grading criteria...",
      difficulty: "advanced",
      readTime: 12,
      lastUpdated: "2026-01-18"
    },
    {
      id: "data-export",
      title: "Exporting and Analyzing Results",
      category: "Analytics",
      content: "Learn how to export grading data and analyze student performance...",
      difficulty: "intermediate",
      readTime: 6,
      lastUpdated: "2026-01-22"
    }
  ];

  const videos: VideoTutorial[] = [
    {
      id: "intro-video",
      title: "CoTeacher Introduction",
      description: "A comprehensive overview of all CoTeacher features",
      duration: "5:30",
      thumbnail: "/api/placeholder/320/180",
      category: "Overview"
    },
    {
      id: "essay-grading",
      title: "Essay Grading Workflow",
      description: "Step-by-step guide to grading individual essays",
      duration: "3:45",
      thumbnail: "/api/placeholder/320/180",
      category: "Tutorial"
    },
    {
      id: "batch-processing",
      title: "Batch Processing Tutorial",
      description: "Learn how to grade multiple essays at once",
      duration: "7:20",
      thumbnail: "/api/placeholder/320/180",
      category: "Advanced"
    }
  ];

  const faqs: FAQ[] = [
    {
      question: "How accurate is the AI grading?",
      answer: "Our AI grading system achieves 95% accuracy compared to human graders. The accuracy varies by subject and rubric complexity.",
      category: "General",
      helpful: 245
    },
    {
      question: "Can I customize the grading criteria?",
      answer: "Yes! CoTeacher allows you to create custom rubrics with specific criteria and weightings for your needs.",
      category: "Features",
      helpful: 189
    },
    {
      question: "Is my data secure and private?",
      answer: "Absolutely. All data is encrypted and stored securely. We never share student essays or personal information without consent.",
      category: "Privacy",
      helpful: 312
    },
    {
      question: "What file formats are supported?",
      answer: "CoTeacher supports PDF, DOC, DOCX, TXT files, as well as image files (JPG, PNG) for handwritten essays.",
      category: "Technical",
      helpful: 156
    }
  ];

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Help Center</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Find answers, tutorials, and guides to make the most of CoTeacher
        </p>
        
        {/* Search Bar */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for help articles, videos, or FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Book className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium">Documentation</h3>
              <p className="text-sm text-muted-foreground">In-depth guides</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Video className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium">Video Tutorials</h3>
              <p className="text-sm text-muted-foreground">Visual learning</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium">API Docs</h3>
              <p className="text-sm text-muted-foreground">Developer resources</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <HelpCircle className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-medium">Support</h3>
              <p className="text-sm text-muted-foreground">Get help from our team</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="videos">Video Tutorials</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        {/* Articles Tab */}
        <TabsContent value="articles" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className={getDifficultyColor(article.difficulty)}>
                      {article.difficulty}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{article.readTime} min read</span>
                  </div>
                  
                  <h3 className="font-semibold text-lg">{article.title}</h3>
                  <p className="text-muted-foreground line-clamp-2">{article.content}</p>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{article.category}</Badge>
                    <Button variant="ghost" size="sm">
                      Read more
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Videos Tab */}
        <TabsContent value="videos" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <Card key={video.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                <div className="aspect-video bg-muted relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-12 w-12 bg-black/50 rounded-full flex items-center justify-center">
                      <ChevronRight className="h-6 w-6 text-white ml-1" />
                    </div>
                  </div>
                  <Badge className="absolute top-2 right-2" variant="secondary">
                    {video.duration}
                  </Badge>
                </div>
                
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold">{video.title}</h3>
                  <p className="text-sm text-muted-foreground">{video.description}</p>
                  <Badge variant="outline">{video.category}</Badge>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-4">
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <Card key={index} className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-lg">{faq.question}</h3>
                    <Badge variant="outline">{faq.category}</Badge>
                  </div>
                  <p className="text-muted-foreground">{faq.answer}</p>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-muted-foreground">{faq.helpful} found this helpful</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">👍 Helpful</Button>
                      <Button variant="ghost" size="sm">👎 Not helpful</Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Contact Support */}
      <Card className="p-6 bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Still need help?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our support team is here to help you succeed with CoTeacher. Reach out anytime!
          </p>
          <div className="flex gap-4 justify-center">
            <Button>
              <HelpCircle className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
            <Button variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              Community Forum
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
