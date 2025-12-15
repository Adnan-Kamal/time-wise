import { Activity, Goal } from '../types';

const DB_NAME = 'TimeWiseDB';
const DB_VERSION = 1;
const STORE_ACTIVITIES = 'activities';
const STORE_GOALS = 'goals';

// --- IndexedDB Helpers ---

const getDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_ACTIVITIES)) {
        db.createObjectStore(STORE_ACTIVITIES, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_GOALS)) {
        db.createObjectStore(STORE_GOALS, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const loadFromStore = async <T>(storeName: string): Promise<T[]> => {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result as T[]);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error(`Error loading from ${storeName}:`, error);
    return [];
  }
};

const saveToStore = async <T>(storeName: string, items: T[]): Promise<void> => {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);

      // We clear and re-add to sync the state exactly (handles deletions).
      // For a larger app, we would use individual put/delete operations, 
      // but for this MVP snapshot approach, this ensures consistency.
      const clearRequest = store.clear();

      clearRequest.onsuccess = () => {
        items.forEach(item => store.add(item));
      };

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (error) {
    console.error(`Error saving to ${storeName}:`, error);
  }
};

// --- Migration & Public API ---

const LEGACY_ACTIVITIES_KEY = 'timewise_activities_v1';
const LEGACY_GOALS_KEY = 'timewise_goals_v1';

export const loadActivities = async (): Promise<Activity[]> => {
  try {
    const activities = await loadFromStore<Activity>(STORE_ACTIVITIES);
    
    // Migration: If DB is empty, check localStorage
    if (activities.length === 0) {
      const legacyData = localStorage.getItem(LEGACY_ACTIVITIES_KEY);
      if (legacyData) {
        console.log("Migrating Activities from LocalStorage to IndexedDB...");
        const parsed = JSON.parse(legacyData);
        await saveToStore(STORE_ACTIVITIES, parsed);
        return parsed;
      }
    }
    return activities;
  } catch (error) {
    console.error("Failed to load activities", error);
    return [];
  }
};

export const saveActivities = async (activities: Activity[]): Promise<void> => {
  await saveToStore(STORE_ACTIVITIES, activities);
};

export const loadGoals = async (): Promise<Goal[]> => {
  try {
    const goals = await loadFromStore<Goal>(STORE_GOALS);
    
    // Migration: If DB is empty, check localStorage
    if (goals.length === 0) {
      const legacyData = localStorage.getItem(LEGACY_GOALS_KEY);
      if (legacyData) {
        console.log("Migrating Goals from LocalStorage to IndexedDB...");
        const parsed = JSON.parse(legacyData);
        await saveToStore(STORE_GOALS, parsed);
        return parsed;
      }
    }
    return goals;
  } catch (error) {
    console.error("Failed to load goals", error);
    return [];
  }
};

export const saveGoals = async (goals: Goal[]): Promise<void> => {
  await saveToStore(STORE_GOALS, goals);
};
