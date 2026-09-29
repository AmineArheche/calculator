/**
 * History Store with LocalStorage Persistence
 * Manages computation logs, reactive subscriptions, and state recovery.
 */

export class HistoryStore {
  constructor(storageKey = 'calc_history', maxEntries = 50) {
    this.storageKey = storageKey;
    this.maxEntries = maxEntries;
    this.listeners = new Set();
    this.items = this.loadFromStorage();
  }

  /**
   * Subscribe to history changes.
   * @param {Function} listener 
   * @returns {Function} Unsubscribe callback
   */
  subscribe(listener) {
    this.listeners.add(listener);
    listener(this.getItems());
    return () => this.listeners.delete(listener);
  }

  notify() {
    const currentItems = this.getItems();
    this.listeners.forEach((fn) => fn(currentItems));
  }

  /**
   * Returns copy of stored items.
   * @returns {Array<{id: number, expression: string, result: string, timestamp: string}>}
   */
  getItems() {
    return [...this.items];
  }

  getCount() {
    return this.items.length;
  }

  /**
   * Adds a new entry and saves to localStorage.
   * @param {string} expression 
   * @param {string} result 
   */
  addEntry(expression, result) {
    const entry = {
      id: Date.now(),
      expression,
      result,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    this.items.unshift(entry);
    if (this.items.length > this.maxEntries) {
      this.items = this.items.slice(0, this.maxEntries);
    }

    this.saveToStorage();
    this.notify();
    return entry;
  }

  /**
   * Clears all history entries.
   */
  clear() {
    this.items = [];
    this.saveToStorage();
    this.notify();
  }

  /**
   * Loads history from localStorage safely.
   * @private
   */
  loadFromStorage() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const data = window.localStorage.getItem(this.storageKey);
        if (data) {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed)) {
            return parsed;
          }
        }
      }
    } catch (e) {
      console.warn('LocalStorage unavailable or corrupted, using in-memory history.', e);
    }
    return [];
  }

  /**
   * Persists items to localStorage safely.
   * @private
   */
  saveToStorage() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(this.storageKey, JSON.stringify(this.items));
      }
    } catch (e) {
      console.warn('Unable to persist history to localStorage.', e);
    }
  }
}
