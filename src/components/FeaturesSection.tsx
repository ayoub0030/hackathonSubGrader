import { Zap, BookOpen, MessageSquareText, BarChart3, Shield, Users } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Ultra rapide",
    description: "Corrigez des dissertations en moins de 30 secondes grâce à notre moteur IA avancé.",
  },
  {
    icon: BookOpen,
    title: "Aligné sur la grille",
    description: "Des grilles personnalisables garantissent une correction cohérente et équitable à chaque fois.",
  },
  {
    icon: MessageSquareText,
    title: "Retours actionnables",
    description: "Les élèves reçoivent des retours précis et encourageants, réellement utiles.",
  },
  {
    icon: BarChart3,
    title: "Analyses détaillées",
    description: "Suivez la progression dans le temps grâce à des indicateurs de performance complets.",
  },
  {
    icon: Shield,
    title: "Sans biais",
    description: "Notre IA évalue la qualité de l'écriture, pas l'identité ni les opinions de l'élève.",
  },
  {
    icon: Users,
    title: "Conçu pour les enseignants",
    description: "Conçu par des enseignants, pour des enseignants. Gagnez du temps sans sacrifier la qualité.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 md:py-24 bg-secondary/30">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="mb-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Tout ce qu'il vous faut pour corriger plus intelligemment
          </h2>
          <p className="text-muted-foreground text-lg">
            Des fonctionnalités puissantes pour transformer votre manière de corriger.
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
