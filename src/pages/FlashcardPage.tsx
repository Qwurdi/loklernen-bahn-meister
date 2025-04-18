
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ThumbsUp, ThumbsDown, Lightbulb, CheckCircle2, XCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// This is a demo page for the Hauptsignal H0
export default function FlashcardPage() {
  const [flipped, setFlipped] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [answer, setAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  
  const navigate = useNavigate();
  
  const question = {
    id: "h0",
    type: "open",
    text: "Wie lautet die Bezeichnung des folgenden Signals und was bedeutet es?",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Hauptsignal_Hp0.svg/170px-Hauptsignal_Hp0.svg.png",
    correctAnswer: "Hp 0",
    explanation: "Das Signal Hp 0 (Halt) zeigt zwei rote Lichter nebeneinander. Es bedeutet, dass der Zug vor dem Signal anhalten muss."
  };
  
  const handleAnswer = () => {
    const normalizedAnswer = answer.trim().toLowerCase();
    const normalizedCorrect = question.correctAnswer.trim().toLowerCase();
    
    const isAnswerCorrect = normalizedAnswer === normalizedCorrect;
    setIsCorrect(isAnswerCorrect);
    setAnswered(true);
    
    if (isAnswerCorrect) {
      // In a real app, we would update the user's progress and potentially show a success toast
      console.log("Correct answer!");
    }
  };
  
  const handleNext = () => {
    // In a real app, this would go to the next card in the deck
    // For demo purposes, we'll just reset the current card
    setFlipped(false);
    setAnswered(false);
    setAnswer("");
    setIsCorrect(false);
  };
  
  const handleFlip = () => {
    if (!answered) {
      setFlipped(!flipped);
    }
  };
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="container px-4 py-8 md:px-6 md:py-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Link to="/signale/haupt-vorsignale">
                <Button variant="ghost" size="sm">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Zurück zum Deck
                </Button>
              </Link>
              <h1 className="text-xl font-semibold">Haupt- und Vorsignale</h1>
            </div>
            <div className="text-sm text-muted-foreground">
              Karte 1/12
            </div>
          </div>
          
          <div className="mx-auto max-w-2xl">
            <div 
              className={`relative h-[400px] w-full cursor-pointer rounded-xl border bg-card p-6 shadow-sm transition-all duration-500 ${
                flipped ? "rotate-y-180" : ""
              }`}
              onClick={handleFlip}
            >
              {/* Front side */}
              <div className={`absolute inset-0 backface-hidden p-6 ${flipped ? "invisible" : ""}`}>
                <div className="flex h-full flex-col">
                  <h2 className="text-lg font-medium">{question.text}</h2>
                  <div className="flex-1 flex items-center justify-center py-6">
                    <img 
                      src={question.imageUrl} 
                      alt="Signal" 
                      className="max-h-[200px]"
                    />
                  </div>
                  <div className="pt-4">
                    {!answered ? (
                      <div className="space-y-2">
                        <input 
                          type="text" 
                          className="w-full rounded-md border px-3 py-2"
                          placeholder="Deine Antwort..."
                          value={answer}
                          onChange={(e) => setAnswer(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && answer.trim()) {
                              handleAnswer();
                            }
                          }}
                        />
                        <div className="flex justify-between">
                          <Button 
                            variant="outline" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setFlipped(true);
                            }}
                          >
                            <Lightbulb className="h-4 w-4 mr-2" />
                            Lösung anzeigen
                          </Button>
                          <Button 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (answer.trim()) {
                                handleAnswer();
                              }
                            }}
                            disabled={!answer.trim()}
                          >
                            Antwort prüfen
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className={`rounded-md p-4 ${
                          isCorrect ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                        }`}>
                          <div className="flex items-center gap-2">
                            {isCorrect ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : (
                              <XCircle className="h-5 w-5" />
                            )}
                            <div>
                              <p className="font-medium">
                                {isCorrect ? "Richtig!" : "Leider falsch."}
                              </p>
                              <p className="text-sm">
                                {isCorrect 
                                  ? "Du kennst dich aus!"
                                  : `Die richtige Antwort ist: ${question.correctAnswer}`
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFlipped(true);
                            }}
                          >
                            Details ansehen
                          </Button>
                          <Button 
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNext();
                            }}
                          >
                            Weiter
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Back side */}
              <div className={`absolute inset-0 backface-hidden rotate-y-180 p-6 ${!flipped ? "invisible" : ""}`}>
                <div className="flex h-full flex-col">
                  <h2 className="text-lg font-medium">Lösung</h2>
                  <div className="flex flex-col flex-1 gap-4 pt-6">
                    <div className="flex items-center justify-center">
                      <img 
                        src={question.imageUrl} 
                        alt="Signal" 
                        className="max-h-[150px]"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-lg">{question.correctAnswer}</p>
                      <p className="text-muted-foreground mt-2">{question.explanation}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <div className="flex gap-4">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFlipped(false);
                        }}
                      >
                        Zurück zur Frage
                      </Button>
                      <Button 
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNext();
                        }}
                      >
                        Weiter
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {!answered && !flipped && (
              <div className="mt-6 flex justify-between">
                <Button variant="ghost" className="text-red-500" onClick={(e) => {
                  e.stopPropagation();
                  // In a real app, this would mark the card as difficult
                  handleNext();
                }}>
                  <ThumbsDown className="h-5 w-5 mr-2" />
                  Schwierig
                </Button>
                <Button variant="ghost" className="text-green-500" onClick={(e) => {
                  e.stopPropagation();
                  // In a real app, this would mark the card as easy
                  handleNext();
                }}>
                  <ThumbsUp className="h-5 w-5 mr-2" />
                  Leicht
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
