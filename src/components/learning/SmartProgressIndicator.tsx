
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Target, Clock, Zap } from 'lucide-react';

interface ProgressMetrics {
  currentIndex: number;
  totalQuestions: number;
  correctCount: number;
  currentStreak: number;
  averageResponseTime: number;
  confidenceLevel: number;
  trend: 'improving' | 'declining' | 'stable';
}

interface SmartProgressIndicatorProps {
  metrics: ProgressMetrics;
  className?: string;
}

export default function SmartProgressIndicator({
  metrics,
  className = ''
}: SmartProgressIndicatorProps) {
  const progress = ((metrics.currentIndex + 1) / metrics.totalQuestions) * 100;
  const accuracy = metrics.totalQuestions > 0 ? (metrics.correctCount / (metrics.currentIndex + 1)) * 100 : 0;

  return (
    <div className={`bg-white/90 backdrop-blur-lg rounded-2xl p-4 shadow-lg border border-white/20 ${className}`}>
      {/* Main Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Fortschritt
          </span>
          <span className="text-sm text-gray-600">
            {metrics.currentIndex + 1} / {metrics.totalQuestions}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        {/* Accuracy */}
        <div className="flex items-center space-x-2">
          <Target className="h-4 w-4 text-green-600" />
          <div>
            <div className="font-medium text-gray-700">Genauigkeit</div>
            <div className="text-green-600 font-bold">{Math.round(accuracy)}%</div>
          </div>
        </div>

        {/* Current Streak */}
        <div className="flex items-center space-x-2">
          <Zap className="h-4 w-4 text-orange-600" />
          <div>
            <div className="font-medium text-gray-700">Serie</div>
            <div className="text-orange-600 font-bold">{metrics.currentStreak}</div>
          </div>
        </div>

        {/* Average Response Time */}
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-blue-600" />
          <div>
            <div className="font-medium text-gray-700">Ø Zeit</div>
            <div className="text-blue-600 font-bold">
              {Math.round(metrics.averageResponseTime / 1000)}s
            </div>
          </div>
        </div>

        {/* Trend */}
        <div className="flex items-center space-x-2">
          {metrics.trend === 'improving' ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
          ) : metrics.trend === 'declining' ? (
            <TrendingDown className="h-4 w-4 text-red-600" />
          ) : (
            <Target className="h-4 w-4 text-gray-600" />
          )}
          <div>
            <div className="font-medium text-gray-700">Trend</div>
            <div className={`font-bold ${
              metrics.trend === 'improving' ? 'text-green-600' : 
              metrics.trend === 'declining' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {metrics.trend === 'improving' ? '↗️' : 
               metrics.trend === 'declining' ? '↘️' : '→'}
            </div>
          </div>
        </div>
      </div>

      {/* Confidence Bar */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-gray-600">Sicherheit</span>
          <span className="text-xs text-gray-500">{Math.round(metrics.confidenceLevel)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className={`h-full rounded-full ${
              metrics.confidenceLevel >= 80 ? 'bg-green-500' :
              metrics.confidenceLevel >= 60 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${metrics.confidenceLevel}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
}
