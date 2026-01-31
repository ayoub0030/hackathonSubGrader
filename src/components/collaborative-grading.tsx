import { useState, useEffect } from "react";
import { Users, MessageSquare, Eye, Edit3, Share2, Lock, Unlock, Clock, CheckCircle2, AlertCircle, UserPlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

interface CollaborativeUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "owner" | "editor" | "viewer";
  status: "online" | "offline" | "busy";
  lastSeen: Date;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
  isResolved: boolean;
}

interface SharedEssay {
  id: string;
  title: string;
  studentName: string;
  gradeLevel: string;
  content: string;
  owner: string;
  collaborators: CollaborativeUser[];
  comments: Comment[];
  status: "draft" | "in-review" | "graded" | "final";
  lastModified: Date;
  isPublic: boolean;
}

export function CollaborativeGrading() {
  const [sharedEssays, setSharedEssays] = useState<SharedEssay[]>([
    {
      id: "1",
      title: "Shakespeare Analysis Essay",
      studentName: "Emily Johnson",
      gradeLevel: "High School",
      content: "In William Shakespeare's Romeo and Juliet, the theme of love...",
      owner: "Dr. Sarah Johnson",
      collaborators: [
        { id: "1", name: "Dr. Sarah Johnson", email: "sarah@university.edu", role: "owner", status: "online", lastSeen: new Date() },
        { id: "2", name: "Prof. Michael Chen", email: "michael@university.edu", role: "editor", status: "online", lastSeen: new Date() },
        { id: "3", name: "Dr. Emily Rodriguez", email: "emily@university.edu", role: "viewer", status: "offline", lastSeen: new Date(Date.now() - 3600000) }
      ],
      comments: [
        { id: "1", userId: "2", userName: "Prof. Michael Chen", content: "Great analysis of the balcony scene. Consider adding more context about the historical period.", timestamp: new Date(Date.now() - 7200000), isResolved: false },
        { id: "2", userId: "1", userName: "Dr. Sarah Johnson", content: "I've updated the introduction with more historical context as suggested.", timestamp: new Date(Date.now() - 3600000), isResolved: true }
      ],
      status: "in-review",
      lastModified: new Date(Date.now() - 1800000),
      isPublic: false
    },
    {
      id: "2", 
      title: "Research Paper on Climate Change",
      studentName: "James Wilson",
      gradeLevel: "College",
      content: "Climate change represents one of the most pressing challenges...",
      owner: "Dr. Sarah Johnson",
      collaborators: [
        { id: "1", name: "Dr. Sarah Johnson", email: "sarah@university.edu", role: "owner", status: "online", lastSeen: new Date() },
        { id: "4", name: "Dr. Lisa Wang", email: "lisa@university.edu", role: "editor", status: "busy", lastSeen: new Date() }
      ],
      comments: [],
      status: "draft",
      lastModified: new Date(),
      isPublic: true
    }
  ]);

  const [selectedEssay, setSelectedEssay] = useState<SharedEssay | null>(null);
  const [newComment, setNewComment] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"editor" | "viewer">("viewer");
  const [isSharing, setIsSharing] = useState(false);

  const handleAddComment = () => {
    if (!selectedEssay || !newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      userId: "1", // Current user
      userName: "Dr. Sarah Johnson",
      content: newComment,
      timestamp: new Date(),
      isResolved: false
    };

    setSharedEssays(prev => prev.map(essay => 
      essay.id === selectedEssay.id 
        ? { ...essay, comments: [...essay.comments, comment] }
        : essay
    ));

    setSelectedEssay(prev => prev ? { ...prev, comments: [...prev.comments, comment] } : null);
    setNewComment("");
    
    toast({
      title: "Comment added",
      description: "Your comment has been added to the essay.",
    });
  };

  const handleInviteCollaborator = () => {
    if (!selectedEssay || !inviteEmail.trim()) return;

    const newUser: CollaborativeUser = {
      id: Date.now().toString(),
      name: inviteEmail.split("@")[0],
      email: inviteEmail,
      role: inviteRole,
      status: "offline",
      lastSeen: new Date()
    };

    setSharedEssays(prev => prev.map(essay => 
      essay.id === selectedEssay.id 
        ? { ...essay, collaborators: [...essay.collaborators, newUser] }
        : essay
    ));

    setSelectedEssay(prev => prev ? { ...prev, collaborators: [...prev.collaborators, newUser] } : null);
    setInviteEmail("");
    setIsSharing(false);
    
    toast({
      title: "Collaborator invited",
      description: `${inviteEmail} has been invited to collaborate on this essay.`,
    });
  };

  const handleTogglePublic = (essayId: string) => {
    setSharedEssays(prev => prev.map(essay => 
      essay.id === essayId ? { ...essay, isPublic: !essay.isPublic } : essay
    ));
    
    const essay = sharedEssays.find(e => e.id === essayId);
    toast({
      title: essay?.isPublic ? "Essay made private" : "Essay made public",
      description: essay?.isPublic ? "Only collaborators can view this essay" : "Anyone with the link can view this essay",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft": return "bg-gray-100 text-gray-800";
      case "in-review": return "bg-blue-100 text-blue-800";
      case "graded": return "bg-green-100 text-green-800";
      case "final": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "owner": return "bg-purple-100 text-purple-800";
      case "editor": return "bg-blue-100 text-blue-800";
      case "viewer": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online": return <div className="h-2 w-2 bg-green-500 rounded-full" />;
      case "busy": return <div className="h-2 w-2 bg-yellow-500 rounded-full" />;
      case "offline": return <div className="h-2 w-2 bg-gray-400 rounded-full" />;
      default: return <div className="h-2 w-2 bg-gray-400 rounded-full" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Collaborative Grading</h1>
          <p className="text-muted-foreground">Work together with colleagues to grade essays more efficiently</p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          New Shared Essay
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Essays List */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Shared Essays</h2>
          {sharedEssays.map((essay) => (
            <Card 
              key={essay.id} 
              className={`p-4 cursor-pointer transition-all duration-200 ${
                selectedEssay?.id === essay.id ? "ring-2 ring-primary" : "hover:shadow-md"
              }`}
              onClick={() => setSelectedEssay(essay)}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold line-clamp-1">{essay.title}</h3>
                    <p className="text-sm text-muted-foreground">{essay.studentName}</p>
                    <p className="text-xs text-muted-foreground">{essay.gradeLevel}</p>
                  </div>
                  <Badge className={getStatusColor(essay.status)}>
                    {essay.status}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{essay.collaborators.length}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {essay.isPublic ? <Unlock className="h-4 w-4 text-green-600" /> : <Lock className="h-4 w-4 text-gray-400" />}
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{essay.comments.length}</span>
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Modified {essay.lastModified.toLocaleDateString()}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Essay Details */}
        <div className="lg:col-span-2">
          {selectedEssay ? (
            <div className="space-y-6">
              {/* Essay Header */}
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{selectedEssay.title}</h2>
                    <p className="text-muted-foreground">{selectedEssay.studentName} • {selectedEssay.gradeLevel}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTogglePublic(selectedEssay.id)}
                    >
                      {selectedEssay.isPublic ? <Lock className="h-4 w-4 mr-2" /> : <Unlock className="h-4 w-4 mr-2" />}
                      {selectedEssay.isPublic ? "Make Private" : "Make Public"}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>

                {/* Collaborators */}
                <div className="space-y-3">
                  <h3 className="font-semibold">Collaborators</h3>
                  <div className="space-y-2">
                    {selectedEssay.collaborators.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getRoleColor(user.role)} variant="outline">
                            {user.role}
                          </Badge>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(user.status)}
                            <span className="text-xs text-muted-foreground">{user.status}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Invite Collaborator */}
                  <div className="border-t pt-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter email to invite..."
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        className="flex-1"
                      />
                      <Select value={inviteRole} onValueChange={(value: "editor" | "viewer") => setInviteRole(value)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="editor">Editor</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button onClick={handleInviteCollaborator} disabled={!inviteEmail.trim()}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Invite
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Essay Content */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Essay Content</h3>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{selectedEssay.content}</p>
                </div>
              </Card>

              {/* Comments Section */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Comments & Feedback</h3>
                  <Badge variant="outline">{selectedEssay.comments.length} comments</Badge>
                </div>
                
                {/* Add Comment */}
                <div className="space-y-3 mb-6">
                  <Textarea
                    placeholder="Add your comment or feedback..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                  />
                  <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Add Comment
                  </Button>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {selectedEssay.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 p-4 rounded-lg bg-muted/30">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-medium text-sm">{comment.userName}</p>
                            <p className="text-xs text-muted-foreground">
                              {comment.timestamp.toLocaleDateString()} at {comment.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                          {comment.isResolved && (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Select an essay to view details</h3>
              <p className="text-muted-foreground">Choose from the shared essays on the left to start collaborating</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
