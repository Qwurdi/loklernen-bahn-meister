
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import ProgressRing from '@/components/common/ProgressRing';

interface MobileSessionCompleteProps {
  correctCount: number;
  totalQuestions: number;
}

export default function MobileSessionComplete({
  correctCount,
  totalQuestions
}: MobileSessionCompleteProps) {
  const navigate = useNavigate();
  const percentage = Math.round((correctCount / totalQuestions) * 100);
  
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center p-6">
      <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-xs text-center">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <ProgressRing 
              progress={percentage} 
              size={120}
              strokeWidth={8}
              color="stroke-loklernen-ultramarine"
              showPercentage={true}
            />
            <CheckCircle className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 text-white" />
          </div>
        </div>
        
        <h2 className="text-xl font-bold text-white mb-1">Gut gemacht!</h2>
        <p className="text-gray-400 mb-6">Du hast alle Karten dieser Session bearbeitet.</p>
        
        <div className="flex flex-col gap-4 mt-4">
          <button 
            onClick={() => navigate('/karteikarten')}
            className="py-3 bg-loklernen-ultramarine text-white rounded-lg"
          >
            Zurück zur Übersicht
          </button>
          
          <button 
            onClick={() => window.location.reload()}
            className="py-3 bg-transparent border border-white/20 text-white rounded-lg"
          >
            Session wiederholen
          </button>
        </div>
      </div>
    </div>
  );
}
