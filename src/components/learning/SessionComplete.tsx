
import React from 'react';
import { CheckCircle, RotateCcw, Home } from 'lucide-react';

interface SessionCompleteProps {
  correctCount: number;
  totalQuestions: number;
  onRestart: () => void;
  onHome: () => void;
}

export default function SessionComplete({ correctCount, totalQuestions, onRestart, onHome }: SessionCompleteProps) {
  const percentage = Math.round((correctCount / totalQuestions) * 100);
  
  const getPerformanceMessage = () => {
    if (percentage >= 90) return { text: "Ausgezeichnet! 🎉", color: "text-green-600" };
    if (percentage >= 70) return { text: "Gut gemacht! 👍", color: "text-blue-600" };
    if (percentage >= 50) return { text: "Weiter so! 💪", color: "text-yellow-600" };
    return { text: "Übung macht den Meister! 📚", color: "text-red-600" };
  };

  const performance = getPerformanceMessage();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Lerneinheit abgeschlossen!
        </h2>
        
        {/* Performance Message */}
        <p className={`text-lg font-medium mb-6 ${performance.color}`}>
          {performance.text}
        </p>
        
        {/* Stats */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-bold text-gray-900">{correctCount}</div>
              <div className="text-sm text-gray-600">Richtige Antworten</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{percentage}%</div>
              <div className="text-sm text-gray-600">Erfolgsrate</div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onRestart}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <RotateCcw className="h-5 w-5" />
            Neue Lerneinheit starten
          </button>
          
          <button
            onClick={onHome}
            className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
          >
            <Home className="h-5 w-5" />
            Zurück zur Übersicht
          </button>
        </div>
      </div>
    </div>
  );
}
