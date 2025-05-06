
import React from 'react';
import { Button } from "@/components/ui/button";
import { Image, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";

interface ImageSelectorProps {
  imagePreview: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: () => void;
}

export const ImageSelector: React.FC<ImageSelectorProps> = ({
  imagePreview,
  onImageChange,
  removeImage
}) => {
  return (
    <div className="space-y-2">
      <Label>Bild (optional)</Label>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('image-upload')?.click()}
          >
            <Image className="mr-2 h-4 w-4" />
            Bild auswählen
          </Button>
          {imagePreview && (
            <Button
              type="button"
              variant="outline"
              onClick={removeImage}
              size="icon"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          )}
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onImageChange}
          />
        </div>
        
        {imagePreview && (
          <div className="mt-2 overflow-hidden rounded-md border">
            <img 
              src={imagePreview} 
              alt="Vorschau" 
              className="max-h-[200px] w-full object-contain" 
            />
          </div>
        )}
      </div>
    </div>
  );
};
