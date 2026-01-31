import { useState } from "react";
import { MessageSquare, ThumbsUp, ThumbsDown, Send, Star, Bug, Lightbulb, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

interface Feedback {
  id: string;
  type: "bug" | "feature" | "general" | "compliment";
  title: string;
  description: string;
  category: string;
  priority: "low" | "medium" | "high";
  rating?: number;
  timestamp: Date;
  status: "pending" | "reviewed" | "resolved";
}

export function FeedbackSystem() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackType, setFeedbackType] = useState<Feedback["type"]>("general");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState<Feedback["priority"]>("medium");
  const [rating, setRating] = useState(0);

  const feedbackTypes = [
    { value: "bug", label: "Bug Report", icon: <Bug className="h-4 w-4" />, color: "text-red-600" },
    { value: "feature", label: "Feature Request", icon: <Lightbulb className="h-4 w-4" />, color: "text-blue-600" },
    { value: "general", label: "General Feedback", icon: <MessageSquare className="h-4 w-4" />, color: "text-gray-600" },
    { value: "compliment", label: "Compliment", icon: <Heart className="h-4 w-4" />, color: "text-pink-600" }
  ];

  const categories = {
    bug: ["UI/UX", "Performance", "Functionality", "Security", "Other"],
    feature: ["Grading", "Analytics", "User Interface", "Integration", "Other"],
    general: ["General", "Documentation", "Support", "Other"],
    compliment: ["Overall Experience", "Specific Feature", "Customer Support", "Other"]
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const feedback: Feedback = {
      id: Date.now().toString(),
      type: feedbackType,
      title,
      description,
      category,
      priority,
      rating: feedbackType === "compliment" ? rating : undefined,
      timestamp: new Date(),
      status: "pending"
    };

    console.log("Feedback submitted:", feedback);

    // Reset form
    setTitle("");
    setDescription("");
    setCategory("");
    setPriority("medium");
    setRating(0);

    setIsSubmitting(false);

    toast({
      title: "Feedback submitted!",
      description: "Thank you for helping us improve CoTeacher.",
    });
  };

  const currentType = feedbackTypes.find(t => t.value === feedbackType);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Share Your Feedback</h1>
        <p className="text-muted-foreground">
          Help us improve CoTeacher by sharing your thoughts, ideas, and experiences
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Feedback Type Selection */}
          <div>
            <Label className="text-base font-medium mb-4 block">What type of feedback would you like to share?</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {feedbackTypes.map((type) => (
                <Button
                  key={type.value}
                  type="button"
                  variant={feedbackType === type.value ? "default" : "outline"}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => setFeedbackType(type.value as Feedback["type"])}
                >
                  <div className={feedbackType === type.value ? "text-primary-foreground" : type.color}>
                    {type.icon}
                  </div>
                  <span className="text-sm">{type.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Brief summary of your feedback"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories[feedbackType as keyof typeof categories]?.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Please provide detailed information about your feedback..."
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Priority (for bugs and features) */}
          {(feedbackType === "bug" || feedbackType === "feature") && (
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(value: "low" | "medium" | "high") => setPriority(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - Minor issue or nice-to-have</SelectItem>
                  <SelectItem value="medium">Medium - Affects usability but not blocking</SelectItem>
                  <SelectItem value="high">High - Critical issue or important feature</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Rating (for compliments) */}
          {feedbackType === "compliment" && (
            <div className="space-y-2">
              <Label>How would you rate your experience?</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    key={star}
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="p-2"
                    onClick={() => setRating(star)}
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= rating ? "text-yellow-500 fill-current" : "text-gray-300"
                      }`}
                    />
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Feedback
              </>
            )}
          </Button>
        </form>
      </Card>

      {/* Recent Feedback */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Feedback</h2>
        <div className="space-y-4">
          {[
            {
              type: "feature",
              title: "Add dark mode support",
              description: "It would be great to have a dark mode option for late-night grading sessions.",
              status: "resolved" as const,
              timestamp: new Date(Date.now() - 86400000)
            },
            {
              type: "compliment",
              title: "Amazing time saver!",
              description: "CoTeacher has saved me hours of grading time. The AI is incredibly accurate.",
              status: "reviewed" as const,
              timestamp: new Date(Date.now() - 172800000)
            },
            {
              type: "bug",
              title: "Export formatting issue",
              description: "CSV export doesn't preserve special characters properly.",
              status: "pending" as const,
              timestamp: new Date(Date.now() - 259200000)
            }
          ].map((feedback, index) => (
            <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
              <div className="p-2 bg-muted rounded-lg">
                {feedbackTypes.find(t => t.value === feedback.type)?.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{feedback.title}</h3>
                  <Badge variant={feedback.status === "resolved" ? "default" : "secondary"}>
                    {feedback.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{feedback.description}</p>
                <p className="text-xs text-muted-foreground">
                  {feedback.timestamp.toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
