import CardStack from "@/components/flashcards/stack/CardStack";
import { Question } from "@/types/questions";

// Define a generic type parameter T that extends Question
interface CardStackSessionProps<T extends Question = Question> {
  sessionCards: T[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  onAnswer: (questionId: string, score: number) => Promise<void>;
  onComplete: () => void;
  isMobile: boolean;
}

// Use the generic type parameter in the component definition
export default function CardStackSession<T extends Question = Question>({
  sessionCards,
  currentIndex,
  setCurrentIndex,
  onAnswer,
  onComplete,
  isMobile
}: CardStackSessionProps<T>) {
  // The mobile fullscreen handling is now done in the useMobileFullscreen hook
  // and managed by the parent component, so we don't need to do it here anymore
  
  return (
    <div className="h-full w-full flex-1 flex flex-col">
      <CardStack 
        questions={sessionCards}
        onAnswer={onAnswer}
        onComplete={onComplete}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
    </div>
  );
}
