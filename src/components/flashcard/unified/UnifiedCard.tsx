
import React from 'react';
import { CardConfig, CardEventHandlers } from '@/types/flashcard';
import { useUnifiedCardState } from '@/hooks/flashcard/useUnifiedCardState';
import { useUnifiedInteractions } from '@/hooks/flashcard/useUnifiedInteractions';
import { UnifiedCardFront } from './UnifiedCardFront';
import { UnifiedCardBack } from './UnifiedCardBack';
import { cn } from '@/lib/utils';

interface UnifiedCardProps {
  config: CardConfig;
  handlers: CardEventHandlers;
  className?: string;
}

export function UnifiedCard({ config, handlers, className }: UnifiedCardProps) {
  const { state, actions, computed } = useUnifiedCardState({
    question: config.question,
    autoReset: true
  });

  const interactions = useUnifiedInteractions({
    mode: config.interactionMode,
    enabled: true,
    canFlip: computed.canFlip,
    canAnswer: computed.canAnswer,
    onFlip: () => {
      actions.flip();
      handlers.onFlip();
    },
    onAnswer: (score) => {
      actions.answer(score);
      handlers.onAnswer(score);
    },
    onNext: handlers.onNext
  });

  return (
    <div className={cn("relative w-full max-w-md mx-auto", className)}>
      <div 
        className={cn(
          "material-card card-flip perspective-1000 min-h-[400px] relative cursor-pointer",
          state.isFlipped && "flipped",
          state.isAnimating && "pointer-events-none"
        )}
        onClick={() => {
          if (interactions.tapEnabled && computed.canFlip) {
            actions.flip();
            handlers.onFlip();
          }
        }}
        data-testid="unified-card"
      >
        {/* Front Side - Question */}
        <div className="card-face">
          <UnifiedCardFront
            question={config.question}
            showHints={config.showHints}
            regulationPreference={config.regulationPreference}
          />
        </div>

        {/* Back Side - Answer */}
        <div className="card-face card-back">
          <UnifiedCardBack
            question={config.question}
            isAnswered={state.isAnswered}
            canAnswer={computed.canAnswer}
            showButtons={interactions.buttonsEnabled}
            onAnswer={(score) => {
              actions.answer(score);
              handlers.onAnswer(score);
            }}
          />
        </div>
      </div>

      {/* Keyboard Instructions */}
      {interactions.keyboardEnabled && (
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>Leertaste: Umdrehen • ← Falsch • → Richtig</p>
        </div>
      )}
    </div>
  );
}
