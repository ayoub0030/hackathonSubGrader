import { GradingResult } from "@/components/GradingResults";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_MODEL = "gpt-5-chat-latest";

interface GradeEssayInput {
  essayText?: string;
  imageBase64?: string;
  imageMimeType?: string;
  studentName?: string;
  gradeLevel?: string;
}

export async function gradeEssayWithGemini(
  input: GradeEssayInput
): Promise<GradingResult> {
  if (!OPENAI_API_KEY) {
    throw new Error(
      "VITE_OPENAI_API_KEY not set in environment variables"
    );
  }

  if (!input.essayText && !input.imageBase64) {
    throw new Error("Either essayText or imageBase64 must be provided");
  }

  const prompt = `You are an expert essay grader. Grade the following essay and return ONLY valid JSON (no markdown, no extra text).

The JSON must match this exact structure:
{
  "meta": {
    "student_name": "${input.studentName || "Anonymous"}",
    "grade_level": "${input.gradeLevel || "Not specified"}",
    "word_count": <number>
  },
  "grading_breakdown": [
    {
      "category": "string",
      "score": <number>,
      "max_score": <number>,
      "proficiency_level": "string",
      "justification": "string",
      "student_comment": "string"
    }
  ],
  "overall_assessment": {
    "total_score": <number>,
    "total_max_score": <number>,
    "letter_grade": "string"
  },
  "feedback": {
    "summary_note": "string",
    "strengths": ["string"],
    "areas_for_improvement": ["string"]
  },
  "flags": {
    "is_off_topic": boolean,
    "suspected_plagiarism": boolean,
    "ai_generated_suspicion": "Low|Medium|High"
  }
}

Grade the essay on these categories:
1. Ideas & Content (0-20 points)
2. Organization (0-20 points)
3. Voice & Style (0-20 points)
4. Word Choice (0-20 points)
5. Sentence Fluency (0-20 points)

Total: 100 points.

Return ONLY the JSON object, nothing else.`;

  const messageContent: Array<{
    type: string;
    text?: string;
    image_url?: { url: string; detail: string };
  }> = [];

  // Add text part
  if (input.essayText) {
    messageContent.push({
      type: "text",
      text: `Essay text:\n${input.essayText}`,
    });
  }

  // Add image part
  if (input.imageBase64 && input.imageMimeType) {
    messageContent.push({
      type: "image_url",
      image_url: {
        url: `data:${input.imageMimeType};base64,${input.imageBase64}`,
        detail: "high",
      },
    });
  }

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
    temperature: 0.4,
    max_tokens: 4096,
  };

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

  console.log("[GRADE] Request body:", JSON.stringify(requestBody, null, 2));

  if (!response.ok) {
    const errorData = await response.json();
    console.error("[GRADE] OpenAI API Error Response:", errorData);
    throw new Error(
      `OpenAI API error: ${errorData.error?.message || response.statusText}`
    );
  }

  const data = await response.json();
  const generatedText = data.choices?.[0]?.message?.content;

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
  return result;
}
