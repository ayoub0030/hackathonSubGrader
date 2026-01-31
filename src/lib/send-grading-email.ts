import { GradingResult } from "@/components/GradingResults";

interface SendGradingEmailInput {
  studentEmail: string;
  studentName: string;
  result: GradingResult;
  teacherName?: string;
}

interface SendGradingEmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export async function sendGradingEmail(
  input: SendGradingEmailInput
): Promise<SendGradingEmailResponse> {
  try {
    console.log(`[EMAIL] Sending grading report to ${input.studentEmail}...`);

    // Call backend API endpoint instead of Resend directly
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentEmail: input.studentEmail,
        studentName: input.studentName,
        result: input.result,
        teacherName: input.teacherName || "Your Teacher",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("[EMAIL] Backend API error:", errorData);
      return {
        success: false,
        error: errorData.error || "Failed to send email",
      };
    }

    const data = await response.json();
    console.log(`[EMAIL] Email sent successfully. Message ID: ${data.messageId}`);

    return {
      success: true,
      messageId: data.messageId,
    };
  } catch (error) {
    console.error("[EMAIL] Error sending email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
