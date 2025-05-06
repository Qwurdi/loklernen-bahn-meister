
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from '@/components/ui/rich-text/RichTextEditor';
import { Image as ImageIcon, Trash2, ZoomIn, CropIcon, RotateCw } from "lucide-react";

interface ContentTabProps {
  text: string;
  imagePreview: string | null;
  onTextChange: (value: string) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: () => void;
}

export const ContentTab: React.FC<ContentTabProps> = ({
  text,
  imagePreview,
  onTextChange,
  onImageChange,
  removeImage
}) => {
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
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('image-upload')?.click()}
                className="flex items-center gap-2"
              >
                <ImageIcon className="h-4 w-4" />
                Bild auswählen
              </Button>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onImageChange}
              />
            </div>
            
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
              <div className="rounded-md border-2 border-dashed p-8 text-center">
                <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Kein Bild ausgewählt. Ziehen Sie ein Bild hierher oder klicken Sie auf "Bild auswählen".
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
