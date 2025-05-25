
import React, { useState } from 'react';
import { useAdminQuestions } from '../hooks/useAdminQuestions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash2, Copy } from 'lucide-react';
import { QuestionCategory } from '@/types/questions';
import { getTextValue } from '@/types/rich-text';

export const QuestionsPage: React.FC = () => {
  const [category, setCategory] = useState<QuestionCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { 
    questions, 
    isLoading, 
    deleteQuestion, 
    duplicateQuestion,
    isDeleting,
    isDuplicating 
  } = useAdminQuestions(category === 'all' ? undefined : category);

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = searchQuery === '' || 
      getTextValue(question.text).toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.sub_category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleDuplicate = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question) {
      duplicateQuestion(question);
    }
  };

  const handleDelete = (questionId: string) => {
    if (confirm('Möchten Sie diese Frage wirklich löschen?')) {
      deleteQuestion(questionId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fragenverwaltung</h1>
          <p className="text-gray-600">Verwalten Sie alle Fragen im System</p>
        </div>
        <Button className="bg-gradient-to-r from-[#3F00FF] to-[#0F52BA]">
          <Plus className="mr-2 h-4 w-4" />
          Neue Frage
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              <Button
                variant={category === 'all' ? 'default' : 'outline'}
                onClick={() => setCategory('all')}
                size="sm"
              >
                Alle ({questions.length})
              </Button>
              <Button
                variant={category === 'Signale' ? 'default' : 'outline'}
                onClick={() => setCategory('Signale')}
                size="sm"
              >
                Signale ({questions.filter(q => q.category === 'Signale').length})
              </Button>
              <Button
                variant={category === 'Betriebsdienst' ? 'default' : 'outline'}
                onClick={() => setCategory('Betriebsdienst')}
                size="sm"
              >
                Betriebsdienst ({questions.filter(q => q.category === 'Betriebsdienst').length})
              </Button>
            </div>
            
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Fragen durchsuchen..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3F00FF]"></div>
              <p className="ml-3 text-gray-600">Lade Fragen...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredQuestions.map((question) => (
                <Card key={question.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <span className={`
                          px-2 py-1 text-xs rounded-full font-medium
                          ${question.category === 'Signale' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                          }
                        `}>
                          {question.category}
                        </span>
                        <div className="flex gap-1">
                          {Array.from({ length: question.difficulty }).map((_, i) => (
                            <div key={i} className="w-2 h-2 bg-amber-400 rounded-full" />
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <p className="font-medium text-sm line-clamp-2 mb-1">
                          {getTextValue(question.text)}
                        </p>
                        <p className="text-xs text-gray-500">{question.sub_category}</p>
                      </div>
                      
                      {question.image_url && (
                        <div className="w-full h-20 bg-gray-100 rounded border overflow-hidden">
                          <img 
                            src={question.image_url} 
                            alt="Question" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="h-3 w-3 mr-1" />
                          Bearbeiten
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDuplicate(question.id)}
                          disabled={isDuplicating}
                          title="Frage duplizieren"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDelete(question.id)}
                          disabled={isDeleting}
                          className="text-red-600 hover:text-red-700"
                          title="Frage löschen"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {!isLoading && filteredQuestions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {searchQuery ? 'Keine Fragen gefunden, die Ihrer Suche entsprechen.' : 'Keine Fragen gefunden.'}
              </p>
            </div>
          )}
          
          {!isLoading && filteredQuestions.length > 0 && (
            <div className="text-center mt-4 text-sm text-gray-500">
              {filteredQuestions.length} von {questions.length} Fragen angezeigt
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
