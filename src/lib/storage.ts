import { supabase } from "@/integrations/supabase/client";

export async function uploadImageToSupabaseStorage(
  file: File
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("File must be an image");
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error("File size must be less than 10MB");
  }

  // Generate unique filename
  const timestamp = Date.now();
  const ext = file.type.split("/")[1] || "jpg";
  const filename = `essay-${timestamp}.${ext}`;

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from("essay-images")
    .upload(filename, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from("essay-images")
    .getPublicUrl(filename);

  return publicUrlData.publicUrl;
}

export async function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export interface ExamFile {
  studentName: string;
  file: File;
}

export async function readExamFilesAsBase64(
  examFiles: ExamFile[]
): Promise<Array<{ studentName: string; imageBase64: string; imageMimeType: string }>> {
  const results = await Promise.all(
    examFiles.map(async (exam) => ({
      studentName: exam.studentName,
      imageBase64: await readFileAsBase64(exam.file),
      imageMimeType: exam.file.type,
    }))
  );
  return results;
}
