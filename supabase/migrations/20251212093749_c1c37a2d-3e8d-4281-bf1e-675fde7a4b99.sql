-- Create essay_submissions table
CREATE TABLE public.essay_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_name TEXT,
  grade_level TEXT NOT NULL,
  rubric_type TEXT NOT NULL,
  essay_content TEXT,
  image_url TEXT,
  word_count INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'grading', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on essay_submissions
ALTER TABLE public.essay_submissions ENABLE ROW LEVEL SECURITY;

-- RLS policies for essay_submissions
CREATE POLICY "Users can view their own submissions" 
ON public.essay_submissions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own submissions" 
ON public.essay_submissions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own submissions" 
ON public.essay_submissions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own submissions" 
ON public.essay_submissions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add index for faster queries
CREATE INDEX idx_essay_submissions_user_id ON public.essay_submissions(user_id);
CREATE INDEX idx_essay_submissions_status ON public.essay_submissions(status);

-- Trigger for updated_at
CREATE TRIGGER update_essay_submissions_updated_at
  BEFORE UPDATE ON public.essay_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();