import { useState, useEffect } from "react";
import { Plus, MessageSquare, Zap, Upload, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "react-router-dom";

interface Action {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  color?: string;
}

interface FloatingActionButtonProps {
  actions?: Action[];
}

export function FloatingActionButton({ actions = [] }: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const location = useLocation();

  // Show scroll-to-top button when user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const defaultActions: Action[] = [
    {
      id: 'new-essay',
      label: 'Grade Essay',
      icon: <Plus className="h-4 w-4" />,
      onClick: () => {
        const gradingForm = document.getElementById('grading-form');
        if (gradingForm) {
          gradingForm.scrollIntoView({ behavior: 'smooth' });
        }
      },
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      id: 'batch-grade',
      label: 'Batch Grade',
      icon: <Upload className="h-4 w-4" />,
      onClick: () => {
        if (location.pathname !== '/class-exam') {
          window.location.href = '/class-exam';
        }
      },
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      id: 'feedback',
      label: 'Send Feedback',
      icon: <MessageSquare className="h-4 w-4" />,
      onClick: () => {
        // Open feedback modal or navigate to feedback page
        window.open('mailto:support@coteacher.ai?subject=Feedback about CoTeacher', '_blank');
      },
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ];

  const allActions = actions.length > 0 ? actions : defaultActions;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {/* Action Items */}
        {isOpen && (
          <div className="flex flex-col items-end gap-2 animate-fade-in">
            {allActions.map((action, index) => (
              <Card
                key={action.id}
                className="flex items-center gap-3 px-4 py-2 shadow-lg border-0"
                style={{
                  animationDelay: `${index * 50}ms`,
                  opacity: 0,
                  animation: 'slideUp 0.3s ease-out forwards'
                }}
              >
                <span className="text-sm font-medium whitespace-nowrap">{action.label}</span>
                <Button
                  size="icon"
                  className={`h-8 w-8 rounded-full text-white ${action.color || 'bg-primary hover:bg-primary/90'}`}
                  onClick={() => {
                    action.onClick();
                    setIsOpen(false);
                  }}
                >
                  {action.icon}
                </Button>
              </Card>
            ))}
          </div>
        )}

        {/* Main FAB */}
        <Button
          size="lg"
          className={`h-14 w-14 rounded-full shadow-lg transition-all duration-300 ${
            isOpen ? 'rotate-45' : ''
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          size="icon"
          className="fixed bottom-6 left-6 h-10 w-10 rounded-full shadow-lg z-40 animate-fade-in"
          onClick={scrollToTop}
          title="Scroll to top"
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
      )}

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-slide-up {
          animation: slideUp 0.3s ease-out forwards;
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
}

// Quick Action Button for specific actions
export function QuickActionButton({ 
  action, 
  className 
}: { 
  action: Action; 
  className?: string;
}) {
  return (
    <Button
      className={`h-12 w-12 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${className || action.color || 'bg-primary hover:bg-primary/90'}`}
      onClick={action.onClick}
      title={action.label}
    >
      {action.icon}
    </Button>
  );
}
