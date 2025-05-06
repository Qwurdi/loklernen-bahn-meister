
import { useState, useEffect, useCallback } from 'react';
import { CreateQuestionDTO } from '@/types/questions';
import { toast } from 'sonner';

interface UseAutoSaveProps {
  formData: Partial<CreateQuestionDTO>;
  isEditMode: boolean;
  saveInterval?: number; // milliseconds
  enabled?: boolean;
}

export const useAutoSave = ({
  formData,
  isEditMode,
  saveInterval = 60000, // Default 1 minute
  enabled = true
}: UseAutoSaveProps) => {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  
  // Check if the form has enough data to be saved
  const canSave = useCallback(() => {
    return formData.text && formData.category && formData.sub_category;
  }, [formData]);
  
  // Save draft to localStorage
  const saveDraft = useCallback(() => {
    if (!enabled || !canSave()) return;
    
    try {
      const key = isEditMode && formData.id 
        ? `question_draft_${formData.id}` 
        : 'question_draft_new';
      
      localStorage.setItem(key, JSON.stringify({
        formData,
        timestamp: new Date().toISOString()
      }));
      
      setLastSaved(new Date());
      setIsDirty(false);
      
      // Optional notification
      toast.success('Entwurf automatisch gespeichert');
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  }, [formData, isEditMode, enabled, canSave]);
  
  // Load draft from localStorage
  const loadDraft = useCallback(() => {
    if (!enabled) return null;
    
    try {
      const key = isEditMode && formData.id 
        ? `question_draft_${formData.id}` 
        : 'question_draft_new';
      
      const savedData = localStorage.getItem(key);
      
      if (savedData) {
        const { formData: savedFormData, timestamp } = JSON.parse(savedData);
        return { 
          formData: savedFormData, 
          timestamp: new Date(timestamp)
        };
      }
    } catch (error) {
      console.error('Error loading draft:', error);
    }
    
    return null;
  }, [isEditMode, formData.id, enabled]);
  
  // Clear draft from localStorage
  const clearDraft = useCallback(() => {
    if (!enabled) return;
    
    try {
      const key = isEditMode && formData.id 
        ? `question_draft_${formData.id}` 
        : 'question_draft_new';
      
      localStorage.removeItem(key);
      setLastSaved(null);
    } catch (error) {
      console.error('Error clearing draft:', error);
    }
  }, [isEditMode, formData.id, enabled]);
  
  // Auto-save on interval
  useEffect(() => {
    if (!enabled || !isDirty) return;
    
    const interval = setInterval(() => {
      if (isDirty && canSave()) {
        saveDraft();
      }
    }, saveInterval);
    
    return () => clearInterval(interval);
  }, [enabled, isDirty, canSave, saveDraft, saveInterval]);
  
  // Mark as dirty when form data changes
  useEffect(() => {
    setIsDirty(true);
  }, [formData]);
  
  return {
    lastSaved,
    isDirty,
    saveDraft,
    loadDraft,
    clearDraft
  };
};
