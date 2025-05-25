
import React, { useEffect, useState } from 'react';
import { useAdminStore } from '../store/admin-store';
import { useToastSystem } from '../hooks/useToastSystem';
import { truncateContent } from '../utils/content-renderer';
import { EnhancedQuestionTable } from '../components/tables/EnhancedQuestionTable';
import { ToastContainer, SkeletonCard } from '../components/ui/VisualFeedback';
import { Plus, Search, Filter, FileText, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const QuestionsPage2: React.FC = () => {
  const { 
    questions, 
    loadQuestions, 
    searchQuery, 
    setSearch,
    selectedEntity,
    selectEntity,
    execute,
    isLoading 
  } = useAdminStore();
  
  const { toasts, toast } = useToastSystem();
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  
  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);
  
  const questionsList = Object.values(questions);
  const filteredQuestions = questionsList.filter(q => 
    truncateContent(q.text).toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.sub_category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleCreateQuestion = async () => {
    try {
      await execute({
        type: 'QUESTION_CREATE',
        payload: {
          category: 'Signale',
          sub_category: 'Haupt- und Vorsignale',
          question_type: 'open',
          difficulty: 1,
          text: 'Neue Frage',
          answers: [],
          created_by: 'admin',
          revision: 1
        },
        meta: {
          onSuccess: () => {
            toast.success('Frage erstellt', 'Die neue Frage wurde erfolgreich erstellt');
          },
          onError: (error) => {
            toast.error('Fehler beim Erstellen', error.message);
          }
        }
      });
    } catch (error) {
      toast.error('Fehler', 'Unerwarteter Fehler beim Erstellen der Frage');
    }
  };

  const handleEditQuestion = (id: string) => {
    selectEntity(id, 'question');
    // Navigate to edit page or open modal
    toast.info('Navigation', 'Zur Bearbeitung weiterleiten...');
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm('Sind Sie sicher, dass Sie diese Frage löschen möchten?')) {
      return;
    }

    try {
      await execute({
        type: 'QUESTION_DELETE',
        payload: { id },
        meta: {
          onSuccess: () => {
            toast.success('Frage gelöscht', 'Die Frage wurde erfolgreich gelöscht');
          },
          onError: (error) => {
            toast.error('Fehler beim Löschen', error.message);
          }
        }
      });
    } catch (error) {
      toast.error('Fehler', 'Unerwarteter Fehler beim Löschen der Frage');
    }
  };

  const handleDuplicateQuestion = async (id: string) => {
    const originalQuestion = questions[id];
    if (!originalQuestion) return;

    try {
      await execute({
        type: 'QUESTION_CREATE',
        payload: {
          ...originalQuestion,
          text: `${originalQuestion.text} (Kopie)`,
          revision: 1
        },
        meta: {
          onSuccess: () => {
            toast.success('Frage dupliziert', 'Die Frage wurde erfolgreich dupliziert');
          },
          onError: (error) => {
            toast.error('Fehler beim Duplizieren', error.message);
          }
        }
      });
    } catch (error) {
      toast.error('Fehler', 'Unerwarteter Fehler beim Duplizieren der Frage');
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fragen verwalten</h1>
          <p className="text-gray-600 mt-1">
            Erstellen, bearbeiten und organisieren Sie alle Fragen
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 px-3"
            >
              <LayoutGrid size={16} />
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="h-8 px-3"
            >
              <List size={16} />
            </Button>
          </div>

          <Button
            onClick={handleCreateQuestion}
            className="flex items-center gap-2 bg-gradient-to-r from-[#3F00FF] to-[#0F52BA] text-white hover:shadow-lg transition-all"
            disabled={isLoading}
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Neue Frage</span>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{questionsList.length}</div>
          <div className="text-sm text-gray-600">Gesamt Fragen</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">
            {questionsList.filter(q => q.category === 'Signale').length}
          </div>
          <div className="text-sm text-gray-600">Signal-Fragen</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {questionsList.filter(q => q.category === 'Betriebsdienst').length}
          </div>
          <div className="text-sm text-gray-600">Betriebsdienst-Fragen</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-2xl font-bold text-purple-600">
            {filteredQuestions.length}
          </div>
          <div className="text-sm text-gray-600">Gefilterte Ergebnisse</div>
        </div>
      </div>
      
      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : viewMode === 'table' ? (
        <EnhancedQuestionTable
          questions={filteredQuestions}
          onEdit={handleEditQuestion}
          onDelete={handleDeleteQuestion}
          onDuplicate={handleDuplicateQuestion}
        />
      ) : (
        // Grid View (existing component would go here)
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredQuestions.map((question) => (
            <div
              key={question.id}
              onClick={() => selectEntity(question.id, 'question')}
              className={`
                bg-white rounded-lg p-6 border cursor-pointer transition-all hover:shadow-lg
                ${selectedEntity === question.id 
                  ? 'border-blue-500 shadow-lg ring-2 ring-blue-100' 
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {truncateContent(question.text, 60)}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {question.category} / {question.sub_category}
                  </p>
                </div>
                
                <div className="ml-3 flex-shrink-0">
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-medium
                    ${question.category === 'Signale' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                    }
                  `}>
                    {question.question_type === 'open' ? 'Offen' : 'MC'}
                  </span>
                </div>
              </div>
              
              {/* Question Content */}
              <div className="mb-4">
                {question.image_url && (
                  <div className="mb-3">
                    <img 
                      src={question.image_url} 
                      alt="Fragebild" 
                      className="w-full h-32 object-cover rounded-md"
                    />
                  </div>
                )}
                
                <p className="text-sm text-gray-600 line-clamp-2">
                  {truncateContent(question.text, 120)}
                </p>
              </div>
              
              {/* Question Meta */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Schwierigkeit: {question.difficulty}/5</span>
                <span>Rev. {question.revision}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Empty State */}
      {!isLoading && filteredQuestions.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="text-gray-400 mb-4">
            <FileText size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Keine Fragen gefunden</h3>
          <p className="text-gray-500 mb-6">
            {searchQuery ? 'Versuchen Sie andere Suchbegriffe' : 'Erstellen Sie Ihre erste Frage'}
          </p>
          <Button
            onClick={handleCreateQuestion}
            className="bg-gradient-to-r from-[#3F00FF] to-[#0F52BA] text-white"
            disabled={isLoading}
          >
            Neue Frage erstellen
          </Button>
        </div>
      )}
      
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} />
    </div>
  );
};
