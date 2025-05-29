
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useQuestions } from '@/hooks/useQuestions';
import { createQuestion, duplicateQuestion } from '@/api/questions';
import { updateQuestion, deleteQuestion } from '@/api/questions/mutations';
import { Question, QuestionCategory, CreateQuestionDTO } from '@/types/questions';
import { toast } from 'sonner';

export function useAdminQuestions(category?: QuestionCategory, sub_category?: string) {
  const queryClient = useQueryClient();
  const questionsQuery = useQuestions(category, sub_category);

  const createMutation = useMutation({
    mutationFn: createQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      toast.success('Frage erfolgreich erstellt');
    },
    onError: (error) => {
      toast.error(`Fehler beim Erstellen: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Question> }) => 
      updateQuestion(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      toast.success('Frage erfolgreich aktualisiert');
    },
    onError: (error) => {
      toast.error(`Fehler beim Aktualisieren: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      toast.success('Frage erfolgreich gelöscht');
    },
    onError: (error) => {
      toast.error(`Fehler beim Löschen: ${error.message}`);
    },
  });

  const duplicateMutation = useMutation({
    mutationFn: duplicateQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      toast.success('Frage erfolgreich dupliziert');
    },
    onError: (error) => {
      toast.error(`Fehler beim Duplizieren: ${error.message}`);
    },
  });

  return {
    // Query data
    questions: questionsQuery.data || [],
    isLoading: questionsQuery.isLoading,
    error: questionsQuery.error,
    
    // Mutations
    createQuestion: createMutation.mutate,
    updateQuestion: updateMutation.mutate,
    deleteQuestion: deleteMutation.mutate,
    duplicateQuestion: duplicateMutation.mutate,
    
    // Loading states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isDuplicating: duplicateMutation.isPending,
  };
}
