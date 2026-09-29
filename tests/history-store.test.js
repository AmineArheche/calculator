import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HistoryStore } from '../src/core/history-store.js';

describe('HistoryStore', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with empty items when localStorage is blank', () => {
    const store = new HistoryStore('test_calc_history');
    expect(store.getItems()).toEqual([]);
    expect(store.getCount()).toBe(0);
  });

  it('records new entries and notifies subscribers', () => {
    const store = new HistoryStore('test_calc_history');
    const subscriber = vi.fn();
    store.subscribe(subscriber);

    expect(subscriber).toHaveBeenCalledWith([]);

    store.addEntry('10 + 20', '30');

    expect(store.getCount()).toBe(1);
    const items = store.getItems();
    expect(items[0].expression).toBe('10 + 20');
    expect(items[0].result).toBe('30');
    expect(subscriber).toHaveBeenCalledWith(items);
  });

  it('persists entries across store instances via localStorage', () => {
    const store1 = new HistoryStore('test_calc_history');
    store1.addEntry('5 × 5', '25');

    const store2 = new HistoryStore('test_calc_history');
    expect(store2.getCount()).toBe(1);
    expect(store2.getItems()[0].result).toBe('25');
  });

  it('respects maximum entry limits', () => {
    const store = new HistoryStore('test_calc_history', 3);
    store.addEntry('1 + 1', '2');
    store.addEntry('2 + 2', '4');
    store.addEntry('3 + 3', '6');
    store.addEntry('4 + 4', '8');

    expect(store.getCount()).toBe(3);
    expect(store.getItems()[0].result).toBe('8');
    expect(store.getItems()[2].result).toBe('4');
  });

  it('clears all entries and updates storage', () => {
    const store = new HistoryStore('test_calc_history');
    store.addEntry('100 / 2', '50');
    expect(store.getCount()).toBe(1);

    store.clear();
    expect(store.getCount()).toBe(0);
    expect(store.getItems()).toEqual([]);
  });
});
