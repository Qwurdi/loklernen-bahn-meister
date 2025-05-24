
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { QuestionTextEditor } from './content/QuestionTextEditor';
import { ImageUpload } from './content/ImageUpload';
import { HintField } from './content/HintField';
import { useImagePaste } from '@/hooks/questions/useImagePaste';
import { StructuredContent } from '@/types/rich-text';

interface ContentTabProps {
  text: string | StructuredContent;
  hint?: string | StructuredContent | null;
  imagePreview: string | null;
  onTextChange: (value: string | StructuredContent) => void;
  onHintChange?: (value: string | StructuredContent) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePastedImage?: (file: File) => void;
  removeImage: () => void;
}

export const ContentTab: React.FC<ContentTabProps> = ({
  text,
  hint,
  imagePreview,
  onTextChange,
  onHintChange,
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
      
      {onHintChange && (
        <Card>
          <CardContent className="pt-6">
            <HintField hint={hint} onChange={onHintChange} />
          </CardContent>
        </Card>
      )}

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
}
