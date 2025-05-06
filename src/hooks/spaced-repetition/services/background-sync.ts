
import { getPendingActions, removePendingAction } from '@/lib/offline-storage';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { updateUserProgress } from './progress-updates';
import { updateUserStats } from './user-stats';

// Add TypeScript declaration for SyncManager
declare global {
  interface ServiceWorkerRegistration {
    sync?: {
      register(tag: string): Promise<void>;
    }
  }
  
  interface SyncManager {
    register(tag: string): Promise<void>;
  }
}

/**
 * Sync pending offline actions with the backend once online
 */
export async function syncOfflineData(userId: string): Promise<boolean> {
  if (!navigator.onLine || !userId) return false;
  
  console.log("Attempting to sync offline data");
  
  try {
    // Get all pending actions
    const pendingActions = await getPendingActions();
    
    if (pendingActions.length === 0) {
      console.log("No pending actions to sync");
      return true;
    }
    
    console.log(`Found ${pendingActions.length} pending actions to sync`);
    
    let successCount = 0;
    
    // Process each action
    for (const action of pendingActions) {
      try {
        if (action.type === 'answer') {
          const { questionId, score } = action.data;
          
          // Get current progress for this question, if any
          const { data: progressData } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', userId)
            .eq('question_id', questionId)
            .maybeSingle();
          
          // Update progress
          await updateUserProgress(userId, questionId, score, progressData);
          
          // Update stats
          await updateUserStats(userId, score);
          
          // Action successfully processed
          await removePendingAction(action.id);
          successCount++;
        }
      } catch (actionError) {
        console.error(`Error syncing action ${action.id}:`, actionError);
      }
    }
    
    console.log(`Successfully synced ${successCount}/${pendingActions.length} actions`);
    
    // Show success notification if any actions were synced
    if (successCount > 0) {
      toast.success(`${successCount} Antworten erfolgreich synchronisiert`);
    }
    
    return successCount > 0;
  } catch (error) {
    console.error("Error syncing offline data:", error);
    return false;
  }
}

/**
 * Register a background sync if the browser supports it
 */
export function registerBackgroundSync() {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    navigator.serviceWorker.ready.then(registration => {
      // Register for background sync
      // Use optional chaining to safely access the sync property
      registration.sync?.register('sync-pending-answers')
        .then(() => {
          console.log('Background sync registered for pending answers');
        })
        .catch(err => {
          console.error('Background sync registration failed:', err);
        });
    });
  }
}

/**
 * Request sync of offline data now
 */
export function requestSync(userId: string) {
  if (navigator.onLine && userId) {
    return syncOfflineData(userId);
  }
  return Promise.resolve(false);
}
