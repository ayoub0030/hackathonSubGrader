# Frontend-Only Gemini Integration Setup

This guide walks you through setting up AI-powered essay grading with Gemini called directly from the frontend (no server-side Edge Functions needed).

## Architecture Overview

```
Frontend (React)
    ↓
EssaySubmission.tsx (collect essay + image)
    ↓
Index.tsx (handleSubmit)
    ├─→ readFileAsBase64() → convert image to base64
    ├─→ gradeEssayWithGemini() → call Gemini API directly
    │   └─→ Gemini API (with VITE_GEMINI_API_KEY from .env)
    ↓
GradingResults.tsx (display dynamic results)
```

## Advantages of Frontend-Only Approach

✅ **Simpler setup** — no Edge Functions to deploy  
✅ **Faster** — direct API calls, no server hop  
✅ **Cheaper** — no server costs  
✅ **Easier debugging** — all logic in frontend  
⚠️ **API key exposed** — Gemini key visible in browser (use quota limits in Google Cloud)

---

## Prerequisites

1. **Supabase Project** (already set up at `rirnetcmkuldzwpvwftm.supabase.co`)
2. **Gemini API Key** from Google AI Studio (https://aistudio.google.com/app/apikeys)
3. **Node.js** installed locally

---

## Step 1: Get Your Gemini API Key

1. Go to https://aistudio.google.com/app/apikeys
2. Click **"Create API Key"**
3. Copy the key
4. Keep it safe — you'll add it to `.env`

---

## Step 2: Create Supabase Storage Bucket

1. Go to your Supabase dashboard: https://app.supabase.com/project/rirnetcmkuldzwpvwftm
2. Navigate to **Storage** (left sidebar)
3. Click **"Create a new bucket"**
4. Name it: `essay-images`
5. **Uncheck "Public bucket"** (images are uploaded by frontend with auth)
6. Click **Create**

---

## Step 3: Add Gemini API Key to `.env`

Open `.env` in your project root and update:

```env
VITE_SUPABASE_PROJECT_ID="rirnetcmkuldzwpvwftm"
VITE_SUPABASE_PUBLISHABLE_KEY="..."
VITE_SUPABASE_URL="https://rirnetcmkuldzwpvwftm.supabase.co"
VITE_GEMINI_API_KEY="your-actual-gemini-api-key-here"
```

Replace `your-actual-gemini-api-key-here` with your real key from Step 1.

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
5. Wait for Gemini to grade it (5-10 seconds)
6. See the dynamic results

### 4.3 Troubleshooting

**Issue: "VITE_GEMINI_API_KEY not set"**
- Make sure you added it to `.env`
- Restart the dev server: `npm run dev`

**Issue: "Invalid API key" from Gemini**
- Double-check the key is correct
- Make sure there are no extra spaces in `.env`

**Issue: "Storage bucket not found"**
- Verify the `essay-images` bucket exists in Supabase Storage
- Check that it's not public

**Issue: CORS error**
- This shouldn't happen with Gemini API (it's a direct call)
- Check browser console for details

---

## Step 5: How It Works

### Text-only essay:
1. User enters essay text
2. Frontend calls `gradeEssayWithGemini()` with text
3. Function sends to Gemini API with prompt
4. Gemini returns JSON matching `GradingResult` schema
5. Results displayed in `GradingResults.tsx`

### Image-based essay:
1. User uploads image file
2. Frontend converts to base64 using `readFileAsBase64()`
3. Calls `gradeEssayWithGemini()` with base64 + mime type
4. Function sends image + prompt to Gemini
5. Gemini extracts text from image and grades it
6. Results displayed

---

## Step 6: Customizing the Grading Rubric

The grading prompt is in `src/lib/gemini.ts`. Currently grades on:
- Ideas & Content (0-20)
- Organization (0-20)
- Voice & Style (0-20)
- Word Choice (0-20)
- Sentence Fluency (0-20)

To change, edit the `prompt` variable in `gradeEssayWithGemini()`:

```typescript
Grade the essay on these categories:
1. Your Category 1 (0-XX points)
2. Your Category 2 (0-XX points)
...
```

Save and the changes apply immediately (no redeploy needed).

---

## Step 7: Security Considerations

### ⚠️ API Key Exposure

Your Gemini API key will be visible in the browser. To mitigate:

1. **Set quota limits** in Google Cloud Console:
   - Go to https://console.cloud.google.com
   - Find your project
   - Set daily/monthly quota limits
   - This prevents runaway costs

2. **Use API restrictions** (optional):
   - Restrict to Generative Language API only
   - Restrict to specific HTTP referrers (your domain)

3. **Monitor usage**:
   - Check Google Cloud Console regularly
   - Set up billing alerts

### For Production

If you want to hide the API key:
- Redeploy the Edge Functions from the previous setup
- Or use a backend proxy (Node.js server)

---

## Step 8: File Structure

```
src/
├── lib/
│   ├── gemini.ts           # Direct Gemini API calls
│   └── storage.ts          # Supabase Storage upload
├── pages/
│   └── Index.tsx           # Main flow: grade → display
├── components/
│   ├── EssaySubmission.tsx  # Form (text + image input)
│   └── GradingResults.tsx   # Display dynamic results
└── ...

.env                        # Contains VITE_GEMINI_API_KEY
```

---

## Step 9: Production Deployment

1. **Build the frontend:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify/Vercel:**
   - Connect your GitHub repo
   - Set environment variables in deployment settings:
     ```
     VITE_GEMINI_API_KEY=your-key
     VITE_SUPABASE_PROJECT_ID=...
     VITE_SUPABASE_PUBLISHABLE_KEY=...
     VITE_SUPABASE_URL=...
     ```
   - Deploy

3. **Verify:**
   - Test grading on production URL
   - Check browser console for errors

---

## Step 10: Rate Limiting (Recommended for Production)

Since there's no auth, anyone can call Gemini. To prevent abuse:

1. **Frontend rate limiting:**
   - Add a cooldown timer between submissions
   - Limit to 1 submission per 30 seconds

2. **Google Cloud quota:**
   - Set daily/monthly limits
   - Prevents runaway costs

3. **Optional: Add CAPTCHA**
   - Use reCAPTCHA v3 on submit button
   - Verify on backend (if you add one later)

---

## Next Steps

1. ✅ Get Gemini API key
2. ✅ Create Supabase Storage bucket
3. ✅ Add key to `.env`
4. ✅ Test the integration
5. 🔄 (Optional) Customize grading rubric
6. 🔄 (Optional) Add rate limiting
7. 🔄 (Optional) Deploy to production

---

## Comparison: Frontend vs Edge Functions

| Feature | Frontend-Only | Edge Functions |
|---------|--------------|-----------------|
| Setup complexity | ⭐ Simple | ⭐⭐⭐ Complex |
| API key exposure | ⚠️ Visible | ✅ Hidden |
| Speed | ✅ Fast | ⚠️ Slower (extra hop) |
| Cost | ✅ Cheap | ⚠️ Server costs |
| Scalability | ⚠️ Limited | ✅ Better |
| Best for | Demo/MVP | Production |

---

## Support

If you hit issues:

1. Check browser console (F12) for error messages
2. Verify `.env` has correct Gemini key
3. Check Supabase Storage bucket exists
4. Test Gemini API key at https://aistudio.google.com/app/apikeys

