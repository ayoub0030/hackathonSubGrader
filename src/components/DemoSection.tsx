import { Play, CheckCircle } from "lucide-react";

export function DemoSection() {
  return (
    <section id="demo" className="py-16 md:py-24 bg-secondary/30">
      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            See CoTeacher in action
          </h2>
          <p className="mb-10 text-muted-foreground max-w-2xl mx-auto">
            See how CoTeacher transforms essay grading, saving teachers hours while providing students with useful feedback.
          </p>

          {/* Demo Video Placeholder */}
          <div className="relative aspect-video rounded-2xl bg-card border border-border overflow-hidden shadow-xl">
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-lg hover:bg-primary transition-colors cursor-pointer hover:scale-105 transform duration-200">
                <Play className="h-8 w-8 ml-1" />
              </div>
              <p className="mt-4 text-sm text-muted-foreground">Click to watch demo</p>
            </div>
          </div>

          {/* Demo Highlights */}
          <div className="mt-10 grid gap-4 sm:grid-cols-3 text-left">
            <div className="flex items-start gap-3 rounded-lg bg-card p-4 border border-border">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-sm">Instant grading</p>
                <p className="text-xs text-muted-foreground">See how essays are graded in seconds</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-card p-4 border border-border">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-sm">Detailed feedback</p>
                <p className="text-xs text-muted-foreground">Rubric-aligned comments for each criterion</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-card p-4 border border-border">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-sm">Student-ready reports</p>
                <p className="text-xs text-muted-foreground">Exportable feedback students can use</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
