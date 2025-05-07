
import React from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Category } from "@/api/categories/types";

interface CategoryDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  onConfirmDelete: () => void;
  isDeleting: boolean;
}

const CategoryDeleteDialog: React.FC<CategoryDeleteDialogProps> = ({
  open,
  onOpenChange,
  category,
  onConfirmDelete,
  isDeleting
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
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
            onClick={onConfirmDelete}
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
