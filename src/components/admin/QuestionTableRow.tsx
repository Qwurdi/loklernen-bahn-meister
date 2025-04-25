
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Question } from "@/types/questions";
import { TableCell, TableRow } from "@/components/ui/table";

interface QuestionTableRowProps {
  question: Question;
  index: number;
}

const QuestionTableRow: React.FC<QuestionTableRowProps> = ({ question, index }) => {
  const [showAnswerTooltip, setShowAnswerTooltip] = useState(false);
  
  // Get first answer text for preview
  const firstAnswer = question.answers?.[0]?.text || "";
  
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
        <TooltipProvider>
          <Tooltip open={showAnswerTooltip} onOpenChange={setShowAnswerTooltip}>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-auto p-0 text-left font-normal"
                onClick={() => setShowAnswerTooltip(!showAnswerTooltip)}
              >
                <span className="line-clamp-1">{question.sub_category}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-sm">
              <p className="font-semibold">Erste Antwort:</p>
              <p className="mt-1">{firstAnswer}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
          <Link to={`/admin/questions/edit/${question.id}`}>
            <Button variant="outline" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
          <Link to={`/admin/questions/delete/${question.id}`}>
            <Button variant="outline" size="icon">
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </Link>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default QuestionTableRow;
