
import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useUnifiedNavigation } from '@/hooks/navigation/useUnifiedNavigation';

interface UnifiedSessionHeaderProps {
  sessionTitle: string;
  isMobile?: boolean;
  showBackButton?: boolean;
}

export default function UnifiedSessionHeader({
  sessionTitle,
  isMobile = false,
  showBackButton = true
}: UnifiedSessionHeaderProps) {
  const { navigateToCategory, getCurrentParams } = useUnifiedNavigation();
  
  const params = getCurrentParams();
  
  const handleBack = () => {
    if (params.category) {
      navigateToCategory(params.category);
    } else {
      // Fallback to cards overview
      window.location.href = '/karteikarten';
    }
  };

  if (isMobile) {
    return (
      <div className="flex items-center gap-3 p-4 bg-white shadow-sm">
        {showBackButton && (
          <button
            onClick={handleBack}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        <h1 className="text-lg font-semibold text-gray-900 truncate">
          {sessionTitle}
        </h1>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 mb-6">
      {showBackButton && (
        <button
          onClick={handleBack}
          className="p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}
      <h1 className="text-2xl font-bold text-gray-900">
        {sessionTitle}
      </h1>
    </div>
  );
}
