import { useState } from "react";
import { Code, Copy, Globe, Key, Database, Shield, Search, BookOpen, ExternalLink, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

export function APIDocumentation() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [copiedCode, setCopiedCode] = useState("");

  const categories = ["All", "Grading", "Batch Grading", "Results", "Analytics", "Rubrics", "User Management"];
  
  const endpoints = [
    {
      method: "POST",
      path: "/api/v1/essays/grade",
      description: "Grade an essay using AI analysis",
      category: "Grading",
      auth: false,
      example: JSON.stringify({
        essay: "In William Shakespeare's Romeo and Juliet...",
        gradeLevel: "high-school",
        rubricType: "argumentative",
        studentName: "John Smith"
      }, null, 2)
    },
    {
      method: "GET",
      path: "/api/v1/essays/{id}",
      description: "Retrieve grading results for a specific essay",
      category: "Results",
      auth: false,
      example: JSON.stringify({
        id: "grade_123",
        overall_assessment: {
          total_score: 85,
          total_max_score: 100,
          letter_grade: "B"
        }
      }, null, 2)
    },
    {
      method: "POST",
      path: "/api/v1/batch/grade",
      description: "Grade multiple essays in a single request",
      category: "Batch Grading",
      auth: true,
      example: JSON.stringify({
        essays: [
          {
            essay: "First essay content...",
            gradeLevel: "college",
            rubricType: "research"
          }
        ]
      }, null, 2)
    }
  ];

  const filteredEndpoints = endpoints.filter(endpoint => 
    selectedCategory === "All" || endpoint.category === selectedCategory
  ).filter(endpoint =>
    endpoint.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
    endpoint.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast({
      title: "Code copied!",
      description: "The code has been copied to your clipboard.",
    });
    setTimeout(() => setCopiedCode(""), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">API Documentation</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Complete API reference for CoTeacher grading services
        </p>
        
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search endpoints, methods, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* API Overview */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold">Base URL</h3>
            </div>
            <code className="p-2 bg-muted rounded text-sm">
              https://api.coteacher.ai
            </code>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold">Authentication</h3>
            </div>
            <div className="space-y-1">
              <Badge variant="outline">Bearer Token Required</Badge>
              <p className="text-sm text-muted-foreground">
                Include Authorization: Bearer YOUR_TOKEN in headers
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold">Rate Limiting</h3>
            </div>
            <div className="space-y-1">
              <Badge variant="outline">100 requests/hour</Badge>
              <p className="text-sm text-muted-foreground">
                Per authenticated user
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-orange-600" />
              <h3 className="font-semibold">Data Format</h3>
            </div>
            <div className="space-y-1">
              <Badge variant="outline">JSON</Badge>
              <p className="text-sm text-muted-foreground">
                All responses use JSON format
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Endpoints */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Endpoints</h2>
        <div className="space-y-4">
          {filteredEndpoints.map((endpoint, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Badge variant={endpoint.method === "GET" ? "default" : "secondary"}>
                      {endpoint.method}
                    </Badge>
                    <div>
                      <h3 className="font-semibold font-mono">{endpoint.path}</h3>
                      <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{endpoint.category}</Badge>
                    {endpoint.auth && (
                      <Badge variant="destructive">
                        <Key className="h-3 w-3 mr-1" />
                        Auth Required
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Example */}
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Example Request</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Code className="h-4 w-4" />
                      <span>Content-Type: application/json</span>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <pre className="text-xs overflow-x-auto">
                        <code>{endpoint.example}</code>
                      </pre>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(endpoint.example)}
                        className="mt-2"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        {copiedCode === endpoint.example ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* SDK Information */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">SDKs & Libraries</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              JavaScript SDK
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Official JavaScript library for CoTeacher API integration
            </p>
            <div className="space-y-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download npm Package
              </Button>
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                View on GitHub
              </Button>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <pre className="text-xs overflow-x-auto">
                <code>{`npm install @coteacher/sdk`}</code>
              </pre>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Code className="h-5 w-5" />
              Python SDK
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Python library for seamless integration with your applications
            </p>
            <div className="space-y-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download pip Package
              </Button>
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                View on PyPI
              </Button>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <pre className="text-xs overflow-x-auto">
                <code>{`pip install coteacher-sdk`}</code>
              </pre>
            </div>
          </div>
        </div>
      </Card>

      {/* Support */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">Need Help?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our API documentation and support team are here to help you succeed
          </p>
          <div className="flex gap-4 justify-center">
            <Button>
              <BookOpen className="h-4 w-4 mr-2" />
              View Full Documentation
            </Button>
            <Button variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              API Support
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
