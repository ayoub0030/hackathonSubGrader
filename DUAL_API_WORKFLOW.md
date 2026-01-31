# Two-Step Grading Workflow with Dual API Keys & Rubrics

## Overview
This document describes the enhanced two-step grading workflow that uses two separate Gemini API keys and includes per-question rubric input.

## Architecture

### Step 1: Extract Questions (API Key 0)
**File:** `src/lib/extract-questions.ts`

- **Input:** Exam image (base64)
- **API Key:** `VITE_GEMINI_API_KEY_0`
- **Process:**
  1. User uploads exam photo
  2. Gemini extracts questions only from the image
  3. Returns array of questions with id, text, and estimated maxScore
  4. Image is stored in state for later use

**Console Logs:**
```
[EXTRACT] Prompt: <extraction prompt>
[EXTRACT] Raw Response: <gemini response>
[EXTRACT] Parsed Questions: <parsed array>
```

### Step 2: Grade with Scores & Rubrics (API Key 1)
**File:** `src/lib/grade-with-scores.ts`

- **Input:** 
  - Questions (with user-entered scores and rubrics)
  - Exam image (base64) - **CRITICAL: Image is sent to Gemini**
  - Student name
  - Grade level
- **API Key:** `VITE_GEMINI_API_KEY_1`
- **Process:**
  1. User verifies/edits questions
  2. User enters max score for each question
  3. User enters rubric (evaluation criteria) for each question
  4. User clicks "Corriger"
  5. **Image + Questions + Rubrics** sent to Gemini
  6. Gemini grades based on:
     - Student answers visible in the image
     - The rubric provided for each question
     - The max score for each question
  7. Returns detailed grading results

**Console Logs:**
```
[GRADE] Prompt: <grading prompt with rubrics>
[GRADE] Raw Response: <gemini response>
[GRADE] Parsed Result: <parsed grading result>
```

## Key Components

### 1. Extract Questions Utility
**File:** `src/lib/extract-questions.ts`

```typescript
export interface ExtractedQuestion {
  id: string;
  text: string;
  rubric?: string;        // NEW: User-entered rubric
  score?: number;
  maxScore?: number;
}

export async function extractQuestionsFromExam(
  imageBase64: string,
  imageMimeType: string
): Promise<ExtractedQuestion[]>
```

### 2. Grade with Scores Utility
**File:** `src/lib/grade-with-scores.ts`

```typescript
interface GradeWithScoresInput {
  questions: ExtractedQuestion[];
  studentName?: string;
  gradeLevel?: string;
  imageBase64?: string;        // NEW: Exam image for grading
  imageMimeType?: string;      // NEW: Image MIME type
}

export async function gradeWithQuestionScores(
  input: GradeWithScoresInput
): Promise<GradingResult>
```

**Key Feature:** The image is included in the Gemini API request as `inlineData`, allowing Gemini to see the student's answers.

### 3. Question Extractor Component
**File:** `src/components/QuestionExtractor.tsx`

**New Features:**
- Edit question text (pencil icon)
- Enter max score for each question (numeric input)
- **Enter rubric for each question** (textarea with placeholder)
  - Example: "Évaluer sur la clarté, la précision, la complétude de la réponse"
  - Example: "Points for correct formula, correct calculation, correct units"

**Props:**
```typescript
interface QuestionExtractorProps {
  questions: ExtractedQuestion[];
  isLoading: boolean;
  imageBase64?: string;        // NEW: Passed from Index
  imageMimeType?: string;      // NEW: Passed from Index
  onSubmitScores: (
    questionsWithScores: ExtractedQuestion[],
    imageBase64?: string,      // NEW: Passed to grading
    imageMimeType?: string     // NEW: Passed to grading
  ) => void;
  onBack: () => void;
}
```

### 4. Index Page
**File:** `src/pages/Index.tsx`

**State Management:**
```typescript
const [currentImageBase64, setCurrentImageBase64] = useState<string | undefined>();
const [currentImageMimeType, setCurrentImageMimeType] = useState<string | undefined>();
```

**Workflow:**
1. `handleSubmit()` - Step 1
   - Stores image in state
   - Calls `extractQuestionsFromExam()`
   - Shows `QuestionExtractor` component

2. `handleSubmitScores()` - Step 2
   - Receives questions + scores + rubrics from `QuestionExtractor`
   - Receives image from component callback
   - Calls `gradeWithQuestionScores()` with image
   - Shows `GradingResults`

## Environment Variables

**File:** `.env`

```
VITE_GEMINI_API_KEY_0="<your-api-key-for-extraction>"
VITE_GEMINI_API_KEY_1="<your-api-key-for-grading>"
```

Both can be the same key or different keys.

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ User uploads exam photo                                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 1: Extract Questions (API Key 0)                       │
│ - Image → Gemini → Extract questions only                   │
│ - Image stored in state for later use                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ QuestionExtractor UI                                        │
│ - Show extracted questions                                  │
│ - User edits questions (optional)                           │
│ - User enters max score for each question                   │
│ - User enters rubric for each question                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 2: Grade with Scores (API Key 1)                       │
│ - Image + Questions + Scores + Rubrics → Gemini             │
│ - Gemini grades based on student answers in image           │
│ - Returns detailed grading results                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ GradingResults UI                                           │
│ - Display detailed feedback per question                    │
│ - Show overall score and letter grade                       │
└─────────────────────────────────────────────────────────────┘
```

## Console Logging

All prompts and responses are logged to the browser console with prefixes:

- `[EXTRACT]` - Question extraction logs
- `[GRADE]` - Grading logs

**To view:**
1. Open DevTools: F12
2. Go to Console tab
3. Look for `[EXTRACT]` and `[GRADE]` prefixed messages

## Testing Checklist

- [ ] Upload exam photo
- [ ] Verify questions are extracted correctly
- [ ] Check `[EXTRACT]` logs in console
- [ ] Edit questions (optional)
- [ ] Enter max scores for each question
- [ ] Enter rubrics for each question
- [ ] Click "Corriger"
- [ ] Check `[GRADE]` logs show:
  - Prompt includes questions + rubrics
  - Image is included in request
- [ ] Verify grading results show:
  - Scores based on student answers in image
  - Feedback based on rubrics provided
  - No "Missing Answer" messages

## Important Notes

1. **Image is Critical:** The exam image must be passed to Step 2 for Gemini to see student answers
2. **Rubrics are Optional:** If no rubric is entered, Gemini will grade based on typical exam standards
3. **Two API Keys:** Can be the same key or different keys for load balancing
4. **Console Logging:** All prompts and responses are logged for debugging and transparency
