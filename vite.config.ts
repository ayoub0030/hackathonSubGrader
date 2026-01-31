import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { Plugin } from "vite";

function apiPlugin(env: Record<string, string>): Plugin {
  return {
    name: "api-plugin",
    configResolved(config) {
      // Store config for use in middleware
    },
    configureServer(server) {
      return () => {
        server.middlewares.use("/api", async (req, res, next) => {
          try {
            if (req.url === "/send-email" && req.method === "POST") {
              let body = "";
              req.on("data", (chunk) => {
                body += chunk.toString();
              });
              req.on("end", async () => {
                try {
                  const data = JSON.parse(body);
                  const { studentEmail, studentName, result, teacherName } =
                    data;

                  if (!studentEmail || !studentName || !result) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(
                      JSON.stringify({
                        success: false,
                        error: "Missing required fields",
                      })
                    );
                    return;
                  }

                  const RESEND_API_KEY = env.VITE_RESEND_API_KEY;
                  console.log("[EMAIL] Checking for RESEND_API_KEY...");
                  console.log("[EMAIL] RESEND_API_KEY exists:", !!RESEND_API_KEY);
                  
                  if (!RESEND_API_KEY) {
                    console.error(
                      "[EMAIL] VITE_RESEND_API_KEY not set in environment variables"
                    );
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.end(
                      JSON.stringify({
                        success: false,
                        error: "Email service not configured",
                      })
                    );
                    return;
                  }

                  console.log(
                    `[EMAIL] Sending grading report to ${studentEmail}...`
                  );

                  const htmlContent = generateGradingReportHTML(
                    studentName,
                    result,
                    teacherName || "Your Teacher"
                  );

                  const response = await fetch(
                    "https://api.resend.com/emails",
                    {
                      method: "POST",
                      headers: {
                        Authorization: `Bearer ${RESEND_API_KEY}`,
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        from: "CoTeacher <onboarding@resend.dev>",
                        to: studentEmail,
                        subject: `Your Grading Report - ${result.overall_assessment.letter_grade}`,
                        html: htmlContent,
                      }),
                    }
                  );

                  if (!response.ok) {
                    const errorData = await response.json();
                    console.error("[EMAIL] Resend API error:", errorData);
                    res.writeHead(response.status, {
                      "Content-Type": "application/json",
                    });
                    res.end(
                      JSON.stringify({
                        success: false,
                        error: errorData.message || "Failed to send email",
                      })
                    );
                    return;
                  }

                  const responseData = await response.json();
                  console.log(
                    `[EMAIL] Email sent successfully. Message ID: ${responseData.id}`
                  );

                  res.writeHead(200, { "Content-Type": "application/json" });
                  res.end(
                    JSON.stringify({
                      success: true,
                      messageId: responseData.id,
                    })
                  );
                } catch (error) {
                  console.error("[EMAIL] Error sending email:", error);
                  res.writeHead(500, { "Content-Type": "application/json" });
                  res.end(
                    JSON.stringify({
                      success: false,
                      error:
                        error instanceof Error
                          ? error.message
                          : "Unknown error",
                    })
                  );
                }
              });
            } else {
              next();
            }
          } catch (error) {
            console.error("[API] Error:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                success: false,
                error: "Internal server error",
              })
            );
          }
        });
      };
    },
  };
}

function generateGradingReportHTML(
  studentName: string,
  result: any,
  teacherName: string
): string {
  const totalScore = result.overall_assessment.total_score;
  const maxScore = result.overall_assessment.total_max_score;
  const percentage = Math.round((totalScore / maxScore) * 100);
  const letterGrade = result.overall_assessment.letter_grade;

  const questionDetailsHTML = result.grading_breakdown
    .map(
      (item: any, idx: number) => `
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 16px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <h4 style="color: #1e293b; font-size: 16px; font-weight: 600; margin: 0;">Q${idx + 1}: ${item.category}</h4>
        <span style="color: #0369a1; font-size: 16px; font-weight: 700;">${item.score}/${item.max_score}</span>
      </div>
      <span style="display: inline-block; background: #dbeafe; color: #0369a1; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; margin-bottom: 12px;">${item.proficiency_level}</span>
      <p style="color: #475569; font-size: 14px; line-height: 24px; margin: 12px 0;">${item.justification}</p>
      ${
        item.student_comment
          ? `
      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px; margin-top: 12px;">
        <p style="color: #15803d; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">Feedback for You</p>
        <p style="color: #166534; font-size: 13px; line-height: 22px; margin: 0;">${item.student_comment}</p>
      </div>
      `
          : ""
      }
    </div>
  `
    )
    .join("");

  const strengthsHTML = result.feedback.strengths
    .map((strength: string) => `<li style="margin-bottom: 8px;">${strength}</li>`)
    .join("");

  const improvementHTML = result.feedback.areas_for_improvement
    .map((area: string) => `<li style="margin-bottom: 8px;">${area}</li>`)
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Grading Report</title>
</head>
<body style="margin: 0; padding: 0; background: #f8fafc; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Ubuntu,sans-serif;">
  <div style="background: #f8fafc; padding: 48px 0;">
    <div style="background: #ffffff; border: 1px solid #e2e8f0; margin: 0 auto; padding: 52px 48px; border-radius: 12px; max-width: 640px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);">
      
      <div style="display: flex; justify-content: center; margin-bottom: 24px;">
        <span style="display: inline-block; padding: 6px 16px; border-radius: 999px; background: #dbeafe; color: #0369a1; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; border: 1px solid #bae6fd; font-weight: 600;">CoTeacher · Grading Report</span>
      </div>

      <h1 style="color: #1e293b; font-size: 30px; font-weight: 700; margin: 28px 0 12px; text-align: center; letter-spacing: -0.01em;">Your Exam Has Been Graded</h1>
      <p style="color: #64748b; font-size: 16px; line-height: 28px; text-align: center; margin: 0 0 28px;">Hi ${studentName}, your exam has been carefully evaluated by <strong>${teacherName}</strong>. Here's your detailed feedback.</p>

      <div style="background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%); border-radius: 12px; padding: 28px; margin: 28px 0; border: 1px solid #bae6fd;">
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
          <div style="text-align: center;">
            <p style="color: #475569; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px; font-weight: 600;">Overall Score</p>
            <p style="color: #0369a1; font-size: 24px; font-weight: 700; margin: 0;">${totalScore}/${maxScore}</p>
          </div>
          <div style="text-align: center;">
            <p style="color: #475569; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px; font-weight: 600;">Percentage</p>
            <p style="color: #0369a1; font-size: 24px; font-weight: 700; margin: 0;">${percentage}%</p>
          </div>
          <div style="text-align: center;">
            <p style="color: #475569; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px; font-weight: 600;">Grade</p>
            <p style="color: #0369a1; font-size: 24px; font-weight: 700; margin: 0;">${letterGrade}</p>
          </div>
        </div>
      </div>

      <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 12px; padding: 24px; margin: 24px 0;">
        <h3 style="color: #1e293b; font-size: 18px; font-weight: 600; margin: 0 0 16px;">Summary</h3>
        <p style="color: #475569; font-size: 15px; line-height: 26px; margin: 0;">${result.feedback.summary_note}</p>
      </div>

      <div style="margin: 28px 0;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px;">
            <h4 style="color: #1e293b; font-size: 16px; font-weight: 600; margin: 0 0 12px; color: #10b981;">✓ Strengths</h4>
            <ul style="color: #475569; font-size: 14px; line-height: 24px; margin: 0; padding-left: 20px;">
              ${strengthsHTML}
            </ul>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px;">
            <h4 style="color: #1e293b; font-size: 16px; font-weight: 600; margin: 0 0 12px; color: #f59e0b;">→ Areas for Improvement</h4>
            <ul style="color: #475569; font-size: 14px; line-height: 24px; margin: 0; padding-left: 20px;">
              ${improvementHTML}
            </ul>
          </div>
        </div>
      </div>

      <div style="margin: 28px 0;">
        <h3 style="color: #1e293b; font-size: 18px; font-weight: 600; margin: 0 0 16px;">Detailed Feedback by Question</h3>
        ${questionDetailsHTML}
      </div>

      <div style="background: #fef3c7; border: 1px solid #fcd34d; border-radius: 12px; padding: 24px; margin: 28px 0;">
        <h3 style="color: #92400e; font-size: 18px; font-weight: 600; margin: 0 0 16px;">Next Steps</h3>
        <ul style="color: #78350f; font-size: 14px; line-height: 24px; margin: 0; padding-left: 20px;">
          <li style="margin-bottom: 8px;">Review the feedback carefully</li>
          <li style="margin-bottom: 8px;">Focus on the areas marked for improvement</li>
          <li style="margin-bottom: 8px;">Reach out to your teacher if you have questions</li>
          <li style="margin-bottom: 8px;">Use this feedback to strengthen your skills</li>
        </ul>
      </div>

      <hr style="border-color: #e2e8f0; margin: 36px 0;">
      <p style="color: #94a3b8; font-size: 13px; line-height: 22px; margin: 8px 0; text-align: center;">This is an automated grading report from CoTeacher. If you have questions about your grade, please contact your teacher.</p>
      <p style="color: #94a3b8; font-size: 13px; line-height: 22px; margin: 8px 0; text-align: center;">© 2025 CoTeacher. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  
  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      mode === "development" && componentTagger(),
      mode === "development" && apiPlugin(env),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
