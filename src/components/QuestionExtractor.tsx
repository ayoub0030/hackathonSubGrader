import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { AlertCircle, Loader2, Edit2, Check } from "lucide-react";
import { ExtractedQuestion } from "@/lib/extract-questions";

interface QuestionExtractorProps {
  questions: ExtractedQuestion[];
  isLoading: boolean;
  imageBase64?: string;
  imageMimeType?: string;
  onSubmitScores: (questionsWithScores: ExtractedQuestion[], imageBase64?: string, imageMimeType?: string) => void;
  onBack: () => void;
}

export function QuestionExtractor({
  questions,
  isLoading,
  imageBase64,
  imageMimeType,
  onSubmitScores,
  onBack,
}: QuestionExtractorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [scores, setScores] = useState<Record<string, number>>(
    questions.reduce(
      (acc, q) => ({
        ...acc,
        [q.id]: q.maxScore || 10,
      }),
      {}
    )
  );
  const [editedQuestions, setEditedQuestions] = useState<ExtractedQuestion[]>(
    questions
  );
  const [rubrics, setRubrics] = useState<Record<string, string>>(
    questions.reduce(
      (acc, q) => ({
        ...acc,
        [q.id]: q.rubric || "",
      }),
      {}
    )
  );

  const handleEditQuestion = (id: string, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  const handleSaveEdit = (id: string) => {
    setEditedQuestions(
      editedQuestions.map((q) =>
        q.id === id ? { ...q, text: editText } : q
      )
    );
    setEditingId(null);
  };

  const handleRubricChange = (id: string, rubric: string) => {
    setRubrics({ ...rubrics, [id]: rubric });
  };

  const handleScoreChange = (id: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setScores({ ...scores, [id]: numValue });
  };

  const handleSubmit = () => {
    const questionsWithScores = editedQuestions.map((q) => ({
      ...q,
      score: 0,
      maxScore: scores[q.id] || 10,
      rubric: rubrics[q.id] || "",
    }));
    onSubmitScores(questionsWithScores, imageBase64, imageMimeType);
  };

  const allScoresSet = editedQuestions.every((q) => scores[q.id] !== undefined);

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-10">
            <h2 className="mb-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Questions extraites de l'examen
            </h2>
            <p className="text-muted-foreground">
              Vérifiez les questions extraites et entrez le score maximum pour
              chaque question.
            </p>
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {editedQuestions.length === 0 ? (
              <Card className="p-6">
                <div className="flex items-center gap-3 text-amber-600">
                  <AlertCircle className="h-5 w-5" />
                  <p>Aucune question détectée. Veuillez vérifier l'image.</p>
                </div>
              </Card>
            ) : (
              editedQuestions.map((question) => (
                <Card key={question.id} className="p-6">
                  <div className="space-y-4">
                    {/* Question Text */}
                    <div>
                      <Label className="mb-2 block text-sm font-semibold">
                        {question.id.toUpperCase()}
                      </Label>
                      {editingId === question.id ? (
                        <div className="space-y-2">
                          <Textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="min-h-[100px]"
                          />
                          <Button
                            size="sm"
                            onClick={() => handleSaveEdit(question.id)}
                            className="gap-2"
                          >
                            <Check className="h-4 w-4" />
                            Enregistrer
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <p className="flex-1 rounded-lg bg-muted p-3 text-sm leading-relaxed">
                            {question.text}
                          </p>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              handleEditQuestion(question.id, question.text)
                            }
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Score Input */}
                    <div>
                      <Label htmlFor={`score-${question.id}`} className="text-sm">
                        Score maximum (points)
                      </Label>
                      <Input
                        id={`score-${question.id}`}
                        type="number"
                        min="0"
                        max="100"
                        value={scores[question.id] || ""}
                        onChange={(e) =>
                          handleScoreChange(question.id, e.target.value)
                        }
                        placeholder="ex. 10"
                        className="mt-1"
                      />
                    </div>

                    {/* Rubric Input */}
                    <div>
                      <Label htmlFor={`rubric-${question.id}`} className="text-sm">
                        Grille d'évaluation (comment évaluer cette question)
                      </Label>
                      <Textarea
                        id={`rubric-${question.id}`}
                        value={rubrics[question.id] || ""}
                        onChange={(e) =>
                          handleRubricChange(question.id, e.target.value)
                        }
                        placeholder="ex. Évaluer sur la clarté, la précision, la complétude de la réponse..."
                        className="mt-1 min-h-[80px]"
                      />
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Actions */}
          <div className="mt-8 flex gap-3">
            <Button variant="outline" onClick={onBack}>
              Retour
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!allScoresSet || isLoading || editedQuestions.length === 0}
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Correction en cours...
                </>
              ) : (
                `Corriger (${editedQuestions.length} questions)`
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
