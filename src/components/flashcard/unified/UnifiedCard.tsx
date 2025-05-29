
import React from 'react';
import { Card } from '@/components/ui/card';
import { CardConfig, CardEventHandlers, DEFAULT_CARD_CONFIG } from '@/types/flashcard';
import { useUnifiedCardState } from '@/hooks/flashcard/useUnifiedCardState';
import { useUnifiedInteractions } from '@/hooks/flashcard/useUnifiedInteractions';
import { useIsMobile } from '@/hooks/use-mobile';
import UnifiedCardFront from './UnifiedCardFront';
import UnifiedCardBack from './UnifiedCardBack';

interface UnifiedCardProps {
  config: CardConfig;
  handlers: CardEventHandlers;
  className?: string;
}

export default function UnifiedCard({
  config,
  handlers,
  className = ''
}: UnifiedCardProps) {
  const isMobile = useIsMobile();
  const mergedConfig = { ...DEFAULT_CARD_CONFIG, ...config };

  const { state, actions, computed } = useUnifiedCardState({
    question: config.question,
    autoReset: true
  });

  const interactions = useUnifiedInteractions({
    mode: mergedConfig.interactionMode!,
    enabled: true,
    canFlip: computed.canFlip && !state.isFlipped,
    canAnswer: computed.canAnswer,
    onFlip: () => {
      actions.flip();
      handlers.onFlip();
    },
    onAnswer: (score: number) => {
      actions.answer(score);
      handlers.onAnswer(score);
    },
    onNext: handlers.onNext
  });

  const handleCardClick = () => {
    if (interactions.tapEnabled && !state.isFlipped && computed.canFlip) {
      actions.flip();
      handlers.onFlip();
    }
  };

  const cardClasses = `
    relative transition-all duration-300 ease-out
    ${isMobile ? 'w-full h-full min-h-[500px]' : 'max-w-md mx-auto min-h-[500px]'}
    ${state.isAnimating ? 'pointer-events-none' : ''}
    ${className}
  `.trim();

  return (
    <Card 
      className={cardClasses}
      onClick={handleCardClick}
    >
      <div className="p-4 h-full flex flex-col">
        {!state.isFlipped ? (
          <UnifiedCardFront
            question={config.question}
            regulationPreference={config.regulationPreference}
            showHints={mergedConfig.showHints!}
            onShowAnswer={() => {
              actions.flip();
              handlers.onFlip();
            }}
          />
        ) : (
          <UnifiedCardBack
            question={config.question}
            regulationPreference={config.regulationPreference}
            isAnswered={state.isAnswered}
            isMultipleChoice={computed.isMultipleChoice}
            onAnswer={(score: number) => {
              actions.answer(score);
              handlers.onAnswer(score);
            }}
          />
        )}
      </div>
      
      {/* Keyboard hints for desktop */}
      {interactions.keyboardEnabled && (
        <div className="absolute bottom-2 right-2 text-xs text-gray-400 bg-white/80 rounded px-2 py-1">
          {!state.isFlipped ? 'Leertaste: Antwort' : '← Nein | → Ja'}
        </div>
      )}
    </Card>
  );
}
