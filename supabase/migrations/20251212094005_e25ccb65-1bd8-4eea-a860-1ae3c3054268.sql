-- Create grading_results table
CREATE TABLE public.grading_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID NOT NULL REFERENCES public.essay_submissions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Overall assessment
  total_score INTEGER NOT NULL,
  total_max_score INTEGER NOT NULL,
  letter_grade TEXT,
  
  -- Grading breakdown (stored as JSONB for flexibility)
  grading_breakdown JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Feedback
  summary_note TEXT,
  strengths JSONB DEFAULT '[]'::jsonb,
  areas_for_improvement JSONB DEFAULT '[]'::jsonb,
  
  -- Flags
  is_off_topic BOOLEAN DEFAULT false,
  suspected_plagiarism BOOLEAN DEFAULT false,
  ai_generated_suspicion TEXT DEFAULT 'Low' CHECK (ai_generated_suspicion IN ('Low', 'Medium', 'High')),
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on grading_results
ALTER TABLE public.grading_results ENABLE ROW LEVEL SECURITY;

-- RLS policies for grading_results
CREATE POLICY "Users can view their own grading results" 
ON public.grading_results 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own grading results" 
ON public.grading_results 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Add indexes for faster queries
CREATE INDEX idx_grading_results_user_id ON public.grading_results(user_id);
CREATE INDEX idx_grading_results_submission_id ON public.grading_results(submission_id);