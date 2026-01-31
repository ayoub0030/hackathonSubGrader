import { useState } from "react";
import { Loader2, Mail, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { sendGradingEmail } from "@/lib/send-grading-email";
import { BatchGradingResult } from "@/lib/grade-with-scores";

interface SendEmailModalProps {
  results: BatchGradingResult[];
  isOpen: boolean;
  onClose: () => void;
}

interface StudentEmail {
  examId: string;
  studentName: string;
  email: string;
}

export function SendEmailModal({
  results,
  isOpen,
  onClose,
}: SendEmailModalProps) {
  const [studentEmails, setStudentEmails] = useState<StudentEmail[]>(
    results
      .filter((r) => r.status === "success")
      .map((r) => ({
        examId: r.examId,
        studentName: r.studentName,
        email: "",
      }))
  );
  const [isSending, setIsSending] = useState(false);
  const [sentCount, setSentCount] = useState(0);

  const handleEmailChange = (examId: string, email: string) => {
    setStudentEmails(
      studentEmails.map((se) =>
        se.examId === examId ? { ...se, email } : se
      )
    );
  };

  const handleSendEmails = async () => {
    const incompleteEmails = studentEmails.filter((se) => !se.email.trim());
    if (incompleteEmails.length > 0) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une adresse email pour chaque élève",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    setSentCount(0);

    let successCount = 0;
    let errorCount = 0;

    for (const studentEmail of studentEmails) {
      const result = results.find((r) => r.examId === studentEmail.examId);
      if (!result || !result.result) continue;

      const response = await sendGradingEmail({
        studentEmail: studentEmail.email,
        studentName: studentEmail.studentName,
        result: result.result,
        teacherName: "Your Teacher",
      });

      if (response.success) {
        successCount++;
      } else {
        errorCount++;
        console.error(
          `Failed to send email to ${studentEmail.email}:`,
          response.error
        );
      }

      setSentCount(successCount + errorCount);
    }

    setIsSending(false);

    if (errorCount === 0) {
      toast({
        title: "Succès",
        description: `${successCount} email(s) envoyé(s) avec succès`,
      });
      onClose();
    } else {
      toast({
        title: "Partiellement complété",
        description: `${successCount} email(s) envoyé(s), ${errorCount} erreur(s)`,
        variant: "destructive",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-background border-b border-border p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Envoyer les rapports par email</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-sm text-muted-foreground">
            Entrez l'adresse email de chaque élève pour recevoir son rapport de correction.
          </p>

          <div className="space-y-4 max-h-[calc(90vh-300px)] overflow-y-auto">
            {studentEmails.map((studentEmail, idx) => (
              <div key={studentEmail.examId} className="space-y-2">
                <Label className="text-sm font-medium">
                  {idx + 1}. {studentEmail.studentName}
                </Label>
                <Input
                  type="email"
                  placeholder="exemple@email.com"
                  value={studentEmail.email}
                  onChange={(e) =>
                    handleEmailChange(studentEmail.examId, e.target.value)
                  }
                  disabled={isSending}
                />
              </div>
            ))}
          </div>

          {isSending && sentCount > 0 && (
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Envoi en cours... {sentCount}/{studentEmails.length}
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSending}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              onClick={handleSendEmails}
              disabled={isSending}
              className="flex-1 gap-2"
            >
              {isSending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4" />
                  Envoyer les emails
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
