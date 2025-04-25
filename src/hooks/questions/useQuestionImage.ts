
import { useState } from "react";
import { uploadQuestionImage } from "@/api/questions";

export const useQuestionImage = (initialImageUrl: string | null = null) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialImageUrl);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  return {
    imageFile,
    imagePreview,
    handleImageChange,
    removeImage,
    setImagePreview
  };
};
