import { Transaction } from '../types';
import { STORAGE_KEYS, INITIAL_TRANSACTIONS } from '../constants';
import { TransactionType } from '../types';

export const loadTransactions = (): Transaction[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!stored) {
        // Seed initial data for better first-time experience
        saveTransactions(INITIAL_TRANSACTIONS as Transaction[]);
        return INITIAL_TRANSACTIONS as Transaction[];
    }
    return JSON.parse(stored);
  } catch (e) {
    console.error("Failed to load transactions", e);
    return [];
  }
};

export const saveTransactions = (transactions: Transaction[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  } catch (e) {
    console.error("Failed to save transactions", e);
  }
};

export const loadPrices = (): Record<string, number> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PRICES);
    return stored ? JSON.parse(stored) : {};
  } catch (e) {
    return {};
  }
};

export const savePrices = (prices: Record<string, number>) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PRICES, JSON.stringify(prices));
  } catch (e) {
    console.error("Failed to save prices", e);
  }
};
