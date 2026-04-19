/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Save, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { Expense, WishlistItem } from '../types';

interface ExpenseFormProps {
  onClose: () => void;
  onSubmit: (data: Partial<Expense | WishlistItem>, isWishlist: boolean) => void;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ onClose, onSubmit }) => {
  const [title, setTitle] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [ouchFactor, setOuchFactor] = React.useState(5);
  const [isWishlist, setIsWishlist] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;

    onSubmit({
      title,
      amount: parseFloat(amount),
      ouchFactor: isWishlist ? undefined : ouchFactor,
    }, isWishlist);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
    >
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-serif font-black">Logged Spending</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">What did you buy?</label>
            <input
              autoFocus
              required
              className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-orange-500 transition-all font-medium"
              placeholder="Coffee, Uber, App Subscription..."
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
              <input
                required
                type="number"
                step="0.01"
                className="w-full bg-slate-50 border-none rounded-2xl p-4 pl-8 focus:ring-2 focus:ring-orange-500 transition-all font-bold text-xl"
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-2xl border border-orange-100">
            <input
              type="checkbox"
              id="wishlist"
              className="h-5 w-5 rounded border-orange-300 text-orange-600 focus:ring-orange-500"
              checked={isWishlist}
              onChange={e => setIsWishlist(e.target.checked)}
            />
            <label htmlFor="wishlist" className="flex flex-col cursor-pointer">
              <span className="font-bold text-orange-800 text-sm">Use 48-Hour Rule</span>
              <span className="text-orange-600 text-xs">Wait 2 days before actually buying this.</span>
            </label>
          </div>

          {!isWishlist && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Ouch Factor (1-10)</label>
                <div className={`px-3 py-1 rounded-full font-black text-sm ouch-gradient-${ouchFactor}`}>
                  {ouchFactor}
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                value={ouchFactor}
                onChange={e => setOuchFactor(parseInt(e.target.value))}
              />
              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                <span>Didn't notice</span>
                <span>It really hurt</span>
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-slate-900 text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
            >
              {isWishlist ? (
                <>
                  <Clock className="h-5 w-5" />
                  Start 48h Wait
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Log Expense
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};
