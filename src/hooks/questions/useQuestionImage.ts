
import { useState, useCallback } from "react";
import { uploadQuestionImage } from "@/api/questions";
import { toast } from "sonner";

export const useQuestionImage = (initialImageUrl: string | null = null) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialImageUrl);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        setIsImageLoading(true);
        const file = e.target.files[0];
        
        // Validate image file
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
          toast.error("Ungültiger Dateityp. Erlaubt sind JPG, PNG, GIF und WEBP.");
          return;
        }
        
        // Limit file size to 5MB
        if (file.size > 5 * 1024 * 1024) {
          toast.error("Das Bild ist zu groß. Maximale Dateigröße: 5MB");
          return;
        }
        
        setImageFile(file);
        
        const reader = new FileReader();
        reader.onload = (event) => {
          setImagePreview(event.target?.result as string);
          setIsImageLoading(false);
        };
        reader.onerror = () => {
          toast.error("Fehler beim Lesen der Bilddatei");
          setIsImageLoading(false);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error processing image:", error);
        toast.error("Fehler beim Verarbeiten des Bildes");
        setIsImageLoading(false);
      }
    }
  }, []);
  
  const handlePastedImage = useCallback((file: File) => {
    try {
      setIsImageLoading(true);
      
      // Validate image file
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error("Ungültiger Dateityp. Erlaubt sind JPG, PNG, GIF und WEBP.");
        return;
      }
      
      // Limit file size to 5MB
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Das Bild ist zu groß. Maximale Dateigröße: 5MB");
        return;
      }
      
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
        setIsImageLoading(false);
      };
      reader.onerror = () => {
        toast.error("Fehler beim Lesen der Bilddatei");
        setIsImageLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error processing pasted image:", error);
      toast.error("Fehler beim Verarbeiten des eingefügten Bildes");
      setIsImageLoading(false);
    }
  }, []);
  
  const removeImage = useCallback(() => {
    setImageFile(null);
    setImagePreview(null);
  }, []);

  return {
    imageFile,
    imagePreview,
    isImageLoading,
    handleImageChange,
    handlePastedImage,
    removeImage,
    setImagePreview
  };
};
