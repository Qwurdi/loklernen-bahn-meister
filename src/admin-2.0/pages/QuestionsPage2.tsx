
import React, { useEffect } from 'react';
import { useAdminStore } from '../store/admin-store';
import { truncateContent } from '../utils/content-renderer';
import { Plus, Search, Filter, FileText } from 'lucide-react';

export const QuestionsPage2: React.FC = () => {
  const { 
    questions, 
    loadQuestions, 
    searchQuery, 
    setSearch,
    selectedEntity,
    selectEntity,
    execute 
  } = useAdminStore();
  
  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);
  
  const questionsList = Object.values(questions);
  const filteredQuestions = questionsList.filter(q => 
    truncateContent(q.text).toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.sub_category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleCreateQuestion = () => {
    execute({
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
      }
    });
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fragen verwalten</h1>
          <p className="text-gray-600">Erstellen, bearbeiten und organisieren Sie alle Fragen</p>
        </div>
        
        <button
          onClick={handleCreateQuestion}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#3F00FF] to-[#0F52BA] text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Plus size={16} />
          Neue Frage
        </button>
      </div>
      
      {/* Filters & Search */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Fragen durchsuchen..."
              value={searchQuery}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter size={16} />
            Filter
          </button>
        </div>
      </div>
      
      {/* Questions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredQuestions.map((question) => (
          <div
            key={question.id}
            onClick={() => selectEntity(question.id, 'question')}
            className={`
              bg-white rounded-lg p-6 border cursor-pointer transition-all
              ${selectedEntity === question.id 
                ? 'border-blue-500 shadow-lg' 
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
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
                  {question.question_type}
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
      
      {/* Empty State */}
      {filteredQuestions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <FileText size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Keine Fragen gefunden</h3>
          <p className="text-gray-500 mb-6">
            {searchQuery ? 'Versuchen Sie andere Suchbegriffe' : 'Erstellen Sie Ihre erste Frage'}
          </p>
          <button
            onClick={handleCreateQuestion}
            className="px-4 py-2 bg-gradient-to-r from-[#3F00FF] to-[#0F52BA] text-white rounded-lg"
          >
            Neue Frage erstellen
          </button>
        </div>
      )}
      
      {/* Stats */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            {filteredQuestions.length} von {questionsList.length} Fragen
          </span>
          <span className="text-gray-600">
            Auswahl: {selectedEntity ? '1 Frage' : 'Keine'}
          </span>
        </div>
      </div>
    </div>
  );
};
