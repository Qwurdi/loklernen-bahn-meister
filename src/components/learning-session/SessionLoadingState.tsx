
import React from 'react';
import FlashcardLoadingState from "@/components/flashcards/FlashcardLoadingState";

interface SessionLoadingStateProps {
  message?: string;
}

const SessionLoadingState: React.FC<SessionLoadingStateProps> = ({ message }) => {
  return <FlashcardLoadingState />;
};

export default SessionLoadingState;
