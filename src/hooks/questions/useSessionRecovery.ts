
import { useState, useEffect } from 'react';
import { CreateQuestionDTO } from '@/types/questions';
import { toast } from 'sonner';

const SESSION_RECOVERY_KEY = 'question-editor-recovery';

interface RecoveryData {
  formData: Partial<CreateQuestionDTO>;
  timestamp: number;
  questionId?: string;
}

export const useSessionRecovery = (
  formData: Partial<CreateQuestionDTO>,
  isEditMode: boolean,
  questionId?: string
) => {
  const [recoveryEnabled, setRecoveryEnabled] = useState<boolean>(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState<boolean>(false);

  // Save current form data to localStorage
  const saveRecoveryData = () => {
    try {
      if (!recoveryEnabled || isEditMode) return;
      
      const recoveryData: RecoveryData = {
        formData,
        timestamp: Date.now(),
        questionId,
      };
      
      localStorage.setItem(SESSION_RECOVERY_KEY, JSON.stringify(recoveryData));
      setLastSaved(new Date());
      setIsDirty(false);
    } catch (error) {
      console.error('Failed to save recovery data:', error);
    }
  };

  // Check for and load recovery data
  const checkForRecovery = (): RecoveryData | null => {
    try {
      const savedData = localStorage.getItem(SESSION_RECOVERY_KEY);
      if (!savedData) return null;
      
      const parsedData = JSON.parse(savedData) as RecoveryData;
      
      // Validate data - make sure it's not too old (24 hours max)
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      if (Date.now() - parsedData.timestamp > maxAge) {
        clearRecovery();
        return null;
      }
      
      return parsedData;
    } catch (error) {
      console.error('Failed to retrieve recovery data:', error);
      return null;
    }
  };

  // Clear recovery data
  const clearRecovery = () => {
    try {
      localStorage.removeItem(SESSION_RECOVERY_KEY);
      setLastSaved(null);
      setIsDirty(false);
    } catch (error) {
      console.error('Failed to clear recovery data:', error);
    }
  };

  // Check if the form is dirty (unsaved changes)
  useEffect(() => {
    setIsDirty(true);
  }, [formData]);

  // Save recovery data periodically
  useEffect(() => {
    if (!recoveryEnabled || !isDirty) return;
    
    const timer = setTimeout(() => {
      saveRecoveryData();
    }, 5000); // Save every 5 seconds if there are changes
    
    return () => clearTimeout(timer);
  }, [formData, recoveryEnabled, isDirty]);

  return {
    lastSaved,
    isDirty,
    checkForRecovery,
    saveRecoveryData,
    clearRecovery,
    setRecoveryEnabled,
  };
};
