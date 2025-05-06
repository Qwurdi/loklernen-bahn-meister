
import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface DraftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draftData: { formData: any; timestamp: number } | null;
  onLoadDraft: () => void;
  onDiscardDraft: () => void;
}

export const DraftDialog: React.FC<DraftDialogProps> = ({
  open,
  onOpenChange,
  draftData,
  onLoadDraft,
  onDiscardDraft
}) => {
  const handleLoadDraft = () => {
    onLoadDraft();
    toast.success(`Entwurf vom ${new Date(draftData?.timestamp || Date.now()).toLocaleString()} geladen`);
  };

  const handleDiscardDraft = () => {
    onDiscardDraft();
    toast.info("Entwurf verworfen");
  };
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Gespeicherten Entwurf gefunden</AlertDialogTitle>
          <AlertDialogDescription>
            Ein automatisch gespeicherter Entwurf vom {draftData?.timestamp ? new Date(draftData.timestamp).toLocaleString() : 'unbekannten Zeitpunkt'} wurde gefunden. Möchten Sie diesen laden oder verwerfen?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleDiscardDraft}>Verwerfen</AlertDialogCancel>
          <AlertDialogAction onClick={handleLoadDraft}>Entwurf laden</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
