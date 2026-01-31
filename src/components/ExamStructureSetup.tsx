import { useState, useRef } from "react";
import { Loader2, Image, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { extractQuestionsFromExam, ExtractedQuestion } from "@/lib/extract-questions";
import { readFileAsBase64 } from "@/lib/storage";
import { QuestionExtractor } from "@/components/QuestionExtractor";

interface ExamStructureSetupProps {
  onSetupComplete: (questions: ExtractedQuestion[], gradeLevel: string) => void;
}

export function ExamStructureSetup({ onSetupComplete }: ExamStructureSetupProps) {
  const [step, setStep] = useState<"upload" | "extract" | "configure">("upload");
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  const [templatePreview, setTemplatePreview] = useState<string | null>(null);
  const [gradeLevel, setGradeLevel] = useState("");
  const [extractedQuestions, setExtractedQuestions] = useState<ExtractedQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [templateImageBase64, setTemplateImageBase64] = useState<string | undefined>();
  const [templateImageMimeType, setTemplateImageMimeType] = useState<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTemplateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Type de fichier invalide",
          description: "Veuillez importer un fichier image (JPG, PNG, etc.)",
          variant: "destructive",
        });
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Fichier trop volumineux",
          description: "Veuillez importer une image de moins de 10 Mo",
          variant: "destructive",
        });
        return;
      }
      setTemplateFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setTemplatePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExtractQuestions = async () => {
    if (!templateFile) {
      toast({
        title: "Erreur",
        description: "Veuillez télécharger une image d'examen",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const imageBase64 = await readFileAsBase64(templateFile);
      const imageMimeType = templateFile.type;

      setTemplateImageBase64(imageBase64);
      setTemplateImageMimeType(imageMimeType);

      const questions = await extractQuestionsFromExam(imageBase64, imageMimeType);

      setExtractedQuestions(questions);
      setStep("configure");

      toast({
        title: "Questions extraites avec succès",
        description: `${questions.length} questions détectées. Veuillez vérifier et configurer les scores.`,
      });
    } catch (error) {
      console.error("Extraction error:", error);
      toast({
        title: "Erreur lors de l'extraction",
        description:
          error instanceof Error
            ? error.message
            : "Impossible d'extraire les questions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfigureComplete = (questionsWithScores: ExtractedQuestion[]) => {
    if (!gradeLevel.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un niveau scolaire",
        variant: "destructive",
      });
      return;
    }

    onSetupComplete(questionsWithScores, gradeLevel);
  };

  const handleRemoveTemplate = () => {
    setTemplateFile(null);
    setTemplatePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (step === "configure") {
    return (
      <QuestionExtractor
        questions={extractedQuestions}
        isLoading={false}
        imageBase64={templateImageBase64}
        imageMimeType={templateImageMimeType}
        onSubmitScores={handleConfigureComplete}
        onBack={() => setStep("upload")}
      />
    );
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12">
            <h1 className="font-display text-4xl font-bold mb-4">
              Définir la structure d'examen
            </h1>
            <p className="text-lg text-muted-foreground">
              Téléchargez un modèle d'examen pour extraire les questions et configurer les scores.
            </p>
          </div>

          {step === "upload" && (
            <Card className="p-8">
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-semibold mb-4 block">
                    Niveau scolaire
                  </Label>
                  <Input
                    placeholder="Ex: 6ème, 3ème, Terminale"
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value)}
                    className="mb-4"
                  />
                </div>

                <div>
                  <Label className="text-base font-semibold mb-4 block">
                    Télécharger le modèle d'examen
                  </Label>

                  {!templatePreview ? (
                    <div
                      className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Image className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm font-medium mb-2">
                        Cliquez pour télécharger une image
                      </p>
                      <p className="text-xs text-muted-foreground">
                        JPG, PNG ou PDF (max 10 Mo)
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleTemplateUpload}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative inline-block w-full">
                        <img
                          src={templatePreview}
                          alt="Template preview"
                          className="w-full rounded-lg border border-border max-h-96 object-cover"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={handleRemoveTemplate}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Changer l'image
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleTemplateUpload}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleExtractQuestions}
                  disabled={!templateFile || !gradeLevel.trim() || isLoading}
                  size="lg"
                  className="w-full gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Extraction en cours...
                    </>
                  ) : (
                    "Extraire les questions"
                  )}
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
