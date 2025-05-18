
import React, { useState } from "react";
import { Lightbulb } from "lucide-react";
import { Answer } from "@/types/questions";
import { SafeRichText } from "@/components/ui/rich-text/SafeRichText";

interface HintButtonProps {
  hint?: string;
  question: string | any; // Could be rich text
  answers?: Answer[];
  minimal?: boolean;
}

export default function HintButton({ hint, question, answers, minimal = false }: HintButtonProps) {
  const [showHint, setShowHint] = useState(false);
  
  // Don't render if there's no hint
  if (!hint) return null;
  
  // Compute if we should display anything
  const hasHint = typeof hint === 'string' && hint.trim().length > 0;
  
  // Determine the appropriate hint
  let hintToShow = hint;
  
  // If there's no explicit hint but there is an answer with text, provide a small clue
  if ((!hasHint || hint?.trim() === '') && answers?.length > 0 && typeof answers[0].text === 'string') {
    const firstAnswer = answers[0].text;
    // Only create a hint for longer answers (at least 4 characters)
    if (firstAnswer.length >= 4) {
      // Show only the first character as a hint
      hintToShow = `Der Signalbegriff beginnt mit "${firstAnswer.charAt(0)}..."`;
    }
  }
  
  // In minimal mode, render a compact version
  if (minimal) {
    return (
      <div className="hint-container">
        <button
          type="button"
          onClick={() => setShowHint(!showHint)}
          className="text-xs flex items-center gap-1 text-gray-500 bg-gray-100 rounded-full px-2 py-1"
        >
          <Lightbulb className="h-3 w-3" />
          {showHint ? "Hinweis verbergen" : "Hinweis"}
        </button>
        
        {showHint && hintToShow && (
          <div className="mt-1 text-xs p-1.5 bg-blue-50 rounded border border-blue-100 text-blue-700">
            {hintToShow}
          </div>
        )}
      </div>
    );
  }
  
  // Default full size version
  return (
    <div className="hint-container">
      <button
        type="button"
        onClick={() => setShowHint(!showHint)}
        className="hint-button"
      >
        <Lightbulb className="h-4 w-4 mr-1" />
        {showHint ? "Hinweis verbergen" : "Hinweis anzeigen"}
      </button>
      
      {showHint && hintToShow && (
        <div className="hint-text hint-reveal">
          {typeof hintToShow === 'string' ? (
            hintToShow
          ) : (
            <SafeRichText content={hintToShow} />
          )}
        </div>
      )}
    </div>
  );
}
