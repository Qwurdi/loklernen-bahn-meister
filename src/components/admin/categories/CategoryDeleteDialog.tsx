
import React from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Loader2, AlertTriangle } from "lucide-react";
import { Category } from "@/api/categories/types";

interface CategoryDeleteDialogProps {
  isOpen: boolean;
  isDeleting: boolean;
  category: Category | null;
  onCancel: () => void;
  onConfirm: () => void;
}

const CategoryDeleteDialog: React.FC<CategoryDeleteDialogProps> = ({
  isOpen,
  isDeleting,
  category,
  onCancel,
  onConfirm
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Kategorie löschen
          </AlertDialogTitle>
          <AlertDialogDescription>
            Sind Sie sicher, dass Sie die Kategorie <strong>"{category?.name}"</strong> löschen möchten?
            Diese Aktion kann nicht rückgängig gemacht werden. Alle Fragen in dieser Kategorie werden möglicherweise nicht mehr 
            korrekt kategorisiert.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Löschen...
              </>
            ) : (
              'Löschen'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CategoryDeleteDialog;
