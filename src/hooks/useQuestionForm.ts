import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { CreateQuestionDTO, Answer, QuestionCategory, QuestionType, Question } from "@/types/questions";
import { createQuestion, uploadQuestionImage } from "@/api/questions";
import { Json } from "@/integrations/supabase/types";
import { useQuestions } from "./useQuestions";

interface UseQuestionFormProps {
  id?: string;
  initialData?: Partial<CreateQuestionDTO>;
}

export const useQuestionForm = ({ id, initialData }: UseQuestionFormProps = {}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditMode = Boolean(id);
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { data: questions } = useQuestions();
  
  const [formData, setFormData] = useState<Partial<CreateQuestionDTO>>({
    category: "Signale" as QuestionCategory,
    sub_category: "Haupt- und Vorsignale",
    question_type: "open" as QuestionType,
    difficulty: 1,
    text: "",
    image_url: null,
    answers: [{ text: "", isCorrect: true }],
    created_by: user?.id || "",
    ...initialData
  });

  useEffect(() => {
    if (isEditMode && id && questions) {
      const questionToEdit = questions.find(q => q.id === id);
      if (questionToEdit) {
        console.log("Loading question data:", questionToEdit);
        setFormData({
          category: questionToEdit.category,
          sub_category: questionToEdit.sub_category,
          question_type: questionToEdit.question_type,
          difficulty: questionToEdit.difficulty,
          text: questionToEdit.text,
          image_url: questionToEdit.image_url,
          answers: questionToEdit.answers || [{ text: "", isCorrect: true }],
          created_by: questionToEdit.created_by
        });
        
        if (questionToEdit.image_url) {
          setImagePreview(questionToEdit.image_url);
        }
      }
    }
  }, [isEditMode, id, questions]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCategoryChange = (category: QuestionCategory) => {
    const defaultSubCategory = category === "Signale" 
      ? "Haupt- und Vorsignale"
      : "Grundlagen Bahnbetrieb";
      
    setFormData(prev => ({ 
      ...prev, 
      category,
      sub_category: defaultSubCategory,
      question_type: category === "Signale" ? "open" : prev.question_type
    }));
  };
  
  const handleSubCategoryChange = (subCategory: string) => {
    setFormData(prev => ({ ...prev, sub_category: subCategory }));
  };
  
  const handleDifficultyChange = (newDifficulty: number) => {
    setFormData(prev => ({ ...prev, difficulty: newDifficulty }));
  };
  
  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...(formData.answers || [])];
    newAnswers[index] = { ...newAnswers[index], text: value };
    setFormData(prev => ({ ...prev, answers: newAnswers }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData(prev => ({ ...prev, image_url: null }));
  };
  
  const toggleAnswerCorrectness = (index: number) => {
    const newAnswers = [...(formData.answers || [])];
    
    if (formData.question_type === "MC_single") {
      newAnswers.forEach(answer => answer.isCorrect = false);
    }
    
    newAnswers[index] = { 
      ...newAnswers[index], 
      isCorrect: !newAnswers[index].isCorrect 
    };
    
    setFormData(prev => ({ ...prev, answers: newAnswers }));
  };
  
  const addAnswer = () => {
    const newAnswers = [...(formData.answers || []), { text: "", isCorrect: false }];
    setFormData(prev => ({ ...prev, answers: newAnswers }));
  };
  
  const removeAnswer = (index: number) => {
    const newAnswers = (formData.answers || []).filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, answers: newAnswers }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Sie müssen angemeldet sein, um Fragen zu erstellen.");
      return;
    }
    
    try {
      setIsLoading(true);
      
      if (!formData.text) {
        toast.error("Bitte geben Sie einen Fragetext ein.");
        setIsLoading(false);
        return;
      }
      
      if (!formData.answers || formData.answers.length === 0 || 
          !formData.answers.some(a => a.text)) {
        toast.error("Bitte geben Sie mindestens eine Antwort ein.");
        setIsLoading(false);
        return;
      }
      
      let finalImageUrl = formData.image_url;
      if (imageFile) {
        finalImageUrl = await uploadQuestionImage(imageFile, user.id);
      }
      
      const questionData: CreateQuestionDTO = {
        category: formData.category as QuestionCategory,
        sub_category: formData.sub_category || "",
        question_type: formData.question_type as QuestionType,
        difficulty: formData.difficulty || 1,
        text: formData.text || "",
        image_url: finalImageUrl,
        answers: formData.answers as Answer[],
        created_by: user.id
      };
      
      if (isEditMode && id) {
        const supabaseAnswers: Json = questionData.answers.map(answer => ({
          text: answer.text,
          isCorrect: answer.isCorrect
        }));
        
        const { error } = await supabase
          .from('questions')
          .update({
            category: questionData.category,
            sub_category: questionData.sub_category,
            question_type: questionData.question_type,
            difficulty: questionData.difficulty,
            text: questionData.text,
            image_url: questionData.image_url,
            answers: supabaseAnswers,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);
        
        if (error) throw error;
        toast.success("Frage erfolgreich aktualisiert!");
      } else {
        await createQuestion(questionData);
        toast.success("Frage erfolgreich erstellt!");
      }
      
      navigate("/admin/questions");
    } catch (error) {
      console.error("Error saving question:", error);
      toast.error("Fehler beim Speichern der Frage. Bitte versuchen Sie es später noch einmal.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isEditMode,
    isLoading,
    formData,
    imagePreview,
    handleInputChange,
    handleCategoryChange,
    handleSubCategoryChange,
    handleDifficultyChange,
    handleAnswerChange,
    handleImageChange,
    removeImage,
    toggleAnswerCorrectness,
    addAnswer,
    removeAnswer,
    handleSubmit
  };
};
