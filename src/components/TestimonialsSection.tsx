import { useState, useEffect } from "react";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  school: string;
  content: string;
  rating: number;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    role: "English Department Head",
    school: "Lincoln High School",
    content: "CoTeacher has revolutionized how we handle essay grading. What used to take me hours now takes minutes, and the feedback quality is exceptional. My students love the detailed comments they receive.",
    rating: 5,
    avatar: "SJ"
  },
  {
    id: 2,
    name: "Prof. Michael Chen",
    role: "Writing Instructor",
    school: "University of California",
    content: "As a university instructor with 200+ students, CoTeacher has been a game-changer. The AI understands complex writing assignments and provides rubric-aligned feedback that saves me countless hours.",
    rating: 5,
    avatar: "MC"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Middle School Teacher",
    school: "Washington Middle School",
    content: "I was skeptical about AI grading, but CoTeacher proved me wrong. It's fair, consistent, and helps me focus more on teaching rather than grading. My students' writing skills have improved significantly!",
    rating: 5,
    avatar: "ER"
  },
  {
    id: 4,
    name: "James Thompson",
    role: "History Teacher",
    school: "Riverside Academy",
    content: "The rubric customization is fantastic. I can tailor the grading criteria to match my exact requirements. CoTeacher handles the heavy lifting while I maintain full control over the standards.",
    rating: 5,
    avatar: "JT"
  }
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextTestimonial();
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <div className="mx-auto max-w-4xl">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Trusted by Educators Worldwide
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See what teachers and professors are saying about their experience with CoTeacher
            </p>
          </div>

          {/* Testimonial Carousel */}
          <div className="relative">
            <Card className="p-8 md:p-12 bg-gradient-to-br from-card to-background border-border shadow-xl">
              {/* Navigation Buttons */}
              <div className="absolute top-1/2 -translate-y-1/2 left-2 md:left-4 z-10">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevTestimonial}
                  className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 right-2 md:right-4 z-10">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextTestimonial}
                  className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Testimonial Content */}
              <div className="text-center max-w-3xl mx-auto">
                <Quote className="h-12 w-12 text-primary mx-auto mb-6 opacity-50" />
                
                <blockquote className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
                  "{currentTestimonial.content}"
                </blockquote>

                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-lg">
                    {currentTestimonial.avatar}
                  </div>
                  <div className="text-left">
                    <cite className="font-semibold text-foreground not-italic">
                      {currentTestimonial.name}
                    </cite>
                    <p className="text-sm text-muted-foreground">
                      {currentTestimonial.role}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {currentTestimonial.school}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center justify-center gap-1 mb-8">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < currentTestimonial.rating
                          ? "text-yellow-400 fill-current"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </Card>

            {/* Dots Indicator */}
            <div className="flex items-center justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "w-8 bg-primary"
                      : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            {/* Auto-play Toggle */}
            <div className="text-center mt-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="text-muted-foreground hover:text-foreground"
              >
                {isAutoPlaying ? "Pause" : "Play"} automatic rotation
              </Button>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-1">4.9/5</div>
              <p className="text-sm text-muted-foreground">Average Rating</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-1">2,500+</div>
              <p className="text-sm text-muted-foreground">Reviews</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-1">98%</div>
              <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-1">24/7</div>
              <p className="text-sm text-muted-foreground">Support Available</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
