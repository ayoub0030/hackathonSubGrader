import { useState, useRef } from "react";
import { Loader2, Image, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const wordCount = essay.trim() ? essay.trim().split(/\s+/).length : 0;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
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
    if (essay.trim() || imageFile) {
      onSubmit({
        essay,
        studentName,
        gradeLevel: "Not specified",
        rubricType: "general",
        imageFile,
      });
    }
  };

  return (
    <section id="grading-form" className="py-16 md:py-24">
      <div className="container">
        <div className="mx-auto max-w-4xl">
          {/* Section Header */}
          <div className="mb-10 text-center">
            <h2 className="mb-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Soumettre une dissertation à corriger
            </h2>
            <p className="text-muted-foreground">
              Collez ou importez une dissertation, sélectionnez une grille et obtenez un retour instantané.
            </p>
          </div>

          {/* Form Card */}
          <div className="glass-card p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Student Info Row */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="studentName">Nom de l'élève (optionnel)</Label>
                  <Input
                    id="studentName"
                    placeholder="ex. : Jean Dupont"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                  />
                </div>
               
              </div>

             

              {/* Essay Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="essay">Contenu de la dissertation {!imageFile && '*'}</Label>
                  <span className={`text-xs ${wordCount > 0 ? 'text-muted-foreground' : 'text-muted-foreground/50'}`}>
                    {wordCount} mots
                  </span>
                </div>
                <Textarea
                  id="essay"
                  placeholder="Collez ici la dissertation de l'élève..."
                  value={essay}
                  onChange={(e) => setEssay(e.target.value)}
                  className="min-h-[200px] resize-y text-sm leading-relaxed"
                  required={!imageFile}
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Ou importer une image de la dissertation</Label>
                <div className="flex flex-col gap-3">
                  {imagePreview ? (
                    <div className="relative inline-block">
                      <img 
                        src={imagePreview} 
                        alt="Aperçu de la dissertation" 
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
                        <p className="text-sm font-medium">Cliquer pour importer une image</p>
                        <p className="text-xs text-muted-foreground">JPG, PNG jusqu'à 10 Mo</p>
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
                      Analyse de la dissertation...
                    </>
                  ) : (
                    <>
                      Corriger cette dissertation
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
