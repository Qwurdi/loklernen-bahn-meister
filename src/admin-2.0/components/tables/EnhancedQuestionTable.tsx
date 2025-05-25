
import React, { useState, useMemo } from 'react';
import { Question } from '../../types';
import { truncateContent } from '../../utils/content-renderer';
import { useAdminStore } from '../../store/admin-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronUp, 
  ChevronDown, 
  Search, 
  Filter, 
  MoreHorizontal,
  Edit,
  Copy,
  Trash2,
  ArrowUpDown
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface EnhancedQuestionTableProps {
  questions: Question[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
}

type SortField = 'text' | 'category' | 'sub_category' | 'difficulty' | 'created_at' | 'updated_at';
type SortDirection = 'asc' | 'desc';

interface TableFilters {
  category: string;
  subCategory: string;
  difficulty: string;
  questionType: string;
}

export const EnhancedQuestionTable: React.FC<EnhancedQuestionTableProps> = ({
  questions,
  onEdit,
  onDelete,
  onDuplicate
}) => {
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField>('updated_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<TableFilters>({
    category: 'all',
    subCategory: 'all',
    difficulty: 'all',
    questionType: 'all'
  });

  // Sorting logic
  const sortedQuestions = useMemo(() => {
    const sorted = [...questions].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'text':
          aValue = typeof a.text === 'string' ? a.text : '';
          bValue = typeof b.text === 'string' ? b.text : '';
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        case 'sub_category':
          aValue = a.sub_category;
          bValue = b.sub_category;
          break;
        case 'difficulty':
          aValue = a.difficulty;
          bValue = b.difficulty;
          break;
        case 'created_at':
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
        case 'updated_at':
          aValue = new Date(a.updated_at);
          bValue = new Date(b.updated_at);
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [questions, sortField, sortDirection]);

  // Filtering logic
  const filteredQuestions = useMemo(() => {
    return sortedQuestions.filter(question => {
      const matchesSearch = searchQuery === '' || 
        truncateContent(question.text).toLowerCase().includes(searchQuery.toLowerCase()) ||
        question.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        question.sub_category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = filters.category === 'all' || question.category === filters.category;
      const matchesSubCategory = filters.subCategory === 'all' || question.sub_category === filters.subCategory;
      const matchesDifficulty = filters.difficulty === 'all' || question.difficulty.toString() === filters.difficulty;
      const matchesQuestionType = filters.questionType === 'all' || question.question_type === filters.questionType;

      return matchesSearch && matchesCategory && matchesSubCategory && matchesDifficulty && matchesQuestionType;
    });
  }, [sortedQuestions, searchQuery, filters]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedQuestions(new Set(filteredQuestions.map(q => q.id)));
    } else {
      setSelectedQuestions(new Set());
    }
  };

  const handleSelectQuestion = (questionId: string, checked: boolean) => {
    const newSelected = new Set(selectedQuestions);
    if (checked) {
      newSelected.add(questionId);
    } else {
      newSelected.delete(questionId);
    }
    setSelectedQuestions(newSelected);
  };

  const SortButton: React.FC<{ field: SortField; children: React.ReactNode }> = ({ field, children }) => (
    <Button
      variant="ghost"
      onClick={() => handleSort(field)}
      className="h-auto p-0 font-medium justify-start hover:bg-transparent"
    >
      {children}
      <div className="ml-2 flex flex-col">
        <ChevronUp 
          size={12} 
          className={`${sortField === field && sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400'}`}
        />
        <ChevronDown 
          size={12} 
          className={`${sortField === field && sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400'} -mt-1`}
        />
      </div>
    </Button>
  );

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 2) return 'bg-green-100 text-green-800';
    if (difficulty <= 3) return 'bg-yellow-100 text-yellow-800';
    if (difficulty <= 4) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const getCategoryColor = (category: string) => {
    return category === 'Signale' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  };

  return (
    <div className="space-y-4">
      {/* Enhanced Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 flex flex-col sm:flex-row gap-2 min-w-0">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              placeholder="Fragen durchsuchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Toggle */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter size={16} />
            Filter
            {Object.values(filters).some(f => f !== 'all') && (
              <Badge variant="secondary" className="ml-1">
                {Object.values(filters).filter(f => f !== 'all').length}
              </Badge>
            )}
          </Button>
        </div>

        {/* Selection Actions */}
        {selectedQuestions.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {selectedQuestions.size} ausgewählt
            </span>
            <Button variant="outline" size="sm">
              Bulk Bearbeiten
            </Button>
            <Button variant="outline" size="sm">
              Exportieren
            </Button>
          </div>
        )}
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="p-4 bg-gray-50 rounded-lg border space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Kategorie</label>
              <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Kategorien</SelectItem>
                  <SelectItem value="Signale">Signale</SelectItem>
                  <SelectItem value="Betriebsdienst">Betriebsdienst</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Schwierigkeit</label>
              <Select value={filters.difficulty} onValueChange={(value) => setFilters(prev => ({ ...prev, difficulty: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Schwierigkeiten</SelectItem>
                  <SelectItem value="1">1 - Sehr leicht</SelectItem>
                  <SelectItem value="2">2 - Leicht</SelectItem>
                  <SelectItem value="3">3 - Mittel</SelectItem>
                  <SelectItem value="4">4 - Schwer</SelectItem>
                  <SelectItem value="5">5 - Sehr schwer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Fragetyp</label>
              <Select value={filters.questionType} onValueChange={(value) => setFilters(prev => ({ ...prev, questionType: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Typen</SelectItem>
                  <SelectItem value="open">Offene Frage</SelectItem>
                  <SelectItem value="MC_single">Multiple Choice (Einfach)</SelectItem>
                  <SelectItem value="MC_multi">Multiple Choice (Mehrfach)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => setFilters({ category: 'all', subCategory: 'all', difficulty: 'all', questionType: 'all' })}
                className="w-full"
              >
                Filter zurücksetzen
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Table */}
      <div className="border rounded-lg overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedQuestions.size === filteredQuestions.length && filteredQuestions.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>
                <SortButton field="text">Frage</SortButton>
              </TableHead>
              <TableHead>
                <SortButton field="category">Kategorie</SortButton>
              </TableHead>
              <TableHead>
                <SortButton field="sub_category">Unterkategorie</SortButton>
              </TableHead>
              <TableHead>
                <SortButton field="difficulty">Schwierigkeit</SortButton>
              </TableHead>
              <TableHead>Typ</TableHead>
              <TableHead>
                <SortButton field="updated_at">Aktualisiert</SortButton>
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuestions.map((question) => (
              <TableRow key={question.id} className="hover:bg-gray-50">
                <TableCell>
                  <Checkbox
                    checked={selectedQuestions.has(question.id)}
                    onCheckedChange={(checked) => handleSelectQuestion(question.id, checked as boolean)}
                  />
                </TableCell>
                <TableCell className="max-w-0">
                  <div className="truncate font-medium">
                    {truncateContent(question.text, 50)}
                  </div>
                  {question.image_url && (
                    <Badge variant="outline" className="mt-1">
                      📷 Bild
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={getCategoryColor(question.category)}>
                    {question.category}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-32 truncate">
                  {question.sub_category}
                </TableCell>
                <TableCell>
                  <Badge className={getDifficultyColor(question.difficulty)}>
                    {question.difficulty}/5
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {question.question_type === 'open' ? 'Offen' : 
                     question.question_type === 'MC_single' ? 'MC (1)' : 'MC (Multi)'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(question.updated_at).toLocaleDateString('de-DE')}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit?.(question.id)}>
                        <Edit size={16} className="mr-2" />
                        Bearbeiten
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDuplicate?.(question.id)}>
                        <Copy size={16} className="mr-2" />
                        Duplizieren
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDelete?.(question.id)}
                        className="text-red-600"
                      >
                        <Trash2 size={16} className="mr-2" />
                        Löschen
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          {filteredQuestions.length} von {questions.length} Fragen
          {searchQuery && ` für "${searchQuery}"`}
        </span>
        <span>
          {selectedQuestions.size > 0 && `${selectedQuestions.size} ausgewählt`}
        </span>
      </div>
    </div>
  );
};
