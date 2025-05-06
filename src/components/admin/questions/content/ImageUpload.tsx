
import React, { useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Clipboard } from "lucide-react";
import { ImagePreview } from './ImagePreview';

interface ImageUploadProps {
  imagePreview: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePastedImage?: (file: File) => void;
  removeImage: () => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  imagePreview,
  onImageChange,
  handlePastedImage,
  removeImage
}) => {
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Handle drag and drop
  useEffect(() => {
    const dropZone = dropZoneRef.current;
    if (!dropZone || !handlePastedImage) return;
    
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      dropZone.classList.add('border-loklernen-ultramarine');
    };
    
    const handleDragLeave = () => {
      dropZone.classList.remove('border-loklernen-ultramarine');
    };
    
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      dropZone.classList.remove('border-loklernen-ultramarine');
      
      if (e.dataTransfer && e.dataTransfer.files) {
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type.indexOf('image') !== -1) {
          handlePastedImage(files[0]);
        }
      }
    };
    
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('drop', handleDrop);
    
    return () => {
      dropZone.removeEventListener('dragover', handleDragOver);
      dropZone.removeEventListener('dragleave', handleDragLeave);
      dropZone.removeEventListener('drop', handleDrop);
    };
  }, [handlePastedImage]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Bild (optional)</h3>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('image-upload')?.click()}
            className="flex items-center gap-2"
          >
            <ImageIcon className="h-4 w-4" />
            Bild auswählen
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex items-center gap-2"
            title="Strg+V zum Einfügen aus der Zwischenablage"
          >
            <Clipboard className="h-4 w-4" />
            Aus Zwischenablage
          </Button>
        </div>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onImageChange}
        />
      </div>
      
      <div ref={dropZoneRef}>
        {imagePreview ? (
          <ImagePreview imageUrl={imagePreview} onRemove={removeImage} />
        ) : (
          <div className="rounded-md border-2 border-dashed p-8 text-center transition-colors duration-200">
            <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">
              Kein Bild ausgewählt. Ziehen Sie ein Bild hierher, klicken Sie auf "Bild auswählen" oder fügen Sie mit Strg+V ein Bild aus der Zwischenablage ein.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
