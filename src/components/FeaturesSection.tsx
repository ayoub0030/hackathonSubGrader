import { Zap, BookOpen, MessageSquareText, BarChart3, Shield, Users } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Ultra-fast",
    description: "Grade essays in under 30 seconds with our advanced AI engine.",
  },
  {
    icon: BookOpen,
    title: "Rubric-aligned",
    description: "Customizable rubrics ensure consistent and fair grading every time.",
  },
  {
    icon: MessageSquareText,
    title: "Actionable feedback",
    description: "Students receive precise, encouraging feedback that's genuinely useful.",
  },
  {
    icon: BarChart3,
    title: "Detailed analytics",
    description: "Track progress over time with comprehensive performance metrics.",
  },
  {
    icon: Shield,
    title: "Unbiased",
    description: "Our AI evaluates writing quality, not student identity or opinions.",
  },
  {
    icon: Users,
    title: "Built for teachers",
    description: "Designed by teachers, for teachers. Save time without sacrificing quality.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 md:py-24 bg-secondary/30">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="mb-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to grade smarter
          </h2>
          <p className="text-muted-foreground text-lg">
            Powerful features to transform your grading workflow.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group glass-card p-6 hover-lift animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s`, opacity: 0 }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-display text-lg font-semibold">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
