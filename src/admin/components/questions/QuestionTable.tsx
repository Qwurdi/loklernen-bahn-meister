
import React from 'react';
import { Question } from '@/types/questions';
import { renderContent, truncateContent } from '../../utils/content-renderer';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Copy, Eye } from 'lucide-react';

interface QuestionTableProps {
  questions: Question[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  loading?: boolean;
}

export const QuestionTable: React.FC<QuestionTableProps> = ({
  questions,
  onEdit,
  onDelete,
  onDuplicate,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3F00FF] mx-auto mb-4"></div>
        <p className="text-gray-500">Lade Fragen...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Frage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kategorie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Typ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Schwierigkeit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Revision
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {questions.map((question) => (
              <tr key={question.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="max-w-xs">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {truncateContent(question.text, 80)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {question.sub_category}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`
                    inline-flex px-2 py-1 text-xs font-semibold rounded-full
                    ${question.category === 'Signale' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                    }
                  `}>
                    {question.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {question.question_type === 'open' ? 'Offen' : 'Multiple Choice'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {question.difficulty}/5
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  v{question.revision}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(question.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDuplicate(question.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Copy size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(question.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {questions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">
            <Eye size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Keine Fragen gefunden</h3>
          <p className="text-gray-500">Keine Fragen entsprechen den aktuellen Filtern</p>
        </div>
      )}
    </div>
  );
};
