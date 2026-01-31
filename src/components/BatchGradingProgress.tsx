import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { ExtractedQuestion } from "@/lib/extract-questions";

interface BatchGradingProgressProps {
  examCount: number;
  progress: { completed: number; total: number };
  isGrading: boolean;
  onStartGrading: () => void;
  onBack: () => void;
}

export function BatchGradingProgress({
  examCount,
  progress,
  isGrading,
  onStartGrading,
  onBack,
}: BatchGradingProgressProps) {
  const percentage = progress.total > 0 ? (progress.completed / progress.total) * 100 : 0;
  const isComplete = progress.completed === progress.total && progress.total > 0;

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl">
          <div className="mb-12">
            <h1 className="font-display text-4xl font-bold mb-4">
              Grading in progress
            </h1>
            <p className="text-lg text-muted-foreground">
              {examCount} exam(s) to grade
            </p>
          </div>

          <Card className="p-8">
            <div className="space-y-8">
              {!isGrading && progress.total === 0 ? (
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <AlertCircle className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Ready to grade</h2>
                    <p className="text-muted-foreground mb-6">
                      Click the button below to start grading {examCount} exam(s).
                      This operation may take a few minutes.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={onBack} className="flex-1">
                      Back
                    </Button>
                    <Button onClick={onStartGrading} className="flex-1 gap-2">
                      <Loader2 className="h-4 w-4" />
                      Start grading
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">Progress</h3>
                      <span className="text-sm font-medium text-muted-foreground">
                        {progress.completed} / {progress.total}
                      </span>
                    </div>
                    <Progress value={percentage} className="h-3" />
                    <p className="text-sm text-muted-foreground mt-2">
                      {Math.round(percentage)}% completed
                    </p>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      {isComplete ? (
                        <>
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium text-green-700">
                              Grading completed
                            </p>
                            <p className="text-sm text-muted-foreground">
                              All exams have been processed successfully
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin text-primary" />
                          <div>
                            <p className="font-medium">Grading in progress...</p>
                            <p className="text-sm text-muted-foreground">
                              Please wait
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {isComplete && (
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={onBack} className="flex-1">
                        Retour
                      </Button>
                      <Button disabled className="flex-1">
                        View results
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
