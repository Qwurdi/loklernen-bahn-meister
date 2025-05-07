
import { supabase } from "@/integrations/supabase/client";

/**
 * Uploads a question image to storage
 */
export async function uploadQuestionImage(file: File, userId: string): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Math.random()}.${fileExt}`;
  
  const { error } = await supabase
    .storage
    .from('question-images')
    .upload(fileName, file);
    
  if (error) throw error;
  
  const { data } = supabase
    .storage
    .from('question-images')
    .getPublicUrl(fileName);
    
  return data.publicUrl;
}
