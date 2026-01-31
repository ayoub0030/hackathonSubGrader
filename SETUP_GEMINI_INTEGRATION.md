# Gemini Integration Setup Guide

This guide walks you through setting up the AI-powered essay grading system with Gemini, Supabase Storage, and Edge Functions.

## Architecture Overview

```
Frontend (React)
    ↓
    ├─→ EssaySubmission.tsx (collect essay + image)
    ↓
Index.tsx (handleSubmit)
    ├─→ uploadImageToStorage() → Edge Function: upload-essay-image
    │   └─→ Supabase Storage (essay-images bucket)
    ├─→ gradeEssay() → Edge Function: grade-essay
    │   └─→ Gemini API (with GEMINI_API_KEY secret)
    ↓
GradingResults.tsx (display dynamic results)
```

## Prerequisites

1. **Supabase Project** (already set up at `rirnetcmkuldzwpvwftm.supabase.co`)
2. **Gemini API Key** from Google AI Studio (https://aistudio.google.com/app/apikeys)
3. **Supabase CLI** installed locally (for deploying Edge Functions)

---

## Step 1: Get Your Gemini API Key

1. Go to https://aistudio.google.com/app/apikeys
2. Click **"Create API Key"**
3. Copy the key (you'll need it in Step 3)
4. **Keep it secret** — never commit it to git

---

## Step 2: Create Supabase Storage Bucket

1. Go to your Supabase dashboard: https://app.supabase.com/project/rirnetcmkuldzwpvwftm
2. Navigate to **Storage** (left sidebar)
3. Click **"Create a new bucket"**
4. Name it: `essay-images`
5. **Uncheck "Public bucket"** (we'll upload through the Edge Function)
6. Click **Create**

---

## Step 3: Deploy Edge Functions

### 3.1 Install Supabase CLI

```bash
npm install -g supabase
```

### 3.2 Login to Supabase

```bash
supabase login
```

You'll be prompted to create an access token. Go to https://app.supabase.com/account/tokens and create one, then paste it.

### 3.3 Set Environment Secrets

In your Supabase project, set the `GEMINI_API_KEY` secret:

```bash
supabase secrets set GEMINI_API_KEY="your-gemini-api-key-here"
```

Verify it was set:

```bash
supabase secrets list
```

### 3.4 Deploy the Functions

From the project root:

```bash
supabase functions deploy upload-essay-image
supabase functions deploy grade-essay
```

You should see output like:
```
✓ Function uploaded successfully
  Endpoint: https://rirnetcmkuldzwpvwftm.supabase.co/functions/v1/upload-essay-image
```

---

## Step 4: Test the Integration

### 4.1 Start the dev server

```bash
npm run dev
```

### 4.2 Test the flow

1. Open http://localhost:5173
2. Enter a student name (optional)
3. Paste or upload an essay
4. Click **"Corriger cette dissertation"**
5. Wait for Gemini to grade it (should take 5-10 seconds)
6. See the dynamic results from Gemini

### 4.3 Troubleshooting

**Issue: "Missing GEMINI_API_KEY"**
- Make sure you ran `supabase secrets set GEMINI_API_KEY=...`
- Redeploy the functions: `supabase functions deploy grade-essay`

**Issue: "Upload failed" or "Storage error"**
- Verify the `essay-images` bucket exists and is **not public**
- Check that `SUPABASE_SERVICE_ROLE_KEY` is available (it's built-in to Edge Functions)

**Issue: Gemini returns invalid JSON**
- The prompt in `grade-essay/index.ts` tries to force JSON output
- If Gemini wraps it in markdown (```json...```), the function strips it
- Check the browser console for the actual error

---

## Step 5: Environment Variables (Frontend)

Your `.env` file already has:

```env
VITE_SUPABASE_PROJECT_ID="rirnetcmkuldzwpvwftm"
VITE_SUPABASE_PUBLISHABLE_KEY="..."
VITE_SUPABASE_URL="https://rirnetcmkuldzwpvwftm.supabase.co"
```

These are used in `Index.tsx` to call the Edge Functions. No changes needed.

---

## Step 6: How the Grading Works

### Text-only essay:
1. Frontend sends `essayText` to `grade-essay` function
2. Function builds a prompt with the essay
3. Calls Gemini with `gemini-1.5-flash` model
4. Gemini returns JSON matching `GradingResult` schema
5. Frontend displays results

### Image-based essay:
1. Frontend converts image to base64
2. Calls `upload-essay-image` function
3. Function uploads to Supabase Storage, returns public URL
4. Frontend calls `grade-essay` with `imageUrl`
5. Function downloads image, sends to Gemini vision
6. Gemini extracts text and grades it
7. Results displayed

---

## Step 7: Customizing the Grading Rubric

Currently, the `grade-essay` function grades on these 5 categories (100 points total):
- Ideas & Content (0-20)
- Organization (0-20)
- Voice & Style (0-20)
- Word Choice (0-20)
- Sentence Fluency (0-20)

To change this, edit `supabase/functions/grade-essay/index.ts`:

```typescript
Grade the essay on these categories:
1. Your Category 1 (0-XX points)
2. Your Category 2 (0-XX points)
...
```

Then redeploy:
```bash
supabase functions deploy grade-essay
```

---

## Step 8: Production Deployment

When you're ready to deploy to production:

1. **Build the frontend:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify/Vercel** (or your hosting)

3. **Edge Functions are already live** on Supabase (no additional deployment needed)

4. **Make sure your `.env` is NOT committed** — use `.env.example` instead:
   ```env
   VITE_SUPABASE_PROJECT_ID=rirnetcmkuldzwpvwftm
   VITE_SUPABASE_PUBLISHABLE_KEY=your_key_here
   VITE_SUPABASE_URL=https://rirnetcmkuldzwpvwftm.supabase.co
   ```

---

## Step 9: Rate Limiting (Optional, for Production)

Since there's no auth, anyone can call your Edge Functions. To prevent abuse:

1. Add a simple rate limiter in the Edge Function (using Deno KV or Upstash)
2. Or use Supabase's built-in rate limiting (if available)
3. Or add a CAPTCHA on the frontend

For now (demo), this is optional.

---

## File Structure

```
supabase/
├── functions/
│   ├── upload-essay-image/
│   │   └── index.ts          # Uploads image to Storage
│   └── grade-essay/
│       └── index.ts          # Calls Gemini, returns GradingResult
└── migrations/               # (existing DB migrations)

src/
├── pages/
│   └── Index.tsx             # Main flow: upload → grade → display
├── components/
│   ├── EssaySubmission.tsx    # Form (text + image input)
│   └── GradingResults.tsx     # Display dynamic results
└── ...
```

---

## Next Steps

1. ✅ Set up Gemini API key
2. ✅ Create Supabase Storage bucket
3. ✅ Deploy Edge Functions
4. ✅ Test the integration
5. 🔄 (Optional) Add custom rubrics
6. 🔄 (Optional) Add rate limiting
7. 🔄 (Optional) Deploy to production

---

## Support

If you hit issues:

1. Check the browser console (F12) for error messages
2. Check Supabase Edge Function logs: https://app.supabase.com/project/rirnetcmkuldzwpvwftm/functions
3. Verify Gemini API key is set: `supabase secrets list`
4. Test the functions manually using `curl` or Postman

---

## Demo Notes

This is a **demo implementation**. For production:
- Add authentication (currently no auth required)
- Add rate limiting / CAPTCHA
- Add error handling / retry logic
- Store grading history in a database table
- Add analytics / monitoring
