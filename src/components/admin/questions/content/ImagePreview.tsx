
import React from 'react';
import { Button } from "@/components/ui/button";
import { ZoomIn, CropIcon, RotateCw, Trash2 } from "lucide-react";

interface ImagePreviewProps {
  imageUrl: string;
  onRemove: () => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageUrl,
  onRemove
}) => {
  return (
    <div className="space-y-4">
      <div className="relative rounded-md border overflow-hidden">
        <img 
          src={imageUrl} 
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
            onClick={onRemove}
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
  );
};
