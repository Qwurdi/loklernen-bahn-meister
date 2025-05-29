
import React, { useState } from 'react';
import { SafeRichText } from '@/components/ui/rich-text/SafeRichText';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ExpandableTextProps {
  content: string;
  textSizeClass: string;
  maxLines: number;
  className?: string;
}

export default function ExpandableText({
  content,
  textSizeClass,
  maxLines,
  className = ''
}: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const shouldShowExpand = content.length > 150; // Simple heuristic

  return (
    <div className={className}>
      <div 
        className={`${textSizeClass} font-medium text-gray-900 ${
          !isExpanded && shouldShowExpand ? `line-clamp-${maxLines}` : ''
        }`}
      >
        <SafeRichText content={content} />
      </div>
      
      {shouldShowExpand && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-sm text-blue-600 flex items-center gap-1"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-4 w-4" />
              Weniger anzeigen
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" />
              Mehr anzeigen
            </>
          )}
        </button>
      )}
    </div>
  );
}
