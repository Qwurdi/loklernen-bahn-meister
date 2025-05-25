
import React, { useState } from 'react';
import { Question } from '@/types/questions';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, CheckCircle2, XCircle } from 'lucide-react';
import { SafeRichText } from '@/components/ui/rich-text/SafeRichText';

interface ModernMultipleChoiceProps {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
}

export default function ModernMultipleChoice({
  question,
  onAnswer
}: ModernMultipleChoiceProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isMultiSelect = question.question_type === "MC_multi";

  const handleAnswerSelect = (index: number) => {
    if (showResults) return;

    if (isMultiSelect) {
      setSelectedAnswers(prev => 
        prev.includes(index) 
          ? prev.filter(i => i !== index)
          : [...prev, index]
      );
    } else {
      setSelectedAnswers([index]);
      // Auto-submit for single choice after short delay
      setTimeout(() => {
        handleSubmit([index]);
      }, 500);
    }
  };

  const handleSubmit = (answers = selectedAnswers) => {
    if (isSubmitted) return;
    
    setIsSubmitted(true);
    setShowResults(true);

    const correctAnswers = question.answers
      .map((_, index) => index)
      .filter(index => question.answers[index].isCorrect);

    const isCorrect = isMultiSelect
      ? answers.length === correctAnswers.length && 
        answers.every(answer => correctAnswers.includes(answer))
      : correctAnswers.includes(answers[0]);

    setTimeout(() => {
      onAnswer(isCorrect);
    }, 2000);
  };

  const getAnswerStyle = (index: number, isCorrect: boolean) => {
    if (!showResults) {
      return selectedAnswers.includes(index)
        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-blue-500 scale-105"
        : "bg-white hover:bg-gray-50 text-gray-800 border-gray-200 hover:border-gray-300";
    }

    if (isCorrect) {
      return "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-500";
    }

    if (selectedAnswers.includes(index)) {
      return "bg-gradient-to-r from-red-500 to-pink-500 text-white border-red-500";
    }

    return "bg-gray-100 text-gray-500 border-gray-200";
  };

  const getIcon = (index: number, isCorrect: boolean) => {
    if (!showResults) {
      return selectedAnswers.includes(index) ? <CheckCircle2 className="h-5 w-5" /> : null;
    }

    if (isCorrect) {
      return <CheckCircle2 className="h-5 w-5" />;
    }

    if (selectedAnswers.includes(index)) {
      return <XCircle className="h-5 w-5" />;
    }

    return null;
  };

  return (
    <div className="space-y-4">
      {/* Question answers */}
      <AnimatePresence>
        {question.answers.map((answer, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1 }}
          >
            <motion.button
              className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-300 shadow-lg ${getAnswerStyle(index, answer.isCorrect)}`}
              onClick={() => handleAnswerSelect(index)}
              disabled={showResults}
              whileHover={!showResults ? { scale: 1.02, y: -2 } : {}}
              whileTap={!showResults ? { scale: 0.98 } : {}}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 pr-4">
                  <SafeRichText content={answer.text} />
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: getIcon(index, answer.isCorrect) ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {getIcon(index, answer.isCorrect)}
                </motion.div>
              </div>
            </motion.button>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Submit button for multi-select */}
      {isMultiSelect && !showResults && selectedAnswers.length > 0 && (
        <motion.button
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-semibold text-lg shadow-xl"
          onClick={() => handleSubmit()}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Antwort bestätigen
        </motion.button>
      )}

      {/* Results feedback */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            className="text-center py-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            {selectedAnswers.some(index => question.answers[index].isCorrect) ? (
              <motion.div
                className="text-emerald-600 font-semibold text-lg"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5 }}
              >
                ✅ Richtig!
              </motion.div>
            ) : (
              <motion.div
                className="text-red-600 font-semibold text-lg"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5 }}
              >
                ❌ Leider falsch
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
