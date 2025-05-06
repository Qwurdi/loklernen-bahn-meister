
import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from '@/components/ui/rich-text/RichTextEditor';
import { Image as ImageIcon, Trash2, ZoomIn, CropIcon, RotateCw, Clipboard } from "lucide-react";
import { toast } from "sonner";

interface ContentTabProps {
  text: string;
  imagePreview: string | null;
  onTextChange: (value: string) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePastedImage?: (file: File) => void;
  removeImage: () => void;
}

export const ContentTab: React.FC<ContentTabProps> = ({
  text,
  imagePreview,
  onTextChange,
  onImageChange,
  handlePastedImage,
  removeImage
}) => {
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Handle paste events for the entire component
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!handlePastedImage) return;
      
      if (e.clipboardData && e.clipboardData.items) {
        const items = e.clipboardData.items;
        
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            const file = items[i].getAsFile();
            if (file) {
              e.preventDefault();
              handlePastedImage(file);
              toast.success("Bild aus der Zwischenablage eingefügt");
              return;
            }
          }
        }
      }
    };
    
    // Add the event listener to the document
    document.addEventListener('paste', handlePaste);
    
    // Clean up
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [handlePastedImage]);

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
          toast.success("Bild hinzugefügt");
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
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Fragetext</h3>
            </div>
            <RichTextEditor
              value={text}
              onChange={onTextChange}
              placeholder="Was ist die Bedeutung dieses Signals?"
              minHeight="150px"
            />
            <p className="text-sm text-muted-foreground">
              Verwenden Sie die Formatierungsoptionen für eine bessere Lesbarkeit.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
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
                <div className="space-y-4">
                  <div className="relative rounded-md border overflow-hidden">
                    <img 
                      src={imagePreview} 
                      alt="Vorschau" 
                      className="w-full max-h-[300px] object-contain" 
                    />
                    <div className="absolute bottom-0 right-0 p-2 flex gap-2 bg-black/50 rounded-tl-md">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 bg-white/20 hover:bg-white/40 text-white"
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 bg-white/20 hover:bg-white/40 text-white"
                      >
                        <CropIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 bg-white/20 hover:bg-white/40 text-white"
                      >
                        <RotateCw className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={removeImage}
                        className="h-8 w-8 bg-white/20 hover:bg-white/40 text-white"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Tipp: Bilder sollten eine gute Qualität haben und relevant für die Frage sein.
                  </p>
                </div>
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
        </CardContent>
      </Card>
    </div>
  );
};
