
import { Answer, CreateQuestionDTO } from "@/types/questions";

export const validateQuestionForm = (formData: Partial<CreateQuestionDTO>): string[] => {
  const errors: string[] = [];
  
  if (!formData) {
    errors.push("Formular-Daten fehlen.");
    return errors;
  }
  
  if (!formData.text?.trim()) {
    errors.push("Bitte geben Sie einen Fragetext ein.");
  }
  
  if (!formData.category) {
    errors.push("Bitte wählen Sie eine Kategorie aus.");
  }
  
  if (!formData.sub_category) {
    errors.push("Bitte wählen Sie eine Unterkategorie aus.");
  }
  
  // Validate answers
  if (!formData.answers || !Array.isArray(formData.answers) || formData.answers.length === 0) {
    errors.push("Bitte geben Sie mindestens eine Antwort ein.");
  } else {
    // Check if any answer text is empty
    if (formData.answers.some(a => !a?.text?.trim())) {
      errors.push("Bitte geben Sie für alle Antworten einen Text ein.");
    }
    
    // For MC_single and MC_multi, ensure at least one answer is marked as correct
    if ((formData.question_type === "MC_single" || formData.question_type === "MC_multi") && 
        !formData.answers.some(a => a?.isCorrect === true)) {
      errors.push("Bitte markieren Sie mindestens eine Antwort als korrekt.");
    }
    
    // Check for malformed answers
    try {
      formData.answers.forEach(answer => {
        if (typeof answer !== 'object') {
          errors.push("Ungültiges Antwortformat.");
        }
      });
    } catch (err) {
      errors.push("Fehler bei der Antwortvalidierung.");
      console.error("Answer validation error:", err);
    }
  }
  
  return errors;
};
