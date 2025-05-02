
import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface DemoMCQuestionProps {
  question?: string;
  answers?: string[];
  correctAnswer?: number;
  signalImage?: string;
}

export default function DemoMCQuestion({
  question = "Was bedeutet dieses Hauptsignal?",
  answers = [
    "Halt.",
    "Langsam fahren, Geschwindigkeitsbegrenzung beachten",
    "Fahrt frei mit der zulässigen Geschwindigkeit",
    "Signal außer Betrieb"
  ],
  correctAnswer = 0,
  signalImage = "/lovable-uploads/abbb1845-1d85-4158-aa4e-10a35a8da12d.png"
}: DemoMCQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const handleAnswerClick = (index: number) => {
    setSelectedAnswer(index);
    setShowFeedback(true);
  };
  
  return (
    <div className="w-full max-w-md mx-auto bg-black text-white p-6 rounded-lg shadow-lg border border-gray-800">
      <h3 className="text-xl font-bold mb-4">{question}</h3>
      
      <div className="mb-6 flex justify-center">
        <img 
          src={signalImage} 
          alt="Hauptsignal" 
          className="h-64 object-contain"
        />
      </div>
      
      <div className="space-y-3">
        {answers.map((answer, index) => (
          <motion.button
            key={index}
            whileHover={!showFeedback ? { scale: 1.01 } : {}}
            className={`w-full text-left p-3 rounded-md border transition-all ${
              selectedAnswer === null
                ? "border-gray-700 hover:border-loklernen-ultramarine"
                : selectedAnswer === index
                  ? index === correctAnswer
                    ? "border-green-600 bg-green-600/20"
                    : "border-red-600 bg-red-600/20"
                  : index === correctAnswer && showFeedback
                    ? "border-green-600"
                    : "border-gray-700 opacity-60"
            }`}
            onClick={() => !showFeedback && handleAnswerClick(index)}
            disabled={showFeedback}
          >
            <div className="flex items-center justify-between">
              <span>{answer}</span>
              {showFeedback && selectedAnswer === index && (
                index === correctAnswer ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <X className="h-5 w-5 text-red-500" />
                )
              )}
              {showFeedback && selectedAnswer !== index && index === correctAnswer && (
                <Check className="h-5 w-5 text-green-500" />
              )}
            </div>
          </motion.button>
        ))}
      </div>
      
      {showFeedback && (
        <div className="mt-4 p-3 rounded-md bg-gray-800">
          {selectedAnswer === correctAnswer ? (
            <p className="text-green-400">Korrekt! Das Hauptsignal zeigt "Halt".</p>
          ) : (
            <p className="text-red-400">Falsch. Die richtige Antwort ist: Halt.</p>
          )}
          
          <div className="mt-3 flex justify-between items-center">
            <p className="text-sm text-gray-400">Mit Anmeldung: Dein Fortschritt wird gespeichert</p>
            <Link to="/register">
              <Button size="sm" className="bg-loklernen-ultramarine hover:bg-loklernen-ultramarine/80 text-white">
                Jetzt anmelden
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
