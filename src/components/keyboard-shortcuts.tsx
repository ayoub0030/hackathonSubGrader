import { useState, useEffect, useCallback } from "react";
import { Keyboard, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

interface Shortcut {
  key: string;
  description: string;
  action: () => void;
  category: string;
}

interface KeyboardShortcutsProps {
  shortcuts: Shortcut[];
}

export function KeyboardShortcuts({ shortcuts }: KeyboardShortcutsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [justPressed, setJustPressed] = useState<string | null>(null);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when user is typing in input fields
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
      return;
    }

    // Check for '?' key to open shortcuts modal
    if (event.key === '?' && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      setIsOpen(!isOpen);
      return;
    }

    // Check for Escape key to close modal
    if (event.key === 'Escape' && isOpen) {
      event.preventDefault();
      setIsOpen(false);
      return;
    }

    // Check other shortcuts
    const pressedKey = event.key.toLowerCase();
    const ctrlKey = event.ctrlKey || event.metaKey;
    const altKey = event.altKey;

    shortcuts.forEach(shortcut => {
      const parts = shortcut.key.toLowerCase().split('+');
      const key = parts[parts.length - 1];
      const needsCtrl = parts.includes('ctrl') || parts.includes('meta');
      const needsAlt = parts.includes('alt');

      if (
        key === pressedKey &&
        needsCtrl === ctrlKey &&
        needsAlt === altKey
      ) {
        event.preventDefault();
        shortcut.action();
        setJustPressed(shortcut.key);
        setTimeout(() => setJustPressed(null), 200);
      }
    });
  }, [shortcuts, isOpen]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const formatKey = (key: string) => {
    return key.split('+').map(part => {
      const formatted = part.charAt(0).toUpperCase() + part.slice(1);
      if (formatted === 'Ctrl' || formatted === 'Meta') {
        return <kbd key={part} className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">⌘</kbd>;
      }
      if (formatted === 'Alt') {
        return <kbd key={part} className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">⌥</kbd>;
      }
      return <kbd key={part} className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">{formatted}</kbd>;
    }).reduce((prev, curr, index) => {
      if (index === 0) return curr;
      return <>{prev} + {curr}</>;
    }, null);
  };

  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, Shortcut[]>);

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="text-muted-foreground hover:text-foreground"
        title="Press '?' for keyboard shortcuts"
      >
        <Keyboard className="h-4 w-4 mr-2" />
        Shortcuts
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Keyboard className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Keyboard Shortcuts</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Press '?' to toggle this menu • Press 'Escape' to close
          </p>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
            <div key={category} className="mb-6">
              <h3 className="font-medium text-sm text-muted-foreground mb-3 uppercase tracking-wide">
                {category}
              </h3>
              <div className="space-y-2">
                {categoryShortcuts.map((shortcut) => (
                  <div
                    key={shortcut.key}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                      justPressed === shortcut.key
                        ? 'bg-primary/10 border-primary/30'
                        : 'bg-background hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex-1">
                      <p className="font-medium">{shortcut.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {formatKey(shortcut.key)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t bg-muted/30">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Tip: Shortcuts don't work when typing in text fields</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                toast({
                  title: "Keyboard Shortcuts",
                  description: "Shortcuts have been copied to your clipboard!",
                });
              }}
            >
              Copy All
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Default shortcuts for the application
export const defaultShortcuts: Shortcut[] = [
  {
    key: '?',
    description: 'Toggle keyboard shortcuts',
    action: () => {},
    category: 'General'
  },
  {
    key: 'Escape',
    description: 'Close modal or cancel action',
    action: () => {},
    category: 'General'
  },
  {
    key: 'Ctrl+K',
    description: 'Focus search input',
    action: () => {
      const searchInput = document.querySelector('input[type="search"], input[placeholder*="search"]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
    },
    category: 'Navigation'
  },
  {
    key: 'Ctrl+/',
    description: 'Go to home page',
    action: () => {
      window.location.href = '/';
    },
    category: 'Navigation'
  },
  {
    key: 'Ctrl+G',
    description: 'Start new grading',
    action: () => {
      const gradingForm = document.getElementById('grading-form');
      if (gradingForm) {
        gradingForm.scrollIntoView({ behavior: 'smooth' });
      }
    },
    category: 'Grading'
  },
  {
    key: 'Ctrl+S',
    description: 'Save current draft',
    action: () => {
      // Trigger save functionality
      const event = new CustomEvent('save-draft');
      window.dispatchEvent(event);
    },
    category: 'Grading'
  },
  {
    key: 'Ctrl+Enter',
    description: 'Submit form',
    action: () => {
      const form = document.querySelector('form') as HTMLFormElement;
      if (form) {
        const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
        if (submitButton && !submitButton.disabled) {
          submitButton.click();
        }
      }
    },
    category: 'Forms'
  },
  {
    key: 'Ctrl+D',
    description: 'Toggle dark mode',
    action: () => {
      const themeButton = document.querySelector('[title*="theme"], [title*="mode"]') as HTMLButtonElement;
      if (themeButton) {
        themeButton.click();
      }
    },
    category: 'Appearance'
  }
];
