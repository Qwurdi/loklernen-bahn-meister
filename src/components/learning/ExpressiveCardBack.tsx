
import React from 'react';
import { Question } from '@/types/questions';
import { motion } from 'framer-motion';
import { RegulationFilterType } from '@/types/regulation';
import { Check, X, CheckCircle2, XCircle } from 'lucide-react';
import { SafeRichText } from '@/components/ui/rich-text/SafeRichText';
import { useDynamicTextSize } from '@/hooks/useDynamicTextSize';
import ZoomableImage from '@/components/common/ZoomableImage';
import ModernMultipleChoice from './ModernMultipleChoice';

interface ExpressiveCardBackProps {
  question: Question;
  regulationPreference: RegulationFilterType;
  onAnswer: (score: number) => void;
  isAnswered: boolean;
}

export default function ExpressiveCardBack({
  question,
  regulationPreference,
  onAnswer,
  isAnswered
}: ExpressiveCardBackProps) {
  const isMultipleChoice = question.question_type === "MC_single" || question.question_type === "MC_multi";
  const answerText = question?.answers?.[0]?.text || '';
  const textSizeClass = useDynamicTextSize(answerText, 'answer');

  const handleMCAnswer = (isCorrect: boolean) => {
    onAnswer(isCorrect ? 5 : 1);
  };

  if (isMultipleChoice) {
    return (
      <motion.div
        className="w-full h-full bg-gradient-to-br from-white via-purple-50/30 to-pink-50/50 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-sm overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="p-8 h-full flex flex-col">
          {/* Header */}
          <motion.div 
            className="flex items-center justify-between mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-medium">
              Wähle die richtige Antwort
            </div>
            <div className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-xs font-medium">
              {regulationPreference}
            </div>
          </motion.div>

          {/* Multiple choice content */}
          <div className="flex-1 overflow-hidden">
            <ModernMultipleChoice
              question={question}
              onAnswer={handleMCAnswer}
            />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="w-full h-full bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/50 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-sm overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Floating elements background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 left-10 w-16 h-16 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-xl"
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, 20, 0]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 p-8 h-full flex flex-col">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-sm font-medium">
            Antwort
          </div>
          <div className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full text-xs font-medium">
            {regulationPreference}
          </div>
        </motion.div>

        {/* Answer content */}
        <motion.div 
          className="flex-1 flex flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Answer text */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-200/50 mb-6 shadow-lg">
            <div className={`${textSizeClass} font-semibold text-emerald-800 leading-relaxed`}>
              <SafeRichText content={answerText} />
            </div>
          </div>

          {/* Image */}
          {question?.image_url && (
            <motion.div 
              className="flex-1 flex items-center justify-center mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <ZoomableImage
                src={question.image_url}
                alt="Signal"
                containerClassName="max-w-md max-h-48 rounded-2xl overflow-hidden shadow-lg"
                imageClassName="w-full h-full object-contain"
              />
            </motion.div>
          )}
        </motion.div>

        {/* Action buttons */}
        {!isAnswered && (
          <motion.div 
            className="flex gap-4 mt-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              className="flex-1 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl font-semibold text-lg shadow-xl relative overflow-hidden group"
              onClick={() => onAnswer(1)}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-center space-x-3">
                <X className="h-5 w-5" />
                <span>Nicht gewusst</span>
              </div>
            </motion.button>

            <motion.button
              className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-semibold text-lg shadow-xl relative overflow-hidden group"
              onClick={() => onAnswer(5)}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-center space-x-3">
                <Check className="h-5 w-5" />
                <span>Gewusst</span>
              </div>
            </motion.button>
          </motion.div>
        )}

        {/* Keyboard hints */}
        {!isAnswered && (
          <motion.div 
            className="text-center text-sm text-gray-500 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Tastatur: ← Nicht gewusst | → Gewusst
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
