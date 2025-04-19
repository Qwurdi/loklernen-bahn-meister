
import React from "react";
import { Link } from "react-router-dom";
import { useQuestions } from "@/hooks/useQuestions";
import { useQuestionForm } from "@/hooks/useQuestionForm";
import { signalSubCategories } from "@/api/questions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AnswerEditor } from "@/components/admin/question-editor/AnswerEditor";
import { QuestionPreview } from "@/components/admin/question-editor/QuestionPreview";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Save, Image, Plus, ArrowLeft, Trash2 } from "lucide-react";

const QuestionEditorPage: React.FC = () => {
  const { data: questions } = useQuestions();
  const {
    formData,
    isLoading,
    imagePreview,
    isEditMode,
    handleInputChange,
    handleDifficultyChange,
    handleCategoryChange,
    handleAnswerChange,
    handleImageChange,
    removeImage,
    addAnswer,
    removeAnswer,
    toggleAnswerCorrectness,
    handleSubmit
  } = useQuestionForm(questions?.[0]);

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
              <Label>Kategorie</Label>
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
                
                {(imagePreview || formData.image_url) && (
                  <div className="mt-2 overflow-hidden rounded-md border">
                    <img 
                      src={imagePreview || formData.image_url || ""} 
                      alt="Vorschau" 
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
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addAnswer}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Antwort hinzufügen
                </Button>
              </div>
              
              <AnswerEditor
                answers={formData.answers || []}
                questionType={formData.question_type as QuestionType}
                onAnswerChange={handleAnswerChange}
                onToggleCorrectness={toggleAnswerCorrectness}
                onRemoveAnswer={removeAnswer}
                onAddAnswer={addAnswer}
              />
              
              {formData.question_type === "MC_single" && (
                <p className="text-xs text-gray-500">
                  Hinweis: Bei Single Choice darf nur eine Antwort korrekt sein.
                </p>
              )}
            </div>
            
            <QuestionPreview 
              question={formData}
              imagePreview={imagePreview}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default QuestionEditorPage;
