const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_MODEL = "gpt-5-chat-latest";

export interface ExtractedQuestion {
  id: string;
  text: string;
  rubric?: string;
  score?: number;
  maxScore?: number;
}

export async function extractQuestionsFromExam(
  imageBase64: string,
  imageMimeType: string
): Promise<ExtractedQuestion[]> {
  if (!OPENAI_API_KEY) {
    throw new Error("VITE_OPENAI_API_KEY not set in environment variables");
  }

  const prompt = `You are an expert at reading exam papers and extracting questions from images.

IMPORTANT: You MUST analyze the image provided and extract ALL questions visible in it.

Look carefully at the exam image and identify every question.

Return ONLY a valid JSON array (no markdown, no extra text, no code blocks) with this exact structure:
[
  {
    "id": "q1",
    "text": "Full question text here",
    "maxScore": 10
  },
  {
    "id": "q2",
    "text": "Next question text here",
    "maxScore": 15
  }
]

CRITICAL RULES:
1. Extract the EXACT question text as written in the exam image
2. Estimate maxScore if visible (e.g., "Question 1 (10 points)" means maxScore: 10)
3. If maxScore is not visible, use a reasonable default like 10
4. Use id format: "q1", "q2", "q3", etc. (sequential)
5. Return ONLY the JSON array - no markdown, no code blocks, no explanation
6. If no questions found, return empty array: []
7. Do not include any text before or after the JSON array`;

  const requestBody = {
    model: OPENAI_MODEL,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: `data:${imageMimeType};base64,${imageBase64}`,
              detail: "high",
            },
          },
          {
            type: "text",
            text: prompt,
          },
        ],
      },
    ],
    temperature: 0.3,
    max_tokens: 2048,
  };

  console.log("[EXTRACT] Prompt:", prompt);
  console.log("[EXTRACT] Image MIME type:", imageMimeType);
  console.log("[EXTRACT] Image base64 length:", imageBase64.length);

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
    console.error("[EXTRACT] OpenAI API Error Response:", errorData);
    console.error("[EXTRACT] Request body was:", JSON.stringify(requestBody, null, 2));
    throw new Error(
      `OpenAI API error: ${errorData.error?.message || response.statusText}`
    );
  }

  const data = await response.json();
  console.log("[EXTRACT] Full API Response:", JSON.stringify(data, null, 2));
  
  const generatedText = data.choices?.[0]?.message?.content;

  console.log("[EXTRACT] Raw Response:", generatedText);

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

  const questions: ExtractedQuestion[] = JSON.parse(jsonStr);
  console.log("[EXTRACT] Parsed Questions:", questions);
  return questions;
}
