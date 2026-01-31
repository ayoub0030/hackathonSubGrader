-- Create storage bucket for essay images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('essay-images', 'essay-images', true);

-- Storage policies for essay-images bucket
CREATE POLICY "Users can view their own essay images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'essay-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own essay images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'essay-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own essay images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'essay-images' AND auth.uid()::text = (storage.foldername(name))[1]);