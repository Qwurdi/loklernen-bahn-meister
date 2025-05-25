
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, Eye } from 'lucide-react';
import { QuestionCategory, RegulationCategory } from '@/types/questions';
import { useQuestions } from '@/hooks/useQuestions';
import { generateFlashcardPDF } from '../utils/pdf-generator';
import { toast } from 'sonner';

export const ExportPage: React.FC = () => {
  const [category, setCategory] = useState<QuestionCategory>('Signale');
  const [regulation, setRegulation] = useState<RegulationCategory | 'all'>('DS 301');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { data: questions, isLoading } = useQuestions(category);
  
  const filteredQuestions = questions?.filter(question => {
    if (regulation === 'all') return true;
    return question.regulation_category === regulation || question.regulation_category === 'both';
  }) || [];

  const handleExport = async () => {
    if (filteredQuestions.length === 0) {
      toast.error('Keine Fragen für Export gefunden');
      return;
    }

    setIsGenerating(true);
    try {
      await generateFlashcardPDF(filteredQuestions, {
        category,
        regulation: regulation as RegulationCategory,
        filename: `LokLernen_${category}_${regulation}_Karten.pdf`
      });
      toast.success(`${filteredQuestions.length} Karteikarten erfolgreich exportiert`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Fehler beim Erstellen der PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Karteikarten Export</h1>
        <p className="text-gray-600">Exportieren Sie Karteikarten als druckfertige PDF-Dateien</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Export Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Export-Konfiguration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Kategorie</label>
              <Select value={category} onValueChange={(value: QuestionCategory) => setCategory(value)}>
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
              <label className="text-sm font-medium mb-2 block">Regelwerk</label>
              <Select value={regulation} onValueChange={(value: RegulationCategory | 'all') => setRegulation(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DS 301">DS 301</SelectItem>
                  <SelectItem value="DV 301">DV 301</SelectItem>
                  <SelectItem value="both">Beide</SelectItem>
                  <SelectItem value="all">Alle</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span>Zu exportierende Karten:</span>
                <span className="font-semibold text-[#3F00FF]">
                  {isLoading ? 'Lädt...' : filteredQuestions.length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Export Preview & Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Format-Spezifikationen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Kartengröße:</span>
                <div className="font-mono">59 × 91 mm</div>
              </div>
              <div>
                <span className="text-gray-600">Dokumentgröße:</span>
                <div className="font-mono">65 × 97 mm</div>
              </div>
              <div>
                <span className="text-gray-600">Gestaltbereich:</span>
                <div className="font-mono">51 × 83 mm</div>
              </div>
              <div>
                <span className="text-gray-600">Eckenradius:</span>
                <div className="font-mono">5 mm</div>
              </div>
            </div>

            <div className="border rounded-lg p-3 bg-gray-50">
              <div className="text-xs text-gray-600 mb-1">Enthält:</div>
              <ul className="text-sm space-y-1">
                <li>✓ LokLernen Logo</li>
                <li>✓ Regelwerk-Badge</li>
                <li>✓ Schnittmarken</li>
                <li>✓ Doppelseitiger Druck</li>
              </ul>
            </div>

            <Button 
              onClick={handleExport}
              disabled={isGenerating || filteredQuestions.length === 0}
              className="w-full bg-gradient-to-r from-[#3F00FF] to-[#0F52BA]"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  PDF wird erstellt...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Karteikarten exportieren
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Export Statistics */}
      {!isLoading && questions && (
        <Card>
          <CardHeader>
            <CardTitle>Export-Statistiken</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#3F00FF]">
                  {questions.filter(q => q.regulation_category === 'DS 301' || q.regulation_category === 'both').length}
                </div>
                <div className="text-sm text-gray-600">DS 301 Karten</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#0F52BA]">
                  {questions.filter(q => q.regulation_category === 'DV 301' || q.regulation_category === 'both').length}
                </div>
                <div className="text-sm text-gray-600">DV 301 Karten</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#00B8A9]">
                  {questions.filter(q => q.regulation_category === 'both').length}
                </div>
                <div className="text-sm text-gray-600">Beide Regelwerke</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-700">
                  {questions.length}
                </div>
                <div className="text-sm text-gray-600">Gesamt</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
