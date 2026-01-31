import { useRef, useState } from "react";
import { DemoSection } from "@/components/DemoSection";
import { EssaySubmission } from "@/components/EssaySubmission";
import { FeaturesSection } from "@/components/FeaturesSection";
import { Footer } from "@/components/Footer";
import { GradingResult, GradingResults } from "@/components/GradingResults";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { QuestionExtractor } from "@/components/QuestionExtractor";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { FloatingActionButton } from "@/components/floating-action-button";
import { toast } from "@/hooks/use-toast";
import { extractQuestionsFromExam, ExtractedQuestion } from "@/lib/extract-questions";
import { gradeWithQuestionScores } from "@/lib/grade-with-scores";
import { readFileAsBase64 } from "@/lib/storage";

type WorkflowStep = "form" | "extractor" | "results";

const Index = () => {
  const [workflowStep, setWorkflowStep] = useState<WorkflowStep>("form");
  const [extractedQuestions, setExtractedQuestions] = useState<ExtractedQuestion[]>([]);
  const [gradingResult, setGradingResult] = useState<GradingResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStudentName, setCurrentStudentName] = useState("");
  const [currentGradeLevel, setCurrentGradeLevel] = useState("");
  const [currentImageBase64, setCurrentImageBase64] = useState<string | undefined>();
  const [currentImageMimeType, setCurrentImageMimeType] = useState<string | undefined>();
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (data: {
    essay: string;
    studentName: string;
    gradeLevel: string;
    rubricType: string;
    imageFile?: File | null;
  }) => {
    setIsLoading(true);

    try {
      // Store student info for later use
      setCurrentStudentName(data.studentName);
      setCurrentGradeLevel(data.gradeLevel);

      // If image is provided, extract questions first
      if (data.imageFile) {
        const imageBase64 = await readFileAsBase64(data.imageFile);
        const imageMimeType = data.imageFile.type;

        // Store image for later use in grading step
        setCurrentImageBase64(imageBase64);
        setCurrentImageMimeType(imageMimeType);

        // Step 1: Extract questions from exam image
        const questions = await extractQuestionsFromExam(
          imageBase64,
          imageMimeType
        );

        setExtractedQuestions(questions);
        setWorkflowStep("extractor");
        toast({
          title: "Questions extracted successfully",
          description: `${questions.length} questions detected. Please review and enter scores.`,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        // If only text essay, grade directly (old flow)
        toast({
          title: "Error",
          description: "Please upload an exam image",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Extraction error:", error);
      toast({
        title: "Extraction error",
        description:
          error instanceof Error
            ? error.message
            : "Unable to extract questions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitScores = async (
    questionsWithScores: ExtractedQuestion[],
    imageBase64?: string,
    imageMimeType?: string
  ) => {
    setIsLoading(true);

    try {
      // Step 2: Grade with question scores (including image)
      const result = await gradeWithQuestionScores({
        questions: questionsWithScores,
        studentName: currentStudentName,
        gradeLevel: currentGradeLevel,
        imageBase64: imageBase64 || currentImageBase64,
        imageMimeType: imageMimeType || currentImageMimeType,
      });

      setGradingResult(result);
      setWorkflowStep("results");
      toast({
        title: "Exam graded successfully",
        description: `Overall score: ${result.overall_assessment.total_score}/${result.overall_assessment.total_max_score} (${result.overall_assessment.letter_grade})`,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Grading error:", error);
      toast({
        title: "Grading error",
        description:
          error instanceof Error
            ? error.message
            : "Unable to grade exam",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGradeAnother = () => {
    setGradingResult(null);
    setExtractedQuestions([]);
    setCurrentImageBase64(undefined);
    setCurrentImageMimeType(undefined);
    setWorkflowStep("form");
    scrollToForm();
  };

  const handleBackToForm = () => {
    setExtractedQuestions([]);
    setCurrentImageBase64(undefined);
    setCurrentImageMimeType(undefined);
    setWorkflowStep("form");
    scrollToForm();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {workflowStep === "results" && gradingResult ? (
        <GradingResults result={gradingResult} onGradeAnother={handleGradeAnother} />
      ) : workflowStep === "extractor" ? (
        <QuestionExtractor
          questions={extractedQuestions}
          isLoading={isLoading}
          imageBase64={currentImageBase64}
          imageMimeType={currentImageMimeType}
          onSubmitScores={handleSubmitScores}
          onBack={handleBackToForm}
        />
      ) : (
        <>
          <HeroSection onStartGrading={scrollToForm} />
          <div ref={formRef}>
            <EssaySubmission onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
          <FeaturesSection />
          <TestimonialsSection />
          <DemoSection />
        </>
      )}

      <FloatingActionButton />
      <Footer />
    </div>
  );
};

export default Index;
