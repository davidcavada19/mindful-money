/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Volume2, Sparkles, X } from 'lucide-react';
import { speakText } from '../services/gemini';

const INSIGHTS = [
  "Most people are not broke because they don’t make enough money… they’re broke because their money is leaking.",
  "Your brain says 'I deserve this' when it's tired. But that's exactly when your logic is lowest.",
  "Frictionless spending bypasses your logic. Tracking expenses brings the feeling back. It wakes you up.",
  "If something is an Ouch Factor 1, it didn't even matter. So why are you spending money on it?",
  "Wait 48 hours. Most of the time, you won't even want it anymore because spending is emotional.",
];

export const SarahsCorner: React.FC = () => {
  const [currentInsight, setCurrentInsight] = React.useState<number | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const handlePlay = async (index: number) => {
    setCurrentInsight(index);
    setIsPlaying(true);
    const audio = await speakText(INSIGHTS[index]);
    if (audio) {
      audio.onended = () => setIsPlaying(false);
    } else {
      setIsPlaying(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-orange-100 p-2 rounded-full">
          <Sparkles className="text-orange-600 h-5 w-5" />
        </div>
        <h2 className="text-2xl font-serif font-bold">Sarah's Workshop</h2>
      </div>

      <div className="grid gap-4">
        {INSIGHTS.map((insight, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group relative bg-white p-5 rounded-2xl border border-orange-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all cursor-pointer"
            onClick={() => handlePlay(idx)}
          >
            <div className="flex items-start gap-4">
              <button
                className={`flex-shrink-0 mt-1 p-2 rounded-full ${
                  currentInsight === idx && isPlaying 
                    ? 'bg-orange-600 text-white animate-pulse' 
                    : 'bg-orange-50 text-orange-600 group-hover:bg-orange-100'
                } transition-colors`}
              >
                {currentInsight === idx && isPlaying ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4 fill-current" />
                )}
              </button>
              <p className="text-slate-700 leading-relaxed font-medium">"{insight}"</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
