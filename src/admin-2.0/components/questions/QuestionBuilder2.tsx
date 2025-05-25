
import React, { useState } from 'react';
import { Question, QuestionType, QuestionCategory } from '../../types';
import { useAdminStore } from '../../store/admin-store';
import { renderContent, truncateContent } from '../../utils/content-renderer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Save, Eye } from 'lucide-react';

interface QuestionBuilder2Props {
  questionId?: string;
  onSave?: (question: Question) => void;
}

export const QuestionBuilder2: React.FC<QuestionBuilder2Props> = ({ questionId, onSave }) => {
  const { questions, execute } = useAdminStore();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  const existingQuestion = questionId ? questions[questionId] : null;
  
  const [formData, setFormData] = useState({
    category: existingQuestion?.category || 'Signale' as QuestionCategory,
    sub_category: existingQuestion?.sub_category || '',
    question_type: existingQuestion?.question_type || 'open' as QuestionType,
    difficulty: existingQuestion?.difficulty || 1,
    text: existingQuestion?.text || '',
    hint: existingQuestion?.hint || '',
    image_url: existingQuestion?.image_url || '',
    answers: existingQuestion?.answers || [{ text: '', is_correct: true }],
    regulation_category: existingQuestion?.regulation_category || 'DS 301'
  });

  const handleSave = async () => {
    const command = existingQuestion 
      ? {
          type: 'QUESTION_UPDATE',
          payload: { id: questionId, data: formData }
        }
      : {
          type: 'QUESTION_CREATE',
          payload: { ...formData, created_by: 'admin', revision: 1 }
        };

    await execute(command);
    
    if (onSave && existingQuestion) {
      onSave({ ...existingQuestion, ...formData });
    }
  };

  const addAnswer = () => {
    setFormData(prev => ({
      ...prev,
      answers: [...prev.answers, { text: '', is_correct: false }]
    }));
  };

  const removeAnswer = (index: number) => {
    setFormData(prev => ({
      ...prev,
      answers: prev.answers.filter((_, i) => i !== index)
    }));
  };

  const updateAnswer = (index: number, field: 'text' | 'is_correct', value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      answers: prev.answers.map((answer, i) => 
        i === index ? { ...answer, [field]: value } : answer
      )
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          {existingQuestion ? 'Frage bearbeiten' : 'Neue Frage erstellen'}
        </h2>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="flex items-center gap-2"
          >
            <Eye size={16} />
            {isPreviewMode ? 'Bearbeiten' : 'Vorschau'}
          </Button>
          
          <Button
            onClick={handleSave}
            className="flex items-center gap-2 bg-gradient-to-r from-[#3F00FF] to-[#0F52BA]"
          >
            <Save size={16} />
            Speichern
          </Button>
        </div>
      </div>

      {isPreviewMode ? (
        // Preview Mode
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{formData.category}</span>
              <span>•</span>
              <span>{formData.sub_category}</span>
              <span>•</span>
              <span>Schwierigkeit: {formData.difficulty}/5</span>
            </div>
            
            <div className="text-lg font-medium">{renderContent(formData.text)}</div>
            
            {formData.image_url && (
              <img 
                src={formData.image_url} 
                alt="Fragebild" 
                className="max-w-md rounded-lg border"
              />
            )}
            
            {formData.answers.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Antworten:</h4>
                {formData.answers.map((answer, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg border ${
                      answer.is_correct ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    {renderContent(answer.text)} {answer.is_correct && '✓'}
                  </div>
                ))}
              </div>
            )}
            
            {formData.hint && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <strong>Hinweis:</strong> {renderContent(formData.hint)}
              </div>
            )}
          </div>
        </Card>
      ) : (
        // Edit Mode - Basic Information and Content
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Grundinformationen</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Kategorie</label>
                <Select value={formData.category} onValueChange={(value: QuestionCategory) => 
                  setFormData(prev => ({ ...prev, category: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Signale">Signale</SelectItem>
                    <SelectItem value="Betriebsdienst">Betriebsdienst</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Unterkategorie</label>
                <Input
                  value={formData.sub_category}
                  onChange={(e) => setFormData(prev => ({ ...prev, sub_category: e.target.value }))}
                  placeholder="z.B. Haupt- und Vorsignale"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Fragetyp</label>
                <Select value={formData.question_type} onValueChange={(value: QuestionType) => 
                  setFormData(prev => ({ ...prev, question_type: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Offene Frage</SelectItem>
                    <SelectItem value="MC_single">Multiple Choice (Einfach)</SelectItem>
                    <SelectItem value="MC_multi">Multiple Choice (Mehrfach)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Schwierigkeit (1-5)</label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  value={formData.difficulty}
                  onChange={(e) => setFormData(prev => ({ ...prev, difficulty: parseInt(e.target.value) }))}
                />
              </div>
            </div>
          </Card>

          {/* Content */}
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Inhalte</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Fragetext</label>
                <Textarea
                  value={typeof formData.text === 'string' ? formData.text : JSON.stringify(formData.text)}
                  onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
                  placeholder="Geben Sie hier die Frage ein..."
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Bild-URL (optional)</label>
                <Input
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Hinweis (optional)</label>
                <Textarea
                  value={typeof formData.hint === 'string' ? formData.hint : (formData.hint ? JSON.stringify(formData.hint) : '')}
                  onChange={(e) => setFormData(prev => ({ ...prev, hint: e.target.value }))}
                  placeholder="Zusätzlicher Hinweis zur Frage..."
                  rows={2}
                />
              </div>
            </div>
          </Card>

          {/* Answers */}
          <Card className="p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Antworten</h3>
              <Button
                variant="outline"
                onClick={addAnswer}
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                Antwort hinzufügen
              </Button>
            </div>
            
            <div className="space-y-3">
              {formData.answers.map((answer, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <Input
                    value={typeof answer.text === 'string' ? answer.text : JSON.stringify(answer.text)}
                    onChange={(e) => updateAnswer(index, 'text', e.target.value)}
                    placeholder="Antworttext..."
                    className="flex-1"
                  />
                  
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={answer.is_correct}
                      onChange={(e) => updateAnswer(index, 'is_correct', e.target.checked)}
                      className="rounded"
                    />
                    Korrekt
                  </label>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAnswer(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
