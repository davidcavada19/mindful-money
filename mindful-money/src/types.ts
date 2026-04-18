/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Expense {
  id: string;
  title: string;
  amount: number;
  ouchFactor: number; // 1-10
  date: string; // ISO string
  category?: string;
}

export interface WishlistItem {
  id: string;
  title: string;
  amount: number;
  addedAt: string; // ISO string
  isWaitOver?: boolean;
}

export interface UserStats {
  monthlyIncome: number;
  totalSpent: number;
  leakyMoney: number; // Ouch 1-3
}
