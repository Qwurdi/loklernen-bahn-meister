
import React, { useState } from 'react';
import { Question } from '@/types/questions';
import { motion } from 'framer-motion';
import { RegulationFilterType } from '@/types/regulation';
import { Lightbulb, Eye, Sparkles } from 'lucide-react';
import { SafeRichText } from '@/components/ui/rich-text/SafeRichText';
import { useDynamicTextSize } from '@/hooks/useDynamicTextSize';
import ZoomableImage from '@/components/common/ZoomableImage';
import HintButton from '@/components/flashcards/HintButton';

interface ExpressiveCardFrontProps {
  question: Question;
  regulationPreference: RegulationFilterType;
  onShowAnswer: () => void;
}

export default function ExpressiveCardFront({
  question,
  regulationPreference,
  onShowAnswer
}: ExpressiveCardFrontProps) {
  const [isHovered, setIsHovered] = useState(false);
  const textSizeClass = useDynamicTextSize(question.text, 'question');
  const isMultipleChoice = question.question_type === "MC_single" || question.question_type === "MC_multi";

  return (
    <motion.div
      className="w-full h-full bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-sm overflow-hidden"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Floating elements background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 right-10 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-xl"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-10 left-10 w-16 h-16 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative z-10 p-8 h-full flex flex-col">
        {/* Header with category and regulation */}
        <motion.div 
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center space-x-3">
            <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full text-sm font-medium shadow-lg">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-3 w-3" />
                <span>{question.sub_category}</span>
              </div>
            </div>
            {isMultipleChoice && (
              <div className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-xs font-medium">
                {question.question_type === "MC_single" ? "Single Choice" : "Multiple Choice"}
              </div>
            )}
          </div>
          <div className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-xs font-medium">
            {regulationPreference}
          </div>
        </motion.div>

        {/* Question text */}
        <motion.div 
          className={`${textSizeClass} font-medium text-gray-800 mb-6 leading-relaxed`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <SafeRichText content={question.text} />
        </motion.div>

        {/* Image section */}
        {question.image_url && (
          <motion.div 
            className="flex-1 flex items-center justify-center mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="relative">
              <ZoomableImage
                src={question.image_url}
                alt="Signal"
                containerClassName="max-w-md max-h-64 rounded-2xl overflow-hidden shadow-lg"
                imageClassName="w-full h-full object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none rounded-2xl" />
            </div>
          </motion.div>
        )}

        {/* Hint section */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <HintButton 
            hint={question.hint}
            question={question.text}
            answers={question.answers}
          />
        </motion.div>

        {/* Action button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl font-semibold text-lg shadow-xl relative overflow-hidden group"
            onClick={onShowAnswer}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600"
              initial={{ x: '-100%' }}
              animate={isHovered ? { x: '0%' } : { x: '-100%' }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
            
            <div className="relative z-10 flex items-center justify-center space-x-3">
              <motion.div
                animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 0.6 }}
              >
                {isMultipleChoice ? <Eye className="h-5 w-5" /> : <Lightbulb className="h-5 w-5" />}
              </motion.div>
              <span>{isMultipleChoice ? "Optionen anzeigen" : "Signal anzeigen"}</span>
            </div>
          </motion.button>

          {/* Keyboard hint */}
          <motion.p 
            className="text-center text-sm text-gray-500 mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Drücke die Leertaste oder klicke den Button
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
}
