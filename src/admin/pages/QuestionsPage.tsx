
import React, { useState } from 'react';
import { useAdminQuestions } from '../hooks/useAdminQuestions';
import { QuestionTable } from '../components/questions/QuestionTable';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QuestionCategory } from '@/types/questions';

export const QuestionsPage: React.FC = () => {
  const [category, setCategory] = useState<QuestionCategory | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  
  const {
    questions,
    isLoading,
    deleteQuestion,
    duplicateQuestion,
    isDeleting,
    isDuplicating
  } = useAdminQuestions(category);

  // Filter questions based on search query
  const filteredQuestions = questions.filter(question => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    const questionText = typeof question.text === 'string' 
      ? question.text.toLowerCase() 
      : '';
    return questionText.includes(searchLower) || 
           question.sub_category.toLowerCase().includes(searchLower);
  });

  const handleEdit = (id: string) => {
    // TODO: Navigate to edit page
    console.log('Edit question:', id);
  };

  const handleDelete = (id: string) => {
    if (confirm('Möchten Sie diese Frage wirklich löschen?')) {
      deleteQuestion(id);
    }
  };

  const handleDuplicate = (id: string) => {
    const question = questions.find(q => q.id === id);
    if (question) {
      duplicateQuestion(question);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fragen verwalten</h1>
          <p className="text-gray-600">Erstelle, bearbeite und organisiere Fragen</p>
        </div>
        <Button className="bg-gradient-to-r from-[#3F00FF] to-[#0F52BA]">
          <Plus size={16} className="mr-2" />
          Neue Frage
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Fragen durchsuchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={category || 'all'} onValueChange={(value) => 
          setCategory(value === 'all' ? undefined : value as QuestionCategory)
        }>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Kategorie wählen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Kategorien</SelectItem>
            <SelectItem value="Signale">Signale</SelectItem>
            <SelectItem value="Betriebsdienst">Betriebsdienst</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <QuestionTable
        questions={filteredQuestions}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
        loading={isLoading}
      />

      {filteredQuestions.length > 0 && (
        <div className="text-sm text-gray-500 text-center">
          {filteredQuestions.length} von {questions.length} Fragen angezeigt
        </div>
      )}
    </div>
  );
};
