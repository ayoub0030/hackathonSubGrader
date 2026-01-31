import { useState, useRef, useEffect } from "react";
import { Loader2, Image, X, ChevronDown, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EssaySubmissionSkeleton } from "@/components/loading-skeletons";

interface EssaySubmissionProps {
  onSubmit: (data: {
    essay: string;
    studentName: string;
    gradeLevel: string;
    rubricType: string;
    imageFile?: File | null;
  }) => void;
  isLoading: boolean;
}

export function EssaySubmission({ onSubmit, isLoading }: EssaySubmissionProps) {
  const [essay, setEssay] = useState("");
  const [studentName, setStudentName] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [rubricType, setRubricType] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const wordCount = essay.trim() ? essay.trim().split(/\s+/).length : 0;
  const charCount = essay.length;
  const minWords = 100;
  const maxWords = 5000;
  const wordCountColor = wordCount < minWords ? 'text-amber-600' : wordCount > maxWords ? 'text-red-600' : 'text-green-600';

  // Auto-save functionality
  useEffect(() => {
    const saveData = {
      essay,
      studentName,
      gradeLevel,
      rubricType,
    };
    
    localStorage.setItem('essaySubmissionDraft', JSON.stringify(saveData));
    setLastSaved(new Date());
  }, [essay, studentName, gradeLevel, rubricType]);

  // Load saved data on mount
  useEffect(() => {
    const savedData = localStorage.getItem('essaySubmissionDraft');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setEssay(parsed.essay || "");
        setStudentName(parsed.studentName || "");
        setGradeLevel(parsed.gradeLevel || "");
        setRubricType(parsed.rubricType || "");
        setLastSaved(new Date());
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  const clearDraft = () => {
    localStorage.removeItem('essaySubmissionDraft');
    setLastSaved(null);
    toast({
      title: "Draft cleared",
      description: "Your saved draft has been cleared",
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPG, PNG, etc.)",
          variant: "destructive",
        });
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 10MB",
          variant: "destructive",
        });
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((essay.trim() || imageFile) && gradeLevel && rubricType) {
      onSubmit({
        essay,
        studentName,
        gradeLevel,
        rubricType,
        imageFile,
      });
      // Clear draft after successful submission
      localStorage.removeItem('essaySubmissionDraft');
      setLastSaved(null);
    } else {
      toast({
        title: "Missing information",
        description: "Please select both grade level and rubric type",
        variant: "destructive",
      });
    }
  };

  return (
    <section id="grading-form" className="py-16 md:py-24">
      <div className="container">
        <div className="mx-auto max-w-4xl">
          {isLoading ? (
            <EssaySubmissionSkeleton />
          ) : (
            <>
              {/* Section Header */}
              <div className="mb-10 text-center">
                <h2 className="mb-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                  Submit an essay for grading
                </h2>
                <p className="text-muted-foreground">
                  Paste or upload an essay, select grade level and rubric type, and get instant feedback.
                </p>
                {lastSaved && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Save className="h-3 w-3" />
                    <span>Draft saved at {lastSaved.toLocaleTimeString()}</span>
                    <button
                      type="button"
                      onClick={clearDraft}
                      className="text-destructive hover:underline"
                    >
                      Clear draft
                    </button>
                  </div>
                )}
              </div>

          {/* Form Card */}
          <div className="glass-card p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Student Info Row */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="studentName">Student name (optional)</Label>
                  <Input
                    id="studentName"
                    placeholder="e.g., John Smith"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gradeLevel">Grade level *</Label>
                  <Select value={gradeLevel} onValueChange={setGradeLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="elementary">Elementary (K-5)</SelectItem>
                      <SelectItem value="middle">Middle School (6-8)</SelectItem>
                      <SelectItem value="high">High School (9-12)</SelectItem>
                      <SelectItem value="college">College/University</SelectItem>
                      <SelectItem value="graduate">Graduate School</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rubricType">Rubric type *</Label>
                  <Select value={rubricType} onValueChange={setRubricType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rubric type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="argumentative">Argumentative Essay</SelectItem>
                      <SelectItem value="narrative">Narrative Essay</SelectItem>
                      <SelectItem value="expository">Expository Essay</SelectItem>
                      <SelectItem value="research">Research Paper</SelectItem>
                      <SelectItem value="literary">Literary Analysis</SelectItem>
                      <SelectItem value="general">General Writing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

             

              {/* Essay Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="essay">Essay content {!imageFile && '*'}</Label>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs ${wordCount > 0 ? wordCountColor : 'text-muted-foreground/50'}`}>
                      {wordCount} words
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {charCount} characters
                    </span>
                  </div>
                </div>
                <Textarea
                  id="essay"
                  placeholder="Paste the student's essay here..."
                  value={essay}
                  onChange={(e) => setEssay(e.target.value)}
                  className="min-h-[200px] resize-y text-sm leading-relaxed"
                  required={!imageFile}
                />
                {wordCount > 0 && (
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Recommended: {minWords}-{maxWords} words</span>
                    {wordCount < minWords && (
                      <span className="text-amber-600">Add {minWords - wordCount} more words</span>
                    )}
                    {wordCount > maxWords && (
                      <span className="text-red-600">Remove {wordCount - maxWords} words</span>
                    )}
                    {wordCount >= minWords && wordCount <= maxWords && (
                      <span className="text-green-600">✓ Good length</span>
                    )}
                  </div>
                )}
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Or upload an essay image</Label>
                <div className="flex flex-col gap-3">
                  {imagePreview ? (
                    <div className="relative inline-block">
                      <img 
                        src={imagePreview} 
                        alt="Essay preview" 
                        className="max-h-[200px] rounded-lg border border-border object-contain"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border p-6 transition-colors hover:border-primary/50 hover:bg-primary/5"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                        <Image className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">Click to upload image</p>
                        <p className="text-xs text-muted-foreground">JPG, PNG up to 10MB</p>
                      </div>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  disabled={(!essay.trim() && !imageFile) || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing essay...
                    </>
                  ) : (
                    <>
                      Grade this essay
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
