import { ArrowRight, Sparkles, Clock, Target, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onStartGrading: () => void;
}

export function HeroSection({ onStartGrading }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background gradient */}
      <div 
        className="absolute inset-0 -z-10"
        style={{ background: 'var(--gradient-hero)' }}
      />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-sm backdrop-blur-sm animate-fade-in">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-muted-foreground">Correction de dissertations assistée par IA</span>
          </div>

          {/* Headline */}
          <h1 className="mb-6 font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl animate-slide-up">
            Corrigez des dissertations en{" "}
            <span className="gradient-text">Seconds</span>
            <br />
            Pas en heures
          </h1>

          {/* Subheadline */}
          <p className="mb-10 text-lg text-muted-foreground md:text-xl animate-slide-up stagger-1" style={{ opacity: 0 }}>
            Transformez votre façon de corriger grâce à une IA qui comprend les grilles d'évaluation,
            fournit des retours constructifs et vous fait gagner un temps précieux.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up stagger-2" style={{ opacity: 0 }}>
            <Button variant="hero" size="xl" onClick={onStartGrading}>
              Commencer gratuitement
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground animate-slide-up stagger-3" style={{ opacity: 0 }}>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>Correction en moins de 30 secondes</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <span>Retours alignés sur la grille</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span>Juste et sans biais</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
