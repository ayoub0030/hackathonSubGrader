# CoTeacher - AI-Powered Essay Grading Platform

## Overview

CoTeacher is an AI-powered essay grading application designed for K-12 educators. It automates the essay evaluation process while providing detailed, constructive feedback to help students improve their writing skills.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Lovable Cloud (Supabase)
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Storage**: Supabase Storage for essay images
- **Authentication**: Supabase Auth (email/password)

## Features

### Current Features
- 📝 Essay submission (text or image upload)
- 🎓 Grade level selection (K-12)
- 📋 Multiple rubric templates (Narrative, Argumentative, Informative, Research)
- 📊 Detailed grading breakdown with scores per category
- ✅ Strengths and areas for improvement feedback
- 🔒 Secure user authentication and data isolation

### Grading Philosophy
- **Growth Mindset**: Constructive, actionable feedback using encouraging language
- **Fairness**: Blind grading, content neutrality, strict rubric adherence
- **Safety**: Detects off-topic essays, flags plagiarism suspicion, assesses AI-generated content risk

## Database Architecture

### Tables

#### `profiles`
Stores user profile information.
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | References auth.users |
| full_name | text | User's display name |
| avatar_url | text | Profile picture URL |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Last update timestamp |

#### `essay_submissions`
Stores submitted essays and metadata.
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | References auth.users |
| student_name | text | Name of the student |
| grade_level | text | K-12 grade level |
| rubric_type | text | Selected rubric template |
| essay_content | text | Essay text content |
| image_url | text | URL to uploaded essay image |
| word_count | integer | Word count of essay |
| status | text | Submission status (pending/graded) |
| created_at | timestamp | Submission timestamp |
| updated_at | timestamp | Last update timestamp |

#### `grading_results`
Stores AI-generated grading results.
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| submission_id | uuid | References essay_submissions |
| user_id | uuid | References auth.users |
| total_score | integer | Total points earned |
| total_max_score | integer | Maximum possible points |
| letter_grade | text | Letter grade (A-F) |
| grading_breakdown | jsonb | Detailed scores per category |
| strengths | jsonb | Array of identified strengths |
| areas_for_improvement | jsonb | Array of improvement suggestions |
| summary_note | text | Overall feedback summary |
| suspected_plagiarism | boolean | Plagiarism flag |
| ai_generated_suspicion | text | AI-generated content risk level |
| is_off_topic | boolean | Off-topic flag |
| created_at | timestamp | Grading timestamp |

### Storage Buckets

#### `essay-images`
Public bucket for storing uploaded essay images.
- Users can only access their own images
- Organized by user ID folders

## Security

All tables are protected with Row Level Security (RLS) policies:
- Users can only view, create, update, and delete their own data
- Authentication required for all database operations
- Storage access restricted to authenticated users' own folders

## Local Development Setup

### Prerequisites
- Node.js 18+
- npm or bun

### Environment Variables
Create a `.env` file in the project root:

```env
VITE_SUPABASE_PROJECT_ID=rirnetcmkuldzwpvwftm
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpcm5ldGNta3VsZHp3cHZ3ZnRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1Mjc5NDksImV4cCI6MjA4MTEwMzk0OX0.lqq1XcRZChI1TITtoLXKAJkxj4BblJ5hAMG65zyaKfQ
VITE_SUPABASE_URL=https://rirnetcmkuldzwpvwftm.supabase.co
```

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── Header.tsx       # Navigation header
│   ├── Footer.tsx       # Page footer
│   ├── HeroSection.tsx  # Landing hero section
│   ├── EssaySubmission.tsx  # Essay submission form
│   ├── GradingResults.tsx   # Results display
│   ├── FeaturesSection.tsx  # Features showcase
│   └── DemoSection.tsx      # Demo preview
├── hooks/               # Custom React hooks
├── integrations/
│   └── supabase/        # Supabase client & types
├── pages/
│   ├── Index.tsx        # Main landing page
│   └── NotFound.tsx     # 404 page
├── lib/
│   └── utils.ts         # Utility functions
├── App.tsx              # Root component
├── main.tsx             # Entry point
└── index.css            # Global styles & design tokens
```

## Grading Output Schema

The AI grading engine outputs structured JSON:

```json
{
  "grading_breakdown": [
    {
      "category": "Ideas & Content",
      "score": 18,
      "maxScore": 20,
      "feedback": "Clear thesis with supporting evidence..."
    }
  ],
  "overall_assessment": {
    "totalScore": 85,
    "maxScore": 100,
    "letterGrade": "B+"
  },
  "feedback": {
    "strengths": ["Strong introduction", "Good vocabulary usage"],
    "areasForImprovement": ["Add more transitional phrases"],
    "summaryNote": "Well-written essay with room for growth..."
  },
  "flags": {
    "suspectedPlagiarism": false,
    "aiGeneratedSuspicion": "Low",
    "isOffTopic": false
  }
}
```

## Future Enhancements

- [ ] User authentication (signup/login)
- [ ] AI-powered grading integration
- [ ] Submission history page
- [ ] Batch grading for multiple essays
- [ ] Custom rubric creation
- [ ] PDF report export
- [ ] Teacher dashboard with analytics

## License

Proprietary - All rights reserved
