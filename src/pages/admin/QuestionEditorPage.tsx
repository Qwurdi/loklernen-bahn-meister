import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { useQuestions } from "@/hooks/useQuestions";
import { supabase } from "@/integrations/supabase/client";
import { createQuestion, uploadQuestionImage } from "@/api/questions";
import { useAuth } from "@/contexts/AuthContext";
import { Question, QuestionCategory, QuestionType, Answer, CreateQuestionDTO } from "@/types/questions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Save, Image, Plus, X, ArrowLeft, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { signalSubCategories } from "@/api/questions";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Json } from "@/integrations/supabase/types";

const QuestionEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: questions } = useQuestions();
  
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const presetCategory = location.state?.presetCategory;
  const presetText = location.state?.presetText;
  const presetType = location.state?.presetType;
  
  const [formData, setFormData] = useState<Partial<CreateQuestionDTO>>({
    category: presetCategory || "Signale" as QuestionCategory,
    sub_category: signalSubCategories[0],
    question_type: presetType || "open" as QuestionType,
    difficulty: 1,
    text: presetText || "",
    image_url: null,
    answers: [{ text: "", isCorrect: true }],
    created_by: user?.id || ""
  });
  
  const isSignalQuestion = formData.category === "Signale";

  useEffect(() => {
    if (isEditMode && id && questions) {
      const questionToEdit = questions.find(q => q.id === id);
      if (questionToEdit) {
        setFormData({
          category: questionToEdit.category,
          sub_category: questionToEdit.sub_category,
          question_type: questionToEdit.question_type,
          difficulty: questionToEdit.difficulty,
          text: questionToEdit.text,
          image_url: questionToEdit.image_url,
          answers: questionToEdit.answers || [{ text: "", isCorrect: true }],
          created_by: questionToEdit.created_by
        });
        
        if (questionToEdit.image_url) {
          setImagePreview(questionToEdit.image_url);
        }
      }
    }
  }, [isEditMode, id, questions]);
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDifficultyChange = (newDifficulty: number) => {
    setFormData(prev => ({ ...prev, difficulty: newDifficulty }));
  };
  
  const handleCategoryChange = (category: QuestionCategory) => {
    setFormData(prev => ({ 
      ...prev, 
      category,
      sub_category: category === "Signale" ? signalSubCategories[0] : "Grundlagen"
    }));
  };
  
  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...(formData.answers || [])];
    newAnswers[index] = { ...newAnswers[index], text: value };
    setFormData(prev => ({ ...prev, answers: newAnswers }));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData(prev => ({ ...prev, image_url: null }));
  };
  
  const addAnswer = () => {
    const newAnswers = [...(formData.answers || []), { text: "", isCorrect: false }];
    setFormData(prev => ({ ...prev, answers: newAnswers }));
  };
  
  const removeAnswer = (index: number) => {
    const newAnswers = (formData.answers || []).filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, answers: newAnswers }));
  };
  
  const toggleAnswerCorrectness = (index: number) => {
    const newAnswers = [...(formData.answers || [])];
    
    if (formData.question_type === "MC_single") {
      newAnswers.forEach(answer => answer.isCorrect = false);
    }
    
    newAnswers[index] = { 
      ...newAnswers[index], 
      isCorrect: !newAnswers[index].isCorrect 
    };
    
    setFormData(prev => ({ ...prev, answers: newAnswers }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Sie müssen angemeldet sein, um Fragen zu erstellen.");
      return;
    }
    
    try {
      setIsLoading(true);
      
      if (!formData.text) {
        toast.error("Bitte geben Sie einen Fragetext ein.");
        setIsLoading(false);
        return;
      }
      
      if (!formData.answers || formData.answers.length === 0 || 
          !formData.answers.some(a => a.text)) {
        toast.error("Bitte geben Sie mindestens eine Antwort ein.");
        setIsLoading(false);
        return;
      }
      
      let finalImageUrl = formData.image_url;
      if (imageFile) {
        finalImageUrl = await uploadQuestionImage(imageFile, user.id);
      }
      
      const questionData: CreateQuestionDTO = {
        category: formData.category as QuestionCategory,
        sub_category: formData.sub_category || "",
        question_type: formData.question_type as QuestionType,
        difficulty: formData.difficulty || 1,
        text: formData.text || "",
        image_url: finalImageUrl,
        answers: formData.answers as Answer[],
        created_by: user.id
      };
      
      if (isEditMode && id) {
        const supabaseAnswers: Json = questionData.answers.map(answer => ({
          text: answer.text,
          isCorrect: answer.isCorrect
        }));
        
        const { error } = await supabase
          .from('questions')
          .update({
            category: questionData.category,
            sub_category: questionData.sub_category,
            question_type: questionData.question_type,
            difficulty: questionData.difficulty,
            text: questionData.text,
            image_url: questionData.image_url,
            answers: supabaseAnswers,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);
        
        if (error) throw error;
        toast.success("Frage erfolgreich aktualisiert!");
      } else {
        await createQuestion(questionData);
        toast.success("Frage erfolgreich erstellt!");
      }
      
      navigate("/admin/questions");
    } catch (error) {
      console.error("Error saving question:", error);
      toast.error("Fehler beim Speichern der Frage. Bitte versuchen Sie es später noch einmal.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/admin">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/admin/questions">Fragen</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{isEditMode ? "Frage bearbeiten" : "Neue Frage"}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/admin/questions">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">{isEditMode ? "Frage bearbeiten" : "Neue Frage erstellen"}</h1>
        </div>
        <Button 
          variant="default" 
          onClick={handleSubmit}
          disabled={isLoading}
        >
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? "Speichern..." : "Speichern"}
        </Button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="category">Kategorie</Label>
              <div className="flex gap-2">
                <Button 
                  type="button"
                  variant={formData.category === "Signale" ? "default" : "outline"}
                  onClick={() => handleCategoryChange("Signale")}
                  className="flex-1"
                >
                  Signale
                </Button>
                <Button 
                  type="button"
                  variant={formData.category === "Betriebsdienst" ? "default" : "outline"}
                  onClick={() => handleCategoryChange("Betriebsdienst")}
                  className="flex-1"
                >
                  Betriebsdienst
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sub_category">Unterkategorie</Label>
              <select
                id="sub_category"
                name="sub_category"
                value={formData.sub_category}
                onChange={handleInputChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {formData.category === "Signale" ? (
                  signalSubCategories.map((subCategory) => (
                    <option key={subCategory} value={subCategory}>
                      {subCategory}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Grundlagen">Grundlagen Bahnbetrieb</option>
                    <option value="UVV">UVV & Arbeitsschutz</option>
                    <option value="Rangieren">Rangieren</option>
                    <option value="Züge fahren">Züge fahren</option>
                    <option value="PZB">PZB & Sicherungsanlagen</option>
                    <option value="Kommunikation">Kommunikation</option>
                    <option value="Besonderheiten">Besonderheiten</option>
                    <option value="Unregelmäßigkeiten">Unregelmäßigkeiten</option>
                  </>
                )}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="question_type">Fragetyp</Label>
              <select
                id="question_type"
                name="question_type"
                value={formData.question_type}
                onChange={handleInputChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="open">Offene Frage</option>
                <option value="MC_single">Single Choice</option>
                <option value="MC_multi">Multiple Choice</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="difficulty">Schwierigkeitsgrad</Label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <Button
                    key={level}
                    type="button"
                    variant="outline"
                    className={`flex-1 ${formData.difficulty === level ? 'bg-amber-100 border-amber-400' : ''}`}
                    onClick={() => handleDifficultyChange(level)}
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="text">Fragetext</Label>
              <Textarea
                id="text"
                name="text"
                placeholder="Was ist die Bedeutung dieses Signals?"
                value={formData.text}
                onChange={handleInputChange}
                className="min-h-[100px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Bild (optional)</Label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('image-upload')?.click()}
                  >
                    <Image className="mr-2 h-4 w-4" />
                    Bild auswählen
                  </Button>
                  {(imagePreview || formData.image_url) && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={removeImage}
                      size="icon"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
                
                {imagePreview && (
                  <div className="mt-2 overflow-hidden rounded-md border">
                    <img 
                      src={imagePreview} 
                      alt="Vorschau" 
                      className="max-h-[200px] w-full object-contain" 
                    />
                  </div>
                )}
                {!imagePreview && formData.image_url && (
                  <div className="mt-2 overflow-hidden rounded-md border">
                    <img 
                      src={formData.image_url} 
                      alt="Gespeichertes Bild" 
                      className="max-h-[200px] w-full object-contain" 
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Antworten</Label>
                {!isSignalQuestion && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addAnswer}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Antwort hinzufügen
                  </Button>
                )}
              </div>
              
              {formData.question_type === "open" && isSignalQuestion ? (
                <SignalAnswerInput
                  value={formData.answers?.[0]?.text || ""}
                  onChange={(text) => handleAnswerChange(0, text)}
                />
              ) : (
                <div className="space-y-3">
                  {formData.answers?.map((answer, index) => (
                    <div key={index} className="flex items-start gap-2 rounded-md border border-gray-200 p-2">
                      <Button
                        type="button"
                        size="icon"
                        variant={answer.isCorrect ? "default" : "outline"}
                        className="mt-1 h-6 w-6 shrink-0"
                        onClick={() => toggleAnswerCorrectness(index)}
                      >
                        {answer.isCorrect && <span>✓</span>}
                      </Button>
                      <Textarea
                        placeholder={`Antwort ${index + 1}`}
                        value={answer.text}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        className="flex-1 min-h-[60px]"
                      />
                      {formData.answers.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="mt-1 h-6 w-6 shrink-0"
                          onClick={() => removeAnswer(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {formData.question_type === "MC_single" && (
                <p className="text-xs text-gray-500">Hinweis: Bei Single Choice darf nur eine Antwort korrekt sein.</p>
              )}
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vorschau</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="font-medium">{formData.text || "Fragetext erscheint hier"}</div>
                  
                  {(imagePreview || formData.image_url) && (
                    <div className="overflow-hidden rounded-md border">
                      <img 
                        src={imagePreview || formData.image_url || ""} 
                        alt="Vorschau" 
                        className="max-h-[150px] w-full object-contain" 
                      />
                    </div>
                  )}
                  
                  <div>
                    <h4 className="mb-2 text-sm font-medium">Antworten:</h4>
                    <ul className="space-y-1">
                      {formData.answers?.map((answer, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className={`h-3 w-3 shrink-0 rounded-full ${answer.isCorrect ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          <span>{answer.text || `Antwort ${index + 1}`}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="pt-2 text-xs text-gray-500">
                    <span className="rounded-full bg-gray-100 px-2 py-1">
                      {formData.category} / {formData.sub_category}
                    </span>
                    <span className="ml-2 rounded-full bg-gray-100 px-2 py-1">
                      Schwierigkeit: {formData.difficulty}/5
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default QuestionEditorPage;
