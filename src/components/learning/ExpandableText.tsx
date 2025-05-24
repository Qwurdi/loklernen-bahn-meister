
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { SafeRichText } from '@/components/ui/rich-text/SafeRichText';

interface ExpandableTextProps {
  content: string;
  maxLines?: number;
  className?: string;
  textSizeClass?: string;
}

export default function ExpandableText({ 
  content, 
  maxLines = 3,
  className = '',
  textSizeClass = 'text-base'
}: ExpandableTextProps) {
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

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  return (
    <div className={className}>
      <div
        ref={textRef}
        className={`${textSizeClass} text-gray-900 transition-all duration-300 ${
          !isExpanded && shouldTruncate ? 'line-clamp-3' : ''
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
      
      {shouldTruncate && (
        <button
          onClick={handleToggle}
          className="mt-2 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
        >
          {isExpanded ? (
            <>
              <span>Weniger anzeigen</span>
              <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              <span>Mehr anzeigen</span>
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </button>
      )}
    </div>
  );
}
