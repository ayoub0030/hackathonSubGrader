import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Loader2, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ProgressStep {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed" | "error";
  error?: string;
}

interface ProgressTrackerProps {
  steps: ProgressStep[];
  currentStepIndex?: number;
  className?: string;
}

export function ProgressTracker({ 
  steps, 
  currentStepIndex = 0, 
  className 
}: ProgressTrackerProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const targetProgress = (currentStepIndex / (steps.length - 1)) * 100;
    const timer = setTimeout(() => {
      setAnimatedProgress(targetProgress);
    }, 100);

    return () => clearTimeout(timer);
  }, [currentStepIndex, steps.length]);

  const getStepIcon = (status: ProgressStep["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "in-progress":
        return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStepColor = (status: ProgressStep["status"], index: number) => {
    if (status === "error") return "border-red-200 bg-red-50";
    if (status === "completed") return "border-green-200 bg-green-50";
    if (index === currentStepIndex) return "border-blue-200 bg-blue-50";
    return "border-muted bg-background";
  };

  return (
    <Card className={cn("p-6", className)}>
      <div className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Overall Progress</span>
            <span className="text-muted-foreground">
              {currentStepIndex + 1} of {steps.length} steps
            </span>
          </div>
          <Progress value={animatedProgress} className="h-2" />
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                "flex items-start gap-4 p-4 rounded-lg border transition-all duration-300",
                getStepColor(step.status, index)
              )}
            >
              <div className="flex-shrink-0 mt-0.5">
                {getStepIcon(step.status)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={cn(
                    "font-medium",
                    step.status === "completed" && "text-green-700",
                    step.status === "error" && "text-red-700",
                    index === currentStepIndex && "text-blue-700"
                  )}>
                    {step.title}
                  </h3>
                  {step.status === "in-progress" && (
                    <span className="text-xs text-blue-600 font-medium">
                      Processing...
                    </span>
                  )}
                </div>
                
                <p className={cn(
                  "text-sm",
                  step.status === "completed" && "text-green-600",
                  step.status === "error" && "text-red-600",
                  index === currentStepIndex && "text-blue-600"
                )}>
                  {step.description}
                </p>
                
                {step.error && (
                  <div className="mt-2 p-2 rounded bg-red-100 border border-red-200">
                    <p className="text-xs text-red-700">{step.error}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

// Batch grading specific progress tracker
export function BatchGradingProgressTracker({ 
  currentStep, 
  totalSteps, 
  currentFileName 
}: {
  currentStep: number;
  totalSteps: number;
  currentFileName?: string;
}) {
  const steps: ProgressStep[] = [
    {
      id: "upload",
      title: "Upload Files",
      description: "Uploading exam files to server",
      status: currentStep >= 0 ? "completed" : "pending"
    },
    {
      id: "extract",
      title: "Extract Questions",
      description: "Analyzing exam structure and questions",
      status: currentStep >= 1 ? "completed" : currentStep === 0 ? "in-progress" : "pending"
    },
    {
      id: "grade",
      title: "Grade Essays",
      description: currentFileName 
        ? `Grading: ${currentFileName}` 
        : "Processing student essays",
      status: currentStep >= 2 ? "completed" : currentStep === 1 ? "in-progress" : "pending"
    },
    {
      id: "compile",
      title: "Compile Results",
      description: "Generating comprehensive grading report",
      status: currentStep >= 3 ? "completed" : currentStep === 2 ? "in-progress" : "pending"
    }
  ];

  return (
    <ProgressTracker 
      steps={steps} 
      currentStepIndex={Math.min(currentStep, steps.length - 1)}
    />
  );
}
