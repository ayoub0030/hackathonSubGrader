import { GradingResult } from "@/components/GradingResults";
import { ExtractedQuestion } from "@/lib/extract-questions";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_MODEL = "gpt-5-chat-latest";

interface GradeWithScoresInput {
  questions: ExtractedQuestion[];
  studentName?: string;
  gradeLevel?: string;
  imageBase64?: string;
  imageMimeType?: string;
}

export async function gradeWithQuestionScores(
  input: GradeWithScoresInput
): Promise<GradingResult> {
  if (!OPENAI_API_KEY) {
    throw new Error("VITE_OPENAI_API_KEY not set in environment variables");
  }

  const { questions, studentName, gradeLevel, imageBase64, imageMimeType } = input;

  // Build question list for prompt (with rubrics)
  const questionsList = questions
    .map(
      (q) =>
        `${q.id.toUpperCase()}: ${q.text}\n(Max Score: ${q.maxScore || 10} points)${
          q.rubric ? `\nRubric: ${q.rubric}` : ""
        }`
    )
    .join("\n\n");

  const totalMaxScore = questions.reduce((sum, q) => sum + (q.maxScore || 10), 0);

  const prompt = `You are an expert essay and exam grader. Grade the following exam questions based on the student's answers visible in the exam image and return ONLY valid JSON (no markdown, no extra text).

Student: ${studentName || "Anonymous"}
Grade Level: ${gradeLevel || "Not specified"}
Total Max Score: ${totalMaxScore} points

EXAM QUESTIONS WITH RUBRICS:
${questionsList}

Your task:
1. Look at the exam image provided to see the student's answers for each question
2. For each question:
   - Include the question text in the "question_text" field
   - Extract the student's answer text from the image
   - Assign a score (0 to maxScore) based on the student's answer and the provided rubric
   - Provide detailed feedback based on what you see in the image
3. Include both the question and the student's answer in the response
4. Calculate overall assessment
5. Identify strengths and areas for improvement

Return ONLY this JSON structure (no markdown):
{
  "meta": {
    "student_name": "${studentName || "Anonymous"}",
    "grade_level": "${gradeLevel || "Not specified"}",
    "word_count": 0
  },
  "grading_breakdown": [
    {
      "category": "Q1",
      "score": <number>,
      "max_score": <number>,
      "proficiency_level": "string",
      "justification": "string",
      "student_comment": "string",
      "question_text": "string (the question text)",
      "student_answer": "string (the student's answer to this question from the image)"
    }
  ],
  "overall_assessment": {
    "total_score": <number>,
    "total_max_score": ${totalMaxScore},
    "letter_grade": "string"
  },
  "feedback": {
    "summary_note": "string",
    "strengths": ["string"],
    "areas_for_improvement": ["string"]
  },
  "flags": {
    "is_off_topic": false,
    "suspected_plagiarism": false,
    "ai_generated_suspicion": "Low"
  }
}

Rules:
- Score each question based on typical exam rubrics
- Provide constructive feedback
- Calculate letter grade based on percentage: A (90+), B (80-89), C (70-79), D (60-69), F (<60)
- Return ONLY the JSON, nothing else`;

  const messageContent: Array<{
    type: string;
    text?: string;
    image_url?: { url: string; detail: string };
  }> = [];

  // Add image part first (if provided)
  if (imageBase64 && imageMimeType) {
    messageContent.push({
      type: "image_url",
      image_url: {
        url: `data:${imageMimeType};base64,${imageBase64}`,
        detail: "high",
      },
    });
  }

  // Add text prompt
  messageContent.push({
    type: "text",
    text: prompt,
  });

  const requestBody = {
    model: OPENAI_MODEL,
    messages: [
      {
        role: "user",
        content: messageContent,
      },
    ],
    temperature: 0.3,
    max_tokens: 4096,
  };

  console.log("[GRADE] Prompt:", prompt);

  const response = await fetch(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    console.error("[GRADE] OpenAI API Error Response:", errorData);
    throw new Error(
      `OpenAI API error: ${errorData.error?.message || response.statusText}`
    );
  }

  const data = await response.json();
  const generatedText = data.choices?.[0]?.message?.content;

  console.log("[GRADE] Raw Response:", generatedText);

  if (!generatedText) {
    throw new Error("No response from OpenAI API");
  }

  // Parse JSON (handle markdown wrapping)
  let jsonStr = generatedText.trim();
  if (jsonStr.startsWith("```json")) {
    jsonStr = jsonStr.replace(/^```json\n/, "").replace(/\n```$/, "");
  } else if (jsonStr.startsWith("```")) {
    jsonStr = jsonStr.replace(/^```\n/, "").replace(/\n```$/, "");
  }

  const result: GradingResult = JSON.parse(jsonStr);
  console.log("[GRADE] Parsed Result:", result);
  return result;
}

export interface ExamToGrade {
  id: string;
  studentName: string;
  imageBase64: string;
  imageMimeType: string;
}

export interface BatchGradingResult {
  examId: string;
  studentName: string;
  result: GradingResult | null;
  status: "success" | "error";
  error?: string;
}

export async function gradeBatchExams(
  exams: ExamToGrade[],
  questions: ExtractedQuestion[],
  gradeLevel?: string,
  onProgress?: (completed: number, total: number) => void
): Promise<BatchGradingResult[]> {
  const results: BatchGradingResult[] = [];
  let completed = 0;

  // Grade exams in parallel (up to 5 at a time to avoid rate limiting)
  const batchSize = 5;
  for (let i = 0; i < exams.length; i += batchSize) {
    const batch = exams.slice(i, i + batchSize);

    const batchPromises = batch.map(async (exam) => {
      try {
        console.log(`[BATCH] Grading exam for ${exam.studentName}...`);

        const result = await gradeWithQuestionScores({
          questions,
          studentName: exam.studentName,
          gradeLevel,
          imageBase64: exam.imageBase64,
          imageMimeType: exam.imageMimeType,
        });

        completed++;
        onProgress?.(completed, exams.length);

        console.log(`[BATCH] Completed: ${exam.studentName}`);

        return {
          examId: exam.id,
          studentName: exam.studentName,
          result,
          status: "success" as const,
        };
      } catch (error) {
        completed++;
        onProgress?.(completed, exams.length);

        console.error(`[BATCH] Error grading ${exam.studentName}:`, error);

        return {
          examId: exam.id,
          studentName: exam.studentName,
          result: null,
          status: "error" as const,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    });

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }

  return results;
}
