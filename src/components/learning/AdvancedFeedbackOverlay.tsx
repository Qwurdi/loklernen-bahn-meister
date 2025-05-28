
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Target, Clock, Award, Zap } from 'lucide-react';

interface FeedbackData {
  score: number;
  responseTime: number;
  streak: number;
  confidence: number;
  trend: 'improving' | 'declining' | 'stable';
  category: string;
}

interface AdvancedFeedbackOverlayProps {
  show: boolean;
  feedback: FeedbackData;
  onComplete: () => void;
}

export default function AdvancedFeedbackOverlay({
  show,
  feedback,
  onComplete
}: AdvancedFeedbackOverlayProps) {
  const [stage, setStage] = useState<'score' | 'details' | 'complete'>('score');

  useEffect(() => {
    if (!show) {
      setStage('score');
      return;
    }

    const timer1 = setTimeout(() => setStage('details'), 800);
    const timer2 = setTimeout(() => setStage('complete'), 2000);
    const timer3 = setTimeout(() => onComplete(), 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [show, onComplete]);

  const isCorrect = feedback.score >= 4;
  const responseTimeGrade = feedback.responseTime < 3000 ? 'schnell' : 
                           feedback.responseTime < 8000 ? 'normal' : 'langsam';

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl p-8 mx-4 max-w-sm w-full shadow-2xl"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            {/* Score Stage */}
            <AnimatePresence>
              {stage === 'score' && (
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold ${
                      isCorrect ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', damping: 10 }}
                  >
                    {isCorrect ? '✓' : '✗'}
                  </motion.div>
                  <motion.h3
                    className={`text-2xl font-bold ${
                      isCorrect ? 'text-green-700' : 'text-red-700'
                    }`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {isCorrect ? 'Richtig!' : 'Nicht richtig'}
                  </motion.h3>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Details Stage */}
            <AnimatePresence>
              {stage === 'details' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <div className="text-center mb-6">
                    <h3 className={`text-xl font-bold ${
                      isCorrect ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {isCorrect ? 'Gut gemacht!' : 'Weiter üben!'}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Response Time */}
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <Clock className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                      <div className="text-xs text-blue-600 font-medium">Zeit</div>
                      <div className="text-sm font-bold text-blue-800">{responseTimeGrade}</div>
                    </div>

                    {/* Streak */}
                    <div className="bg-orange-50 rounded-lg p-3 text-center">
                      <Zap className="h-5 w-5 mx-auto mb-1 text-orange-600" />
                      <div className="text-xs text-orange-600 font-medium">Serie</div>
                      <div className="text-sm font-bold text-orange-800">{feedback.streak}</div>
                    </div>

                    {/* Confidence */}
                    <div className="bg-purple-50 rounded-lg p-3 text-center">
                      <Target className="h-5 w-5 mx-auto mb-1 text-purple-600" />
                      <div className="text-xs text-purple-600 font-medium">Sicherheit</div>
                      <div className="text-sm font-bold text-purple-800">
                        {Math.round(feedback.confidence)}%
                      </div>
                    </div>

                    {/* Trend */}
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      {feedback.trend === 'improving' ? (
                        <TrendingUp className="h-5 w-5 mx-auto mb-1 text-green-600" />
                      ) : feedback.trend === 'declining' ? (
                        <TrendingDown className="h-5 w-5 mx-auto mb-1 text-red-600" />
                      ) : (
                        <Award className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                      )}
                      <div className="text-xs text-green-600 font-medium">Trend</div>
                      <div className="text-sm font-bold text-green-800">
                        {feedback.trend === 'improving' ? '↗️' : 
                         feedback.trend === 'declining' ? '↘️' : '→'}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
