import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { toast } from "@/hooks/use-toast";
import { extractQuestionsFromExam, ExtractedQuestion } from "@/lib/extract-questions";
import { gradeBatchExams, BatchGradingResult, ExamToGrade } from "@/lib/grade-with-scores";
import { readFileAsBase64, ExamFile, readExamFilesAsBase64 } from "@/lib/storage";
import { ExamStructureSetup } from "@/components/ExamStructureSetup";
import { BatchExamUpload } from "@/components/BatchExamUpload";
import { BatchGradingProgress } from "@/components/BatchGradingProgress";
import { BatchGradingResults } from "@/components/BatchGradingResults";

type ClassExamStep = "structure" | "upload" | "grading" | "results";

const ClassExam = () => {
  const [step, setStep] = useState<ClassExamStep>("structure");
  const [extractedQuestions, setExtractedQuestions] = useState<ExtractedQuestion[]>([]);
  const [gradeLevel, setGradeLevel] = useState("");
  const [examFiles, setExamFiles] = useState<ExamFile[]>([]);
  const [gradingResults, setGradingResults] = useState<BatchGradingResult[]>([]);
  const [isGrading, setIsGrading] = useState(false);
  const [gradingProgress, setGradingProgress] = useState({ completed: 0, total: 0 });

  const handleStructureSetup = async (
    questions: ExtractedQuestion[],
    level: string
  ) => {
    setExtractedQuestions(questions);
    setGradeLevel(level);
    setStep("upload");
    toast({
      title: "Structure d'examen définie",
      description: `${questions.length} questions configurées. Veuillez télécharger les examens des élèves.`,
    });
  };

  const handleExamsUploaded = (files: ExamFile[]) => {
    setExamFiles(files);
    setStep("grading");
  };

  const handleStartGrading = async () => {
    if (examFiles.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez télécharger au moins un examen",
        variant: "destructive",
      });
      return;
    }

    setIsGrading(true);
    setGradingProgress({ completed: 0, total: examFiles.length });

    try {
      console.log(`[BATCH] Starting batch grading for ${examFiles.length} exams...`);

      // Read all exam files as base64
      const examsData = await readExamFilesAsBase64(examFiles);

      // Create ExamToGrade objects with unique IDs
      const examsToGrade: ExamToGrade[] = examsData.map((exam, index) => ({
        id: `exam-${index}-${Date.now()}`,
        studentName: exam.studentName,
        imageBase64: exam.imageBase64,
        imageMimeType: exam.imageMimeType,
      }));

      // Grade all exams in parallel
      const results = await gradeBatchExams(
        examsToGrade,
        extractedQuestions,
        gradeLevel,
        (completed, total) => {
          setGradingProgress({ completed, total });
        }
      );

      setGradingResults(results);
      setStep("results");

      const successCount = results.filter((r) => r.status === "success").length;
      toast({
        title: "Correction terminée",
        description: `${successCount}/${results.length} examens corrigés avec succès`,
      });

      console.log(`[BATCH] Batch grading completed. Results:`, results);
    } catch (error) {
      console.error("[BATCH] Error during batch grading:", error);
      toast({
        title: "Erreur lors de la correction",
        description:
          error instanceof Error
            ? error.message
            : "Impossible de corriger les examens",
        variant: "destructive",
      });
    } finally {
      setIsGrading(false);
    }
  };

  const handleBackToUpload = () => {
    setStep("upload");
  };

  const handleBackToStructure = () => {
    setStep("structure");
    setExtractedQuestions([]);
    setGradeLevel("");
    setExamFiles([]);
  };

  const handleStartOver = () => {
    setStep("structure");
    setExtractedQuestions([]);
    setGradeLevel("");
    setExamFiles([]);
    setGradingResults([]);
    setGradingProgress({ completed: 0, total: 0 });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {step === "structure" && (
          <ExamStructureSetup onSetupComplete={handleStructureSetup} />
        )}

        {step === "upload" && (
          <BatchExamUpload
            questions={extractedQuestions}
            onExamsUploaded={handleExamsUploaded}
            onBack={handleBackToStructure}
          />
        )}

        {step === "grading" && (
          <BatchGradingProgress
            examCount={examFiles.length}
            progress={gradingProgress}
            isGrading={isGrading}
            onStartGrading={handleStartGrading}
            onBack={handleBackToUpload}
          />
        )}

        {step === "results" && (
          <BatchGradingResults
            results={gradingResults}
            questions={extractedQuestions}
            onStartOver={handleStartOver}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ClassExam;
