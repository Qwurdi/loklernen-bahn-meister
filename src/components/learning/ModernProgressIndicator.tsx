
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Target, TrendingUp } from 'lucide-react';

interface ModernProgressIndicatorProps {
  currentIndex: number;
  totalCards: number;
  correctCount: number;
}

export default function ModernProgressIndicator({
  currentIndex,
  totalCards,
  correctCount
}: ModernProgressIndicatorProps) {
  const progressPercentage = ((currentIndex + 1) / totalCards) * 100;
  const accuracyPercentage = currentIndex > 0 ? (correctCount / (currentIndex + 1)) * 100 : 0;

  return (
    <motion.div 
      className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Progress bar with micro-animation */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-gray-700">Fortschritt</span>
          <span className="text-sm font-bold text-gray-900">{currentIndex + 1} / {totalCards}</span>
        </div>
        <div className="relative h-3 bg-gray-200/60 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full shadow-sm"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>

      {/* Stats grid with expressive cards */}
      <div className="grid grid-cols-3 gap-4">
        {/* Total cards */}
        <motion.div 
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100/50"
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/10 rounded-xl">
              <Target className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-blue-600 font-medium">Gesamt</p>
              <p className="text-lg font-bold text-blue-900">{totalCards}</p>
            </div>
          </div>
        </motion.div>

        {/* Correct answers */}
        <motion.div 
          className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100/50"
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/10 rounded-xl">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-emerald-600 font-medium">Richtig</p>
              <p className="text-lg font-bold text-emerald-900">{correctCount}</p>
            </div>
          </div>
        </motion.div>

        {/* Accuracy */}
        <motion.div 
          className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-100/50"
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500/10 rounded-xl">
              <TrendingUp className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-amber-600 font-medium">Quote</p>
              <p className="text-lg font-bold text-amber-900">{Math.round(accuracyPercentage)}%</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
