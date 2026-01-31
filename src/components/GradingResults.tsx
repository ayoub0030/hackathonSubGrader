import { CheckCircle2, AlertCircle, TrendingUp, Award, ChevronDown, ChevronUp, User, FileText, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

export interface GradingResult {
  meta: {
    student_name: string | null;
    grade_level: string;
    word_count: number;
  };
  grading_breakdown: Array<{
    category: string;
    score: number;
    max_score: number;
    proficiency_level: string;
    justification: string;
    student_comment: string;
    student_answer?: string;
    question_text?: string;
  }>;
  overall_assessment: {
    total_score: number;
    total_max_score: number;
    letter_grade: string;
  };
  feedback: {
    summary_note: string;
    strengths: string[];
    areas_for_improvement: string[];
  };
  flags: {
    is_off_topic: boolean;
    suspected_plagiarism: boolean;
    ai_generated_suspicion: string;
  };
}

interface GradingResultsProps {
  result: GradingResult;
  onGradeAnother: () => void;
}

function getScoreClass(score: number, maxScore: number): string {
  const percentage = (score / maxScore) * 100;
  if (percentage >= 85) return "score-excellent";
  if (percentage >= 70) return "score-good";
  if (percentage >= 55) return "score-fair";
  return "score-needs-work";
}

function getScoreColor(score: number, maxScore: number): string {
  const percentage = (score / maxScore) * 100;
  if (percentage >= 85) return "bg-success";
  if (percentage >= 70) return "bg-primary";
  if (percentage >= 55) return "bg-warning";
  return "bg-destructive";
}

function getGradeColor(grade: string): string {
  if (grade.startsWith("A")) return "text-success";
  if (grade.startsWith("B")) return "text-primary";
  if (grade.startsWith("C")) return "text-warning";
  return "text-destructive";
}

export function GradingResults({ result, onGradeAnother }: GradingResultsProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const percentage = Math.round((result.overall_assessment.total_score / result.overall_assessment.total_max_score) * 100);

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="mx-auto max-w-5xl">
          {/* Header with overall score */}
          <div className="mb-10 glass-card p-6 md:p-8 animate-fade-in">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Student Info */}
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <User className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold">
                    {result.meta.student_name || "Élève anonyme"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {result.meta.grade_level} • {result.meta.word_count} mots
                  </p>
                </div>
              </div>

              {/* Overall Score */}
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className={`font-display text-5xl font-bold ${getGradeColor(result.overall_assessment.letter_grade)}`}>
                    {result.overall_assessment.letter_grade}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Note (lettre)</p>
                </div>
                <div className="h-16 w-px bg-border" />
                <div className="text-center">
                  <div className="font-display text-3xl font-bold">
                    {result.overall_assessment.total_score}/{result.overall_assessment.total_max_score}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{percentage}%</p>
                </div>
              </div>
            </div>

            {/* Flags */}
            {(result.flags.is_off_topic || result.flags.suspected_plagiarism || result.flags.ai_generated_suspicion !== "Low") && (
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex flex-wrap gap-2">
                  {result.flags.is_off_topic && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-destructive/10 text-destructive text-sm">
                      <AlertCircle className="h-3.5 w-3.5" />
                      Hors sujet
                    </span>
                  )}
                  {result.flags.suspected_plagiarism && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warning/10 text-warning text-sm">
                      <AlertCircle className="h-3.5 w-3.5" />
                      Plagiat possible
                    </span>
                  )}
                  {result.flags.ai_generated_suspicion !== "Low" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warning/10 text-warning text-sm">
                      <AlertCircle className="h-3.5 w-3.5" />
                      Généré par IA ({result.flags.ai_generated_suspicion})
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Two Column Layout */}
          <div className="grid gap-8 lg:grid-cols-5">
            {/* Grading Breakdown - Left Column */}
            <div className="lg:col-span-3 space-y-4">
              <h3 className="font-display text-xl font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Détail de la correction
              </h3>
              
              {result.grading_breakdown.map((item, index) => (
                <div
                  key={item.category}
                  className="glass-card overflow-hidden animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s`, opacity: 0 }}
                >
                  <button
                    onClick={() => setExpandedCategory(
                      expandedCategory === item.category ? null : item.category
                    )}
                    className="w-full p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{item.category}</span>
                          <div className="flex items-center gap-2">
                            <span className={`score-badge ${getScoreClass(item.score, item.max_score)}`}>
                              {item.proficiency_level}
                            </span>
                            <span className="font-display font-semibold text-lg">
                              {item.score}/{item.max_score}
                            </span>
                          </div>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${getScoreColor(item.score, item.max_score)}`}
                            style={{ width: `${(item.score / item.max_score) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    {expandedCategory === item.category ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground ml-4 shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground ml-4 shrink-0" />
                    )}
                  </button>

                  {expandedCategory === item.category && (
                    <div className="px-4 pb-4 space-y-4 animate-fade-in">
                      {item.question_text && (
                        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 dark:bg-amber-950/20 dark:border-amber-800">
                          <p className="text-xs font-medium text-amber-700 dark:text-amber-400 uppercase tracking-wide mb-1">
                            Question
                          </p>
                          <p className="text-sm text-foreground whitespace-pre-wrap">{item.question_text}</p>
                        </div>
                      )}
                      {item.student_answer && (
                        <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 dark:bg-blue-950/20 dark:border-blue-800">
                          <p className="text-xs font-medium text-blue-700 dark:text-blue-400 uppercase tracking-wide mb-1">
                            Réponse de l'élève
                          </p>
                          <p className="text-sm text-foreground whitespace-pre-wrap">{item.student_answer}</p>
                        </div>
                      )}
                      <div className="p-3 rounded-lg bg-secondary/50">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                          Justification (enseignant)
                        </p>
                        <p className="text-sm">{item.justification}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                        <p className="text-xs font-medium text-primary uppercase tracking-wide mb-1">
                          Retour pour l'élève
                        </p>
                        <p className="text-sm">{item.student_comment}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Feedback Panel - Right Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Summary */}
              <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
                <h3 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-accent" />
                  Résumé
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {result.feedback.summary_note}
                </p>
              </div>

              {/* Strengths */}
              <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
                <h3 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  Points forts
                </h3>
                <ul className="space-y-2">
                  {result.feedback.strengths.map((strength, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-success shrink-0" />
                      <span className="text-muted-foreground">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Areas for Improvement */}
              <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
                <h3 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Axes d'amélioration
                </h3>
                <ul className="space-y-2">
                  {result.feedback.areas_for_improvement.map((area, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      <span className="text-muted-foreground">{area}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={onGradeAnother}
              >
                Corriger une autre dissertation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
