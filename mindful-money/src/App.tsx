/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  LayoutDashboard, 
  History, 
  ShieldCheck, 
  Sparkles,
  Menu,
  X as CloseIcon,
  Trash2,
  CheckCircle2,
  Volume2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Expense, WishlistItem } from './types';
import { Dashboard } from './components/Dashboard';
import { ExpenseForm } from './components/ExpenseForm';
import { SarahsCorner } from './components/SarahsCorner';
import { speakText } from './services/gemini';

type Tab = 'dashboard' | 'history' | 'wishlist' | 'sarah';

export default function App() {
  const [activeTab, setActiveTab] = React.useState<Tab>('dashboard');
  const [expenses, setExpenses] = React.useState<Expense[]>(() => {
    const saved = localStorage.getItem('mindful-expenses');
    return saved ? JSON.parse(saved) : [];
  });
  const [wishlist, setWishlist] = React.useState<WishlistItem[]>(() => {
    const saved = localStorage.getItem('mindful-wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  React.useEffect(() => {
    localStorage.setItem('mindful-expenses', JSON.stringify(expenses));
  }, [expenses]);

  React.useEffect(() => {
    localStorage.setItem('mindful-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const handleAddExpense = (data: any, isWishlist: boolean) => {
    if (isWishlist) {
      const newItem: WishlistItem = {
        id: crypto.randomUUID(),
        title: data.title,
        amount: data.amount,
        addedAt: new Date().toISOString(),
      };
      setWishlist([newItem, ...wishlist]);
    } else {
      const newExpense: Expense = {
        id: crypto.randomUUID(),
        title: data.title,
        amount: data.amount,
        ouchFactor: data.ouchFactor,
        date: new Date().toISOString(),
      };
      setExpenses([newExpense, ...expenses]);
      
      // Reactive feedback if it's a "leak"
      if (data.ouchFactor <= 3) {
        speakText("That felt like a small, invisible leak. Remember Sarah's story.");
      }
    }
    setIsFormOpen(false);
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const deleteWishlist = (id: string) => {
    setWishlist(wishlist.filter(w => w.id !== id));
  };

  const convertToExpense = (item: WishlistItem) => {
    const newExpense: Expense = {
      id: crypto.randomUUID(),
      title: item.title,
      amount: item.amount,
      ouchFactor: 5, // Default for intentional purchase
      date: new Date().toISOString(),
    };
    setExpenses([newExpense, ...expenses]);
    setWishlist(wishlist.filter(w => w.id !== item.id));
    speakText(`The 48-hour rule worked. You chose to keep ${item.title} with intention.`);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'history', label: 'History', icon: History },
    { id: 'wishlist', label: '48h Rule', icon: ShieldCheck },
    { id: 'sarah', label: "Sarah's Corner", icon: Sparkles },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col p-6">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="bg-orange-600 p-2 rounded-xl text-white shadow-lg shadow-orange-200">
          <Sparkles className="h-6 w-6" />
        </div>
        <span className="text-xl font-serif font-black tracking-tight">Mindful Money</span>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id as Tab);
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${
              activeTab === item.id 
                ? 'bg-orange-600 text-white shadow-md shadow-orange-100' 
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-auto p-4 bg-orange-50 rounded-2xl border border-orange-100">
        <p className="text-xs font-bold text-orange-800 uppercase tracking-widest mb-1">Mantra</p>
        <p className="text-sm text-orange-700 font-serif italic">"Stop spending on things that feel like nothing."</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[var(--color-brand-accent)] text-slate-900 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 bg-white border-r border-slate-200 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-72 bg-white h-full shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-end p-4">
                <button onClick={() => setSidebarOpen(false)} className="p-2 text-slate-400">
                  <CloseIcon className="h-6 w-6" />
                </button>
              </div>
              {sidebarContent}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto w-full">
        <div className="max-w-5xl mx-auto p-6 lg:p-12 pb-24">
          <header className="flex items-center justify-between lg:hidden mb-8">
            <button onClick={() => setSidebarOpen(true)} className="p-2 bg-white rounded-xl border border-slate-200 shadow-sm">
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-orange-600" />
              <span className="font-serif font-black tracking-tight">Mindful Money</span>
            </div>
            <div className="w-10"></div>
          </header>

          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <Dashboard 
                key="dashboard"
                expenses={expenses} 
                wishlist={wishlist} 
                onAddClick={() => setIsFormOpen(true)} 
              />
            )}

            {activeTab === 'history' && (
              <motion.section 
                key="history"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-serif font-black">Spending History</h2>
                <div className="grid gap-4">
                  {expenses.length === 0 ? (
                    <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-300 text-center">
                      <p className="text-slate-400">No expenses logged yet. Start small.</p>
                    </div>
                  ) : (
                    expenses.map((expense) => (
                      <div key={expense.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs ouch-gradient-${expense.ouchFactor}`}>
                            {expense.ouchFactor}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900">{expense.title}</h4>
                            <p className="text-xs text-slate-400 font-medium">{new Date(expense.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-lg font-bold font-mono text-slate-900">${expense.amount.toFixed(2)}</span>
                          <button 
                            onClick={() => deleteExpense(expense.id)}
                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.section>
            )}

            {activeTab === 'wishlist' && (
              <motion.section 
                key="wishlist"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex flex-col gap-2">
                  <h2 className="text-3xl font-serif font-black">The 48-Hour Wishlist</h2>
                  <p className="text-slate-500">Wait 2 days. If you still want it, it's intentional.</p>
                </div>
                
                <div className="grid gap-6">
                  {wishlist.length === 0 ? (
                    <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-300 text-center">
                      <p className="text-slate-400">Your wishlist is empty. Add something to test your willpower.</p>
                    </div>
                  ) : (
                    wishlist.map((item) => {
                      const addedDate = new Date(item.addedAt);
                      const now = new Date();
                      const diffHours = (now.getTime() - addedDate.getTime()) / (1000 * 60 * 60);
                      const isReady = diffHours >= 48;
                      const progress = Math.min(100, (diffHours / 48) * 100);

                      return (
                        <div key={item.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-lg font-bold text-slate-900">{item.title}</h4>
                              <p className="text-2xl font-serif font-black text-orange-600 mt-1">${item.amount.toFixed(2)}</p>
                            </div>
                            <button 
                              onClick={() => deleteWishlist(item.id)}
                              className="p-2 text-slate-300 hover:text-red-500 rounded-lg"
                            >
                              <CloseIcon className="h-5 w-5" />
                            </button>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                              <span className={isReady ? "text-green-600" : "text-slate-400"}>
                                {isReady ? "Time's Up" : `${Math.floor(48 - diffHours)}h Remaining`}
                              </span>
                              <span className="text-slate-400">{progress.toFixed(0)}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                className={`h-full ${isReady ? 'bg-green-500' : 'bg-orange-500'}`}
                              />
                            </div>
                          </div>

                          <div className="flex gap-3 pt-2">
                            {isReady ? (
                              <button 
                                onClick={() => convertToExpense(item)}
                                className="flex-1 bg-green-600 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-green-700 transition-all"
                              >
                                <CheckCircle2 className="h-5 w-5" />
                                Buy Intentionally
                              </button>
                            ) : (
                              <button className="flex-1 bg-slate-100 text-slate-400 font-bold py-3 rounded-2xl cursor-not-allowed">
                                Cooling Down...
                              </button>
                            )}
                            <button 
                              onClick={() => deleteWishlist(item.id)}
                              className="px-6 py-3 border border-slate-200 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 transition-all"
                            >
                              Dismiss
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </motion.section>
            )}

            {activeTab === 'sarah' && (
              <motion.section 
                key="sarah"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
              >
                <SarahsCorner />
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Floating Insight Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button 
          onClick={async () => {
             const insight = "Every time you pay with FaceID, you get a small dopamine hit. Fast. Easy. Instant. But it bypasses logic.";
             await speakText(insight, 'Zephyr');
          }}
          className="bg-white p-4 rounded-full shadow-xl border border-orange-100 text-orange-600 hover:-translate-y-1 transition-all group"
          title="Get a quick Sarah insight"
        >
          <Volume2 className="h-6 w-6 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <ExpenseForm 
            onClose={() => setIsFormOpen(false)} 
            onSubmit={handleAddExpense} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
