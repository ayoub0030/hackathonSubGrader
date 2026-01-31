import { useState, useRef } from "react";
import { Loader2, Image, X, Upload, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { ExtractedQuestion } from "@/lib/extract-questions";
import { ExamFile } from "@/lib/storage";

interface BatchExamUploadProps {
  questions: ExtractedQuestion[];
  onExamsUploaded: (files: ExamFile[]) => void;
  onBack: () => void;
}

interface ImageUpload {
  id: string;
  file: File;
  preview: string;
}

interface StudentExam {
  id: string;
  studentName: string;
  images: ImageUpload[];
}

export function BatchExamUpload({
  questions,
  onExamsUploaded,
  onBack,
}: BatchExamUploadProps) {
  const [students, setStudents] = useState<StudentExam[]>([
    { id: "1", studentName: "", images: [] },
  ]);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleAddStudent = () => {
    if (students.length >= 10) {
      toast({
        title: "Limite atteinte",
        description: "Vous pouvez ajouter un maximum de 10 élèves",
        variant: "destructive",
      });
      return;
    }
    const newId = String(Math.max(...students.map((s) => parseInt(s.id))) + 1);
    setStudents([...students, { id: newId, studentName: "", images: [] }]);
  };

  const handleRemoveStudent = (id: string) => {
    if (students.length === 1) {
      toast({
        title: "Erreur",
        description: "Vous devez avoir au moins un élève",
        variant: "destructive",
      });
      return;
    }
    setStudents(students.filter((s) => s.id !== id));
  };

  const handleStudentNameChange = (id: string, name: string) => {
    setStudents(students.map((s) => (s.id === id ? { ...s, studentName: name } : s)));
  };

  const handleAddImage = (studentId: string, e: React.ChangeEvent<HTMLInputElement>) => {
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setStudents(
          students.map((s) =>
            s.id === studentId
              ? {
                  ...s,
                  images: [
                    ...s.images,
                    {
                      id: `img-${Date.now()}`,
                      file,
                      preview: reader.result as string,
                    },
                  ],
                }
              : s
          )
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (studentId: string, imageId: string) => {
    setStudents(
      students.map((s) =>
        s.id === studentId
          ? { ...s, images: s.images.filter((img) => img.id !== imageId) }
          : s
      )
    );
  };

  const handleSubmit = () => {
    const incompleteStudents = students.filter(
      (s) => !s.studentName.trim() || s.images.length === 0
    );
    if (incompleteStudents.length > 0) {
      toast({
        title: "Erreur",
        description:
          "Veuillez remplir le nom de l'élève et télécharger au moins une image pour chaque élève",
        variant: "destructive",
      });
      return;
    }

    const examFiles: ExamFile[] = [];
    students.forEach((student) => {
      student.images.forEach((image) => {
        examFiles.push({
          studentName: student.studentName.trim(),
          file: image.file,
        });
      });
    });

    onExamsUploaded(examFiles);
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12">
            <h1 className="font-display text-4xl font-bold mb-4">
              Télécharger les examens des élèves
            </h1>
            <p className="text-lg text-muted-foreground">
              Téléchargez les examens de {questions.length} question(s) pour chaque élève.
              Vous pouvez télécharger plusieurs images par élève et jusqu'à 10 élèves.
            </p>
          </div>

          <div className="space-y-6">
            {students.map((student, index) => (
              <Card key={student.id} className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Élève {index + 1}</h3>
                    {students.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveStudent(student.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Nom de l'élève
                    </Label>
                    <Input
                      placeholder="Ex: Jean Dupont"
                      value={student.studentName}
                      onChange={(e) => handleStudentNameChange(student.id, e.target.value)}
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Images de l'examen ({student.images.length})
                    </Label>

                    {student.images.length === 0 ? (
                      <div
                        className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                        onClick={() => fileInputRefs.current[`${student.id}-add`]?.click()}
                      >
                        <Image className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm font-medium mb-1">
                          Cliquez pour ajouter une image
                        </p>
                        <p className="text-xs text-muted-foreground">
                          JPG, PNG (max 10 Mo)
                        </p>
                        <input
                          ref={(el) => {
                            if (el) fileInputRefs.current[`${student.id}-add`] = el;
                          }}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleAddImage(student.id, e)}
                          className="hidden"
                        />
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {student.images.map((image, imgIndex) => (
                          <div key={image.id} className="relative">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">
                                Image {imgIndex + 1}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveImage(student.id, image.id)}
                              >
                                <X className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                            <img
                              src={image.preview}
                              alt={`Exam preview ${imgIndex + 1}`}
                              className="w-full rounded-lg border border-border max-h-48 object-cover"
                            />
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          className="w-full gap-2"
                          onClick={() => fileInputRefs.current[`${student.id}-add`]?.click()}
                        >
                          <Plus className="h-4 w-4" />
                          Ajouter une autre image
                        </Button>
                        <input
                          ref={(el) => {
                            if (el) fileInputRefs.current[`${student.id}-add`] = el;
                          }}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleAddImage(student.id, e)}
                          className="hidden"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}

            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={handleAddStudent}
              disabled={students.length >= 10}
            >
              <Plus className="h-4 w-4" />
              Ajouter un élève
            </Button>

            <div className="flex gap-3 pt-6">
              <Button variant="outline" onClick={onBack} className="flex-1">
                Retour
              </Button>
              <Button onClick={handleSubmit} className="flex-1">
                Continuer vers la correction
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
