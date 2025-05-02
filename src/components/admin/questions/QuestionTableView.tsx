
import React from "react";
import { Question } from "@/types/questions";
import { 
  Table, 
  TableBody, 
  TableHead, 
  TableHeader, 
  TableRow,
  TableCell
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, Copy } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface QuestionTableViewProps {
  questions: Question[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  isLoading?: boolean;
}

export const QuestionTableView: React.FC<QuestionTableViewProps> = ({
  questions,
  onEdit,
  onDelete,
  onDuplicate,
  isLoading = false
}) => {
  if (questions.length === 0) {
    return (
      <div className="mt-8 rounded-md border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
        <p className="text-gray-500">Keine Fragen in dieser Kategorie gefunden.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Frage</TableHead>
            <TableHead>Kategorie</TableHead>
            <TableHead>Unterkategorie</TableHead>
            <TableHead className="text-center">Typ</TableHead>
            <TableHead className="text-center">Schwierigkeit</TableHead>
            <TableHead className="text-right">Aktionen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questions.map((question, index) => {
            const firstAnswer = question.answers.find(a => a.isCorrect)?.text || question.answers[0]?.text || "";
            
            return (
              <TableRow key={question.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="max-w-[300px]">
                  <div className="flex items-start gap-4">
                    {question.image_url && (
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded border">
                        <img
                          src={question.image_url}
                          alt="Vorschau"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <span className="line-clamp-2">{question.text}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                    question.category === "Signale" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                  }`}>
                    {question.category}
                  </span>
                </TableCell>
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="h-auto p-0 text-left font-normal"
                      >
                        <span className="line-clamp-1">{question.sub_category}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-sm">
                      <p className="font-semibold">Antwort:</p>
                      <p className="mt-1">{firstAnswer}</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell className="text-center">
                  <span className="rounded-full px-2 py-1 text-xs font-medium bg-gray-100">
                    {question.question_type === "open" ? "Offen" : 
                      question.question_type === "MC_single" ? "Single Choice" : "Multiple Choice"}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span 
                        key={i}
                        className={`h-2 w-2 rounded-full mx-0.5 ${
                          i < question.difficulty ? "bg-amber-400" : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => onEdit(question.id)}
                      disabled={isLoading}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => onDuplicate(question.id)}
                      title="Frage duplizieren"
                      disabled={isLoading}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => onDelete(question.id)}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
