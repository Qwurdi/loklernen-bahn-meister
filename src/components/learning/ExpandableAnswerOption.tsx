
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Check, X } from 'lucide-react';
import { SafeRichText } from '@/components/ui/rich-text/SafeRichText';

interface ExpandableAnswerOptionProps {
  content: string;
  isSelected: boolean;
  isCorrect?: boolean;
  isSubmitted: boolean;
  onClick: () => void;
  showRadio?: boolean;
  maxLines?: number;
}

export default function ExpandableAnswerOption({
  content,
  isSelected,
  isCorrect,
  isSubmitted,
  onClick,
  showRadio = true,
  maxLines = 2
}: ExpandableAnswerOptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldTruncate, setShouldTruncate] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      const lineHeight = parseInt(getComputedStyle(textRef.current).lineHeight);
      const maxHeight = lineHeight * maxLines;
      setShouldTruncate(textRef.current.scrollHeight > maxHeight);
    }
  }, [content, maxLines]);

  const handleExpandToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
    
    if (navigator.vibrate) {
      navigator.vibrate(5);
    }
  };

  const handleOptionClick = () => {
    if (isSubmitted) return;
    onClick();
  };

  const getOptionStyles = () => {
    if (isSubmitted && isCorrect) {
      return 'border-green-300 bg-green-50';
    }
    if (isSubmitted && isSelected && !isCorrect) {
      return 'border-red-300 bg-red-50';
    }
    if (isSelected) {
      return 'border-blue-300 bg-blue-50';
    }
    return 'border-gray-200 bg-white hover:bg-gray-50';
  };

  return (
    <div className={`mb-3 rounded-lg border transition-all duration-200 ${getOptionStyles()}`}>
      <button 
        className="w-full p-3 text-left flex items-start gap-3"
        onClick={handleOptionClick}
        disabled={isSubmitted}
      >
        {/* Radio/checkbox indicator */}
        {showRadio && (
          <div className={`mt-0.5 w-5 h-5 rounded-full flex-shrink-0 border ${
            isSelected 
              ? 'bg-blue-500 border-blue-500' 
              : 'border-gray-300'
          } flex items-center justify-center`}>
            {isSelected && (
              <div className="w-2 h-2 rounded-full bg-white" />
            )}
          </div>
        )}
        
        {/* Answer text */}
        <div className="flex-1 min-w-0">
          <div
            ref={textRef}
            className={`text-sm transition-all duration-300 ${
              !isExpanded && shouldTruncate ? 'line-clamp-2' : ''
            }`}
            style={{
              WebkitLineClamp: !isExpanded && shouldTruncate ? maxLines : 'unset',
              display: !isExpanded && shouldTruncate ? '-webkit-box' : 'block',
              WebkitBoxOrient: 'vertical',
              overflow: !isExpanded && shouldTruncate ? 'hidden' : 'visible'
            }}
          >
            <SafeRichText content={content} />
          </div>
          
          {/* Expand/collapse button */}
          {shouldTruncate && (
            <button
              onClick={handleExpandToggle}
              className="mt-2 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 transition-colors"
            >
              {isExpanded ? (
                <>
                  <span>Weniger</span>
                  <ChevronUp className="h-3 w-3" />
                </>
              ) : (
                <>
                  <span>Mehr</span>
                  <ChevronDown className="h-3 w-3" />
                </>
              )}
            </button>
          )}
        </div>
        
        {/* Feedback icons */}
        <div className="flex-shrink-0 mt-0.5">
          {isSubmitted && isCorrect && (
            <Check className="h-5 w-5 text-green-500" />
          )}
          {isSubmitted && isSelected && !isCorrect && (
            <X className="h-5 w-5 text-red-500" />
          )}
        </div>
      </button>
    </div>
  );
}
