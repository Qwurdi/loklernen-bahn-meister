
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ThumbsUp, ThumbsDown, Lightbulb, CheckCircle2, XCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useSpacedRepetition } from "@/hooks/useSpacedRepetition";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { QuestionCategory } from "@/types/questions";
import { signalSubCategories } from "@/api/questions";

// Helper to map URL subcategory param back to original subcategory string (case sensitive)
function mapUrlToSubcategory(urlSubcategory?: string): string | undefined {
  if (!urlSubcategory) return undefined;
  const normalizedParam = urlSubcategory.toLowerCase();

  const found = signalSubCategories.find((subcat) => 
    subcat.toLowerCase().replace(/[^a-z0-9]+/g, '-') === normalizedParam
  );
  return found;
}

export default function FlashcardPage() {
  const { subcategory: urlSubcategory } = useParams<{ subcategory: string }>();
  const subcategory = mapUrlToSubcategory(urlSubcategory); // map to original subcategory
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [answer, setAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [isPracticeMode] = useState(true);

  const {
    loading,
    dueQuestions: questions,
    submitAnswer
  } = useSpacedRepetition(
    "Signale" as QuestionCategory, 
    subcategory, 
    { practiceMode: isPracticeMode }
  );

  const currentQuestion = questions[currentIndex];

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const handleAnswer = async () => {
    if (!currentQuestion) return;

    const normalizedAnswer = answer.trim().toLowerCase();
    const normalizedCorrect = currentQuestion.answers[0].text.trim().toLowerCase();
    const isAnswerCorrect = normalizedAnswer === normalizedCorrect;
    
    setIsCorrect(isAnswerCorrect);
    setAnswered(true);

    if (user) {
      const score = isAnswerCorrect ? 5 : 0;
      await submitAnswer(currentQuestion.id, score);
    }

    if (isAnswerCorrect) {
      toast.success("Richtig! Weiter so!");
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(curr => curr + 1);
    } else {
      navigate('/signale');
      toast.success("Gut gemacht! Du hast alle fälligen Karten für heute geschafft!");
    }
    setFlipped(false);
    setAnswered(false);
    setAnswer("");
    setIsCorrect(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <div className="container px-4 py-8 md:px-6 md:py-12">
            <p className="text-center">Lade Karteikarten...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!loading && questions.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <div className="container px-4 py-8 md:px-6 md:py-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Keine Karten fällig</h2>
              <p className="mb-8">Du hast aktuell keine Karten zum Wiederholen. Schau später wieder vorbei!</p>
              <Link to="/signale">
                <Button>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Zurück zur Übersicht
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="container px-4 py-8 md:px-6 md:py-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Link to="/signale">
                <Button variant="ghost" size="sm">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Zurück zur Übersicht
                </Button>
              </Link>
              <h1 className="text-xl font-semibold">{subcategory}</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Übungsmodus
              </span>
              <div className="text-sm text-muted-foreground">
                Karte {currentIndex + 1}/{questions.length}
              </div>
            </div>
          </div>
          
          <div className="mx-auto max-w-2xl">
            <div 
              className={`relative h-[400px] w-full cursor-pointer rounded-xl border bg-card p-6 shadow-sm transition-all duration-500 ${
                flipped ? "rotate-y-180" : ""
              }`}
              onClick={handleFlip}
            >
              <div className={`absolute inset-0 backface-hidden p-6 ${flipped ? "invisible" : ""}`}>
                <div className="flex h-full flex-col">
                  <h2 className="text-lg font-medium">{currentQuestion?.text}</h2>
                  <div className="flex-1 flex items-center justify-center py-6">
                    {currentQuestion?.image_url && (
                      <img 
                        src={currentQuestion.image_url} 
                        alt="Signal" 
                        className="max-h-[200px]"
                      />
                    )}
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
                                  : `Die richtige Antwort ist: ${currentQuestion.answers[0].text}`
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
              
              <div className={`absolute inset-0 backface-hidden rotate-y-180 p-6 ${!flipped ? "invisible" : ""}`}>
                <div className="flex h-full flex-col">
                  <h2 className="text-lg font-medium">Lösung</h2>
                  <div className="flex flex-col flex-1 gap-4 pt-6">
                    <div className="flex items-center justify-center">
                      {currentQuestion?.image_url && (
                        <img 
                          src={currentQuestion.image_url} 
                          alt="Signal" 
                          className="max-h-[150px]"
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-lg">{currentQuestion?.answers[0].text}</p>
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
                  handleNext();
                }}>
                  <ThumbsDown className="h-5 w-5 mr-2" />
                  Schwierig
                </Button>
                <Button variant="ghost" className="text-green-500" onClick={(e) => {
                  e.stopPropagation();
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
