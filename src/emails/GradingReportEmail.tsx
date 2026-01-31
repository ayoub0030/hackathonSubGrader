import React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { GradingResult } from "@/components/GradingResults";

interface GradingReportEmailProps {
  studentName: string;
  result: GradingResult;
  teacherName?: string;
}

export default function GradingReportEmail({
  studentName,
  result,
  teacherName = "Your Teacher",
}: GradingReportEmailProps) {
  const totalScore = result.overall_assessment.total_score;
  const maxScore = result.overall_assessment.total_max_score;
  const percentage = Math.round((totalScore / maxScore) * 100);
  const letterGrade = result.overall_assessment.letter_grade;

  return (
    <Html>
      <Head />
      <Preview>Your Grading Report - {letterGrade}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={badgeRow}>
            <Text style={badge}>CoTeacher · Grading Report</Text>
          </Section>

          <Heading style={h1}>Your Exam Has Been Graded</Heading>
          <Text style={tagline}>
            Hi {studentName}, your exam has been carefully evaluated by{" "}
            <strong>{teacherName}</strong>. Here's your detailed feedback.
          </Text>

          <Section style={scoreBox}>
            <div style={scoreGrid}>
              <div style={scoreItem}>
                <Text style={scoreLabel}>Overall Score</Text>
                <Text style={scoreValue}>
                  {totalScore}/{maxScore}
                </Text>
              </div>
              <div style={scoreItem}>
                <Text style={scoreLabel}>Percentage</Text>
                <Text style={scoreValue}>{percentage}%</Text>
              </div>
              <div style={scoreItem}>
                <Text style={scoreLabel}>Grade</Text>
                <Text style={scoreValue}>{letterGrade}</Text>
              </div>
            </div>
          </Section>

          <Section style={summaryBox}>
            <Text style={boxTitle}>Summary</Text>
            <Text style={summaryText}>{result.feedback.summary_note}</Text>
          </Section>

          <Section style={feedbackSection}>
            <div style={feedbackGrid}>
              <div style={feedbackItem}>
                <Text style={feedbackTitle} style={{ color: "#10b981" }}>
                  ✓ Strengths
                </Text>
                <ul style={list}>
                  {result.feedback.strengths.map((strength, idx) => (
                    <li key={idx} style={listItem}>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={feedbackItem}>
                <Text style={feedbackTitle} style={{ color: "#f59e0b" }}>
                  → Areas for Improvement
                </Text>
                <ul style={list}>
                  {result.feedback.areas_for_improvement.map((area, idx) => (
                    <li key={idx} style={listItem}>
                      {area}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>

          <Section style={detailsSection}>
            <Text style={boxTitle}>Detailed Feedback by Question</Text>
            {result.grading_breakdown.map((item, idx) => (
              <div key={idx} style={questionCard}>
                <div style={questionHeader}>
                  <Text style={questionTitle}>{item.category}</Text>
                  <Text style={questionScore}>
                    {item.score}/{item.max_score}
                  </Text>
                </div>
                <Text style={proficiencyBadge}>{item.proficiency_level}</Text>
                <Text style={justificationText}>{item.justification}</Text>
                {item.student_comment && (
                  <div style={feedbackBox}>
                    <Text style={feedbackBoxTitle}>Feedback for You</Text>
                    <Text style={feedbackBoxText}>{item.student_comment}</Text>
                  </div>
                )}
              </div>
            ))}
          </Section>

          <Section style={noteBox}>
            <Text style={noteTitle}>Next Steps</Text>
            <ul style={list}>
              <li style={listItem}>Review the feedback carefully</li>
              <li style={listItem}>
                Focus on the areas marked for improvement
              </li>
              <li style={listItem}>
                Reach out to your teacher if you have questions
              </li>
              <li style={listItem}>
                Use this feedback to strengthen your skills
              </li>
            </ul>
          </Section>

          <Hr style={hr} />
          <Text style={footer}>
            This is an automated grading report from CoTeacher. If you have
            questions about your grade, please contact your teacher.
          </Text>
          <Text style={footer}>
            © 2025 CoTeacher. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// ============================================
// STYLES
// ============================================

const main = {
  background: "#f8fafc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  padding: "48px 0",
};

const container = {
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  margin: "0 auto",
  padding: "52px 48px",
  borderRadius: "12px",
  maxWidth: "640px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)",
};

const badgeRow = {
  display: "flex",
  justifyContent: "center",
};

const badge = {
  display: "inline-block",
  padding: "6px 16px",
  borderRadius: "999px",
  background: "#dbeafe",
  color: "#0369a1",
  fontSize: "13px",
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  border: "1px solid #bae6fd",
  fontWeight: 600,
};

const h1 = {
  color: "#1e293b",
  fontSize: "30px",
  fontWeight: 700,
  margin: "28px 0 12px",
  textAlign: "center" as const,
  letterSpacing: "-0.01em",
};

const tagline = {
  color: "#64748b",
  fontSize: "16px",
  lineHeight: "28px",
  textAlign: "center" as const,
  margin: "0 0 28px",
};

const scoreBox = {
  background: "linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)",
  borderRadius: "12px",
  padding: "28px",
  margin: "28px 0",
  border: "1px solid #bae6fd",
};

const scoreGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "16px",
};

const scoreItem = {
  textAlign: "center" as const,
};

const scoreLabel = {
  color: "#475569",
  fontSize: "12px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.1em",
  marginBottom: "8px",
  fontWeight: 600,
};

const scoreValue = {
  color: "#0369a1",
  fontSize: "24px",
  fontWeight: 700,
  margin: 0,
};

const summaryBox = {
  background: "#f0f9ff",
  border: "1px solid #bae6fd",
  borderRadius: "12px",
  padding: "24px",
  margin: "24px 0",
};

const boxTitle = {
  color: "#1e293b",
  fontSize: "18px",
  fontWeight: 600,
  margin: "0 0 16px",
};

const summaryText = {
  color: "#475569",
  fontSize: "15px",
  lineHeight: "26px",
  margin: 0,
};

const feedbackSection = {
  margin: "28px 0",
};

const feedbackGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "20px",
};

const feedbackItem = {
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  padding: "20px",
};

const feedbackTitle = {
  color: "#1e293b",
  fontSize: "16px",
  fontWeight: 600,
  margin: "0 0 12px",
};

const list = {
  color: "#475569",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "0",
  paddingLeft: "20px",
};

const listItem = {
  marginBottom: "8px",
};

const detailsSection = {
  margin: "28px 0",
};

const questionCard = {
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  padding: "20px",
  marginBottom: "16px",
};

const questionHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "12px",
};

const questionTitle = {
  color: "#1e293b",
  fontSize: "16px",
  fontWeight: 600,
  margin: 0,
};

const questionScore = {
  color: "#0369a1",
  fontSize: "16px",
  fontWeight: 700,
  margin: 0,
};

const proficiencyBadge = {
  display: "inline-block",
  background: "#dbeafe",
  color: "#0369a1",
  padding: "4px 12px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: 600,
  marginBottom: "12px",
};

const justificationText = {
  color: "#475569",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "12px 0",
};

const feedbackBox = {
  background: "#f0fdf4",
  border: "1px solid #bbf7d0",
  borderRadius: "8px",
  padding: "12px",
  marginTop: "12px",
};

const feedbackBoxTitle = {
  color: "#15803d",
  fontSize: "12px",
  fontWeight: 600,
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  marginBottom: "6px",
};

const feedbackBoxText = {
  color: "#166534",
  fontSize: "13px",
  lineHeight: "22px",
  margin: 0,
};

const noteBox = {
  background: "#fef3c7",
  border: "1px solid #fcd34d",
  borderRadius: "12px",
  padding: "24px",
  margin: "28px 0",
};

const noteTitle = {
  color: "#92400e",
  fontSize: "18px",
  fontWeight: 600,
  margin: "0 0 16px",
};

const hr = {
  borderColor: "#e2e8f0",
  margin: "36px 0",
};

const footer = {
  color: "#94a3b8",
  fontSize: "13px",
  lineHeight: "22px",
  margin: "8px 0",
  textAlign: "center" as const,
};
