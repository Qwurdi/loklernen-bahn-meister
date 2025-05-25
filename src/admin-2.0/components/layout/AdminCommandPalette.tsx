
import React, { useState, useEffect } from 'react';
import { useAdminStore } from '../../store/admin-store';
import { CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { Search, Plus, FileText, Settings, Home, Database } from 'lucide-react';

export const AdminCommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { execute, questions, categories } = useAdminStore();
  
  // Listen for Ctrl+K / Cmd+K globally
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCommand = (command: () => void) => {
    command();
    setIsOpen(false);
    setQuery('');
  };

  const questionsList = Object.values(questions);
  const categoriesList = Object.values(categories);

  // Filter questions and categories based on search
  const filteredQuestions = questionsList.filter(q => 
    q.text.toLowerCase().includes(query.toLowerCase()) ||
    q.category.toLowerCase().includes(query.toLowerCase()) ||
    q.sub_category.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  const filteredCategories = categoriesList.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.description?.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  return (
    <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
      <CommandInput 
        placeholder="Suchen Sie nach Befehlen, Fragen oder Kategorien..." 
        value={query}
        onValueChange={setQuery}
      />
      <CommandList className="max-h-[400px]">
        <CommandEmpty>Keine Ergebnisse gefunden</CommandEmpty>
        
        {/* Quick Actions */}
        <CommandGroup heading="Schnellaktionen">
          <CommandItem onSelect={() => handleCommand(() => {
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
          })}>
            <Plus className="mr-2 h-4 w-4" />
            Neue Frage erstellen
            <span className="ml-auto text-xs bg-gray-100 px-2 py-1 rounded">N</span>
          </CommandItem>
          
          <CommandItem onSelect={() => handleCommand(() => {
            window.location.href = '/admin-2.0';
          })}>
            <Home className="mr-2 h-4 w-4" />
            Zum Dashboard
            <span className="ml-auto text-xs bg-gray-100 px-2 py-1 rounded">⌘D</span>
          </CommandItem>

          <CommandItem onSelect={() => handleCommand(() => {
            window.location.href = '/admin-2.0/categories';
          })}>
            <Database className="mr-2 h-4 w-4" />
            Kategorien verwalten
          </CommandItem>
        </CommandGroup>

        {/* Recent Questions */}
        {filteredQuestions.length > 0 && (
          <CommandGroup heading="Fragen">
            {filteredQuestions.map((question) => (
              <CommandItem 
                key={question.id} 
                onSelect={() => handleCommand(() => {
                  // Navigate to question edit
                  window.location.href = `/admin-2.0/questions/edit/${question.id}`;
                })}
              >
                <FileText className="mr-2 h-4 w-4" />
                <div className="flex flex-col">
                  <span className="font-medium truncate max-w-[300px]">
                    {typeof question.text === 'string' ? question.text.slice(0, 60) : 'Frage'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {question.category} / {question.sub_category}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* Categories */}
        {filteredCategories.length > 0 && (
          <CommandGroup heading="Kategorien">
            {filteredCategories.map((category) => (
              <CommandItem 
                key={category.id}
                onSelect={() => handleCommand(() => {
                  // Navigate to category
                  window.location.href = `/admin-2.0/categories/${category.id}`;
                })}
              >
                <Database className="mr-2 h-4 w-4" />
                <div className="flex flex-col">
                  <span className="font-medium">{category.name}</span>
                  {category.description && (
                    <span className="text-xs text-gray-500 truncate max-w-[300px]">
                      {category.description}
                    </span>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* Navigation */}
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => handleCommand(() => window.location.href = '/admin-2.0/questions')}>
            <FileText className="mr-2 h-4 w-4" />
            Alle Fragen
          </CommandItem>
          <CommandItem onSelect={() => handleCommand(() => window.location.href = '/admin-2.0/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            Einstellungen
          </CommandItem>
        </CommandGroup>
      </CommandList>
      
      <div className="border-t p-2 text-xs text-gray-500 bg-gray-50">
        <div className="flex justify-between">
          <span>ESC zum Schließen</span>
          <span>⌘K zum Öffnen</span>
        </div>
      </div>
    </CommandDialog>
  );
};
