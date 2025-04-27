
import React from 'react';
import { Button } from "@/components/ui/button";
import { Book, Plus } from "lucide-react";
import { Link } from "react-router-dom";

interface QuestionActionsProps {
  onNewSignalQuestion: () => void;
}

export const QuestionActions: React.FC<QuestionActionsProps> = ({
  onNewSignalQuestion
}) => {
  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={onNewSignalQuestion}>
        <Book className="mr-2 h-4 w-4" />
        Neue Signalfrage
      </Button>
      <Link to="/admin/questions/create">
        <Button variant="default">
          <Plus className="mr-2 h-4 w-4" />
          Neue Frage
        </Button>
      </Link>
    </div>
  );
};
