import { useState, useEffect } from "react";
import { ArrowRight, Sparkles, Clock, Target, Shield, Play, Users, FileText, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface HeroSectionProps {
  onStartGrading: () => void;
}

export function HeroSection({ onStartGrading }: HeroSectionProps) {
  const [isDemoPlaying, setIsDemoPlaying] = useState(false);
  const [stats, setStats] = useState({
    essaysGraded: 0,
    timeSaved: 0,
    teachersCount: 0
  });

  // Animated counter effect
  useEffect(() => {
    const targetStats = {
      essaysGraded: 125000,
      timeSaved: 8750,
      teachersCount: 3200
    };

    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = {
      essaysGraded: targetStats.essaysGraded / steps,
      timeSaved: targetStats.timeSaved / steps,
      teachersCount: targetStats.teachersCount / steps
    };

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      setStats({
        essaysGraded: Math.floor(increment.essaysGraded * currentStep),
        timeSaved: Math.floor(increment.timeSaved * currentStep),
        teachersCount: Math.floor(increment.teachersCount * currentStep)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

  const handleDemoClick = () => {
    setIsDemoPlaying(true);
    // In a real app, this would open a modal or navigate to demo
    setTimeout(() => setIsDemoPlaying(false), 3000);
  };
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
            <span className="text-muted-foreground">AI-powered essay grading</span>
          </div>

          {/* Headline */}
          <h1 className="mb-6 font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl animate-slide-up">
            Grade essays in{" "}
            <span className="gradient-text">Seconds</span>
            <br />
            Not hours
          </h1>

          {/* Subheadline */}
          <p className="mb-10 text-lg text-muted-foreground md:text-xl animate-slide-up stagger-1" style={{ opacity: 0 }}>
            Transform your grading with AI that understands rubrics,
            provides constructive feedback, and saves you precious time.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up stagger-2" style={{ opacity: 0 }}>
            <Button variant="hero" size="xl" onClick={onStartGrading}>
              Start for free
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Animated Statistics */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up stagger-4" style={{ opacity: 0 }}>
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="h-6 w-6 text-primary" />
                <h3 className="font-semibold text-primary">Essays Graded</h3>
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">
                {stats.essaysGraded.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">And counting</p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="h-6 w-6 text-green-600" />
                <h3 className="font-semibold text-green-600">Hours Saved</h3>
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">
                {stats.timeSaved.toLocaleString()}+
              </p>
              <p className="text-sm text-muted-foreground">For teachers worldwide</p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
              <div className="flex items-center gap-3 mb-2">
                <Users className="h-6 w-6 text-accent" />
                <h3 className="font-semibold text-accent">Active Teachers</h3>
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">
                {stats.teachersCount.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Across 50+ countries</p>
            </Card>
          </div>

          {/* Live Demo Preview */}
          <div className="mt-16 animate-slide-up stagger-5" style={{ opacity: 0 }}>
            <Card className="p-8 bg-gradient-to-br from-card to-muted/30 border-border">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">See CoTeacher in Action</h3>
                <p className="text-muted-foreground">
                  Watch how AI transforms essay grading in real-time
                </p>
              </div>
              
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted/50 mb-6">
                {isDemoPlaying ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                    <div className="text-center">
                      <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                      <p className="text-lg font-medium">Loading demo...</p>
                      <p className="text-sm text-muted-foreground mt-2">Experience the power of AI grading</p>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 cursor-pointer hover:from-primary/10 hover:to-accent/10 transition-all duration-300 group"
                       onClick={handleDemoClick}>
                    <div className="text-center">
                      <div className="h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/30 transition-colors">
                        <Play className="h-8 w-8 text-primary ml-1" />
                      </div>
                      <p className="text-lg font-medium mb-2">Click to Play Demo</p>
                      <p className="text-sm text-muted-foreground">2-minute interactive walkthrough</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-lg bg-muted/30">
                  <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <p className="font-semibold">95% Accuracy</p>
                  <p className="text-xs text-muted-foreground">AI-powered grading</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <Target className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="font-semibold">30 Seconds</p>
                  <p className="text-xs text-muted-foreground">Average grading time</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <Shield className="h-6 w-6 text-accent mx-auto mb-2" />
                  <p className="font-semibold">100% Private</p>
                  <p className="text-xs text-muted-foreground">Secure & confidential</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
