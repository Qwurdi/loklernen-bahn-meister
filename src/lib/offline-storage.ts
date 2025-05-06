
/**
 * Offline data storage service using IndexedDB
 * Provides persistence for flashcards and user progress
 */

import { Question } from '@/types/questions';
import { UserProgress } from '@/hooks/spaced-repetition/types';

// IndexedDB constants
const DB_NAME = 'loklernen-offline';
const DB_VERSION = 1;
const CARDS_STORE = 'cards';
const PROGRESS_STORE = 'progress';
const PENDING_ACTIONS_STORE = 'pendingActions';
const META_STORE = 'meta';

// Initialize the database
async function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      console.error('IndexedDB error:', event);
      reject('Could not open offline database');
    };
    
    request.onsuccess = () => {
      resolve(request.result);
    };
    
    request.onupgradeneeded = (event) => {
      const db = request.result;
      
      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains(CARDS_STORE)) {
        const cardsStore = db.createObjectStore(CARDS_STORE, { keyPath: 'id' });
        cardsStore.createIndex('category', 'category', { unique: false });
        cardsStore.createIndex('sub_category', 'sub_category', { unique: false });
        console.log('Created cards store in IndexedDB');
      }
      
      if (!db.objectStoreNames.contains(PROGRESS_STORE)) {
        const progressStore = db.createObjectStore(PROGRESS_STORE, { keyPath: 'id' });
        progressStore.createIndex('question_id', 'question_id', { unique: false });
        console.log('Created progress store in IndexedDB');
      }
      
      if (!db.objectStoreNames.contains(PENDING_ACTIONS_STORE)) {
        const actionsStore = db.createObjectStore(PENDING_ACTIONS_STORE, { 
          keyPath: 'id', autoIncrement: true 
        });
        actionsStore.createIndex('timestamp', 'timestamp', { unique: false });
        console.log('Created pending actions store in IndexedDB');
      }
      
      if (!db.objectStoreNames.contains(META_STORE)) {
        const metaStore = db.createObjectStore(META_STORE, { keyPath: 'key' });
        console.log('Created meta store in IndexedDB');
      }
    };
  });
}

// Save questions to IndexedDB
export async function saveQuestionsToCache(
  questions: Question[], 
  category: string, 
  subcategory?: string
): Promise<void> {
  try {
    const db = await initDB();
    const tx = db.transaction(CARDS_STORE, 'readwrite');
    const store = tx.objectStore(CARDS_STORE);
    
    // Store each question
    for (const question of questions) {
      store.put(question);
    }
    
    // Store metadata about when this category was last cached
    const metaTx = db.transaction(META_STORE, 'readwrite');
    const metaStore = metaTx.objectStore(META_STORE);
    const cacheKey = `cache_${category}_${subcategory || 'all'}`;
    metaStore.put({ key: cacheKey, timestamp: new Date().toISOString() });
    
    await new Promise((resolve) => {
      tx.oncomplete = resolve;
    });
    
    console.log(`Cached ${questions.length} questions for ${category}/${subcategory || 'all'}`);
  } catch (error) {
    console.error('Failed to save questions to IndexedDB:', error);
  }
}

// Get questions from IndexedDB
export async function getQuestionsFromCache(
  category: string, 
  subcategory?: string
): Promise<Question[]> {
  try {
    const db = await initDB();
    const tx = db.transaction(CARDS_STORE, 'readonly');
    const store = tx.objectStore(CARDS_STORE);
    
    // Get all questions
    const allQuestions = await new Promise<Question[]>((resolve) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
    });
    
    // Filter by category and subcategory
    let filteredQuestions = allQuestions.filter(q => q.category === category);
    if (subcategory) {
      filteredQuestions = filteredQuestions.filter(q => q.sub_category === subcategory);
    }
    
    console.log(`Retrieved ${filteredQuestions.length} questions from cache for ${category}/${subcategory || 'all'}`);
    return filteredQuestions;
  } catch (error) {
    console.error('Failed to get questions from IndexedDB:', error);
    return [];
  }
}

// Save progress to IndexedDB
export async function saveProgressToCache(progress: UserProgress[]): Promise<void> {
  try {
    const db = await initDB();
    const tx = db.transaction(PROGRESS_STORE, 'readwrite');
    const store = tx.objectStore(PROGRESS_STORE);
    
    // Store each progress record
    for (const p of progress) {
      store.put(p);
    }
    
    await new Promise((resolve) => {
      tx.oncomplete = resolve;
    });
    
    console.log(`Cached ${progress.length} progress records`);
  } catch (error) {
    console.error('Failed to save progress to IndexedDB:', error);
  }
}

// Get progress from IndexedDB
export async function getProgressFromCache(): Promise<UserProgress[]> {
  try {
    const db = await initDB();
    const tx = db.transaction(PROGRESS_STORE, 'readonly');
    const store = tx.objectStore(PROGRESS_STORE);
    
    const progress = await new Promise<UserProgress[]>((resolve) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
    });
    
    console.log(`Retrieved ${progress.length} progress records from cache`);
    return progress;
  } catch (error) {
    console.error('Failed to get progress from IndexedDB:', error);
    return [];
  }
}

// Store pending user actions that couldn't be sent to the server
export async function storePendingAction(action: {
  type: 'answer' | 'sync',
  data: any,
  timestamp: string
}): Promise<void> {
  try {
    const db = await initDB();
    const tx = db.transaction(PENDING_ACTIONS_STORE, 'readwrite');
    const store = tx.objectStore(PENDING_ACTIONS_STORE);
    
    await new Promise((resolve, reject) => {
      const request = store.add(action);
      request.onsuccess = resolve;
      request.onerror = reject;
    });
    
    console.log(`Stored pending action of type ${action.type}`);
  } catch (error) {
    console.error('Failed to store pending action:', error);
  }
}

// Get all pending actions that need to be synced
export async function getPendingActions(): Promise<any[]> {
  try {
    const db = await initDB();
    const tx = db.transaction(PENDING_ACTIONS_STORE, 'readonly');
    const store = tx.objectStore(PENDING_ACTIONS_STORE);
    
    const actions = await new Promise<any[]>((resolve) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
    });
    
    return actions;
  } catch (error) {
    console.error('Failed to get pending actions:', error);
    return [];
  }
}

// Remove pending actions once they've been processed
export async function removePendingAction(id: number): Promise<void> {
  try {
    const db = await initDB();
    const tx = db.transaction(PENDING_ACTIONS_STORE, 'readwrite');
    const store = tx.objectStore(PENDING_ACTIONS_STORE);
    
    await new Promise<void>((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = reject;
    });
  } catch (error) {
    console.error('Failed to remove pending action:', error);
  }
}

// Clear all cached data to free up space
export async function clearCache(): Promise<void> {
  try {
    const db = await initDB();
    
    const cardsTransaction = db.transaction(CARDS_STORE, 'readwrite');
    cardsTransaction.objectStore(CARDS_STORE).clear();
    
    const progressTransaction = db.transaction(PROGRESS_STORE, 'readwrite');
    progressTransaction.objectStore(PROGRESS_STORE).clear();
    
    console.log('Offline cache cleared successfully');
  } catch (error) {
    console.error('Failed to clear cache:', error);
  }
}

// Check if we have cached data for a specific category
export async function hasCachedData(
  category: string, 
  subcategory?: string
): Promise<boolean> {
  try {
    const db = await initDB();
    const tx = db.transaction(META_STORE, 'readonly');
    const store = tx.objectStore(META_STORE);
    
    const cacheKey = `cache_${category}_${subcategory || 'all'}`;
    const result = await new Promise<any>((resolve) => {
      const request = store.get(cacheKey);
      request.onsuccess = () => resolve(request.result);
    });
    
    return !!result;
  } catch (error) {
    console.error('Failed to check cached data:', error);
    return false;
  }
}
