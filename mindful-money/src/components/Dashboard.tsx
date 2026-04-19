/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Plus, Wallet, AlertCircle, ShoppingBag, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { Expense, WishlistItem } from '../types';

interface DashboardProps {
  expenses: Expense[];
  wishlist: WishlistItem[];
  onAddClick: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ expenses, wishlist, onAddClick }) => {
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const leakyMoney = expenses
    .filter(e => e.ouchFactor <= 3)
    .reduce((sum, e) => sum + e.amount, 0);
  
  const weeklyAverage = totalSpent / Math.max(1, expenses.length / 5); // Rough estimation

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-serif font-black tracking-tight text-slate-900">Your Spending Pulse</h1>
          <p className="text-slate-500 font-medium">Tracking the 'invisible leaks' in your wallet.</p>
        </div>
        <button
          onClick={onAddClick}
          className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-orange-200 hover:bg-orange-700 hover:-translate-y-0.5 transition-all"
        >
          <Plus className="h-5 w-5" />
          Log Expense
        </button>
      </header>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <Wallet className="h-6 w-6" />
            </div>
          </div>
          <div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Total Spent</p>
            <h3 className="text-3xl font-serif font-bold text-slate-900">${totalSpent.toFixed(2)}</h3>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-orange-50 p-6 rounded-3xl shadow-sm border border-orange-100 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl">
              <AlertCircle className="h-6 w-6" />
            </div>
            {leakyMoney > 0 && (
              <span className="text-xs font-bold px-2 py-1 bg-orange-200 text-orange-700 rounded-full">
                Leak Detected
              </span>
            )}
          </div>
          <div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Leaky Money (Ouch 1-3)</p>
            <h3 className="text-3xl font-serif font-bold text-orange-700">${leakyMoney.toFixed(2)}</h3>
            <p className="text-orange-600/70 text-xs mt-1 font-medium">Spending you didn't even feel.</p>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-slate-900 p-6 rounded-3xl shadow-sm flex flex-col justify-between text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-slate-800 text-slate-400 rounded-2xl">
              <ShoppingBag className="h-6 w-6" />
            </div>
          </div>
          <div>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Wishlist Items</p>
            <h3 className="text-3xl font-serif font-bold">{wishlist.length}</h3>
            <p className="text-slate-400 text-xs mt-1 font-medium">Items in 48-hour cooling period.</p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Leaky Analysis Chart Mock/Visual */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Spending Intentionality
          </h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 font-medium font-serif">Low Intention (1-3)</span>
              <span className="font-bold text-orange-600">{((leakyMoney / (totalSpent || 1)) * 100).toFixed(0)}%</span>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(leakyMoney / (totalSpent || 1)) * 100}%` }}
                className="h-full bg-orange-500"
              />
            </div>
            <p className="text-sm text-slate-500 italic">
              "The goal is to stop spending on things that feel like nothing."
            </p>
          </div>
        </div>

        {/* Recent Leaks */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h4 className="text-lg font-bold mb-4">Recent 'Level 1' Purchases</h4>
          <div className="space-y-3">
            {expenses.filter(e => e.ouchFactor === 1).slice(0, 3).length > 0 ? (
               expenses.filter(e => e.ouchFactor === 1).slice(0, 3).map(e => (
                <div key={e.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="font-medium text-slate-700">{e.title}</span>
                  <span className="font-bold text-slate-900">${e.amount.toFixed(2)}</span>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-sm py-4">No Level 1 leaks found recently. Great work!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
