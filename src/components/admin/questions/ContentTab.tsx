
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { QuestionTextEditor } from './content/QuestionTextEditor';
import { ImageUpload } from './content/ImageUpload';
import { useImagePaste } from '@/hooks/questions/useImagePaste';

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
  // Use the custom hook for paste functionality
  useImagePaste(handlePastedImage);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <QuestionTextEditor text={text} onTextChange={onTextChange} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <ImageUpload 
            imagePreview={imagePreview}
            onImageChange={onImageChange}
            handlePastedImage={handlePastedImage}
            removeImage={removeImage}
          />
        </CardContent>
      </Card>
    </div>
  );
};
