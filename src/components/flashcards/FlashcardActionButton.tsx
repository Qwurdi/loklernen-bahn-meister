
import React from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

type ActionButtonVariant = "known" | "unknown";

interface FlashcardActionButtonProps {
  variant: ActionButtonVariant;
  onClick: () => void;
  isMobile?: boolean;
  label?: string;
}

export default function FlashcardActionButton({
  variant,
  onClick,
  isMobile = false,
  label
}: FlashcardActionButtonProps) {
  // Configure button appearance based on variant
  const icon = variant === "known" ? <Check /> : <X />;
  const iconColor = variant === "known" ? "text-green-500" : "text-red-500";
  const borderColor = variant === "known" ? "border-green-200" : "border-red-200";
  const hoverBg = variant === "known" ? "hover:bg-green-50" : "hover:bg-red-50";
  const hoverBorder = variant === "known" ? "hover:border-green-300" : "hover:border-red-300";
  
  const srLabel = label || (variant === "known" ? "Gewusst" : "Nicht gewusst");
  
  if (isMobile) {
    return (
      <Button 
        variant="outline"
        size="lg"
        className={`rounded-full bg-white ${borderColor} ${hoverBg} shadow-md ${hoverBorder}`}
        onClick={onClick}
        aria-label={srLabel}
      >
        <span className={`h-5 w-5 ${iconColor}`}>
          {icon}
        </span>
      </Button>
    );
  }
  
  return (
    <Button
      variant="outline"
      className={`flex-1 ${borderColor} ${hoverBg} ${hoverBorder} h-12 bg-white`}
      onClick={onClick}
    >
      <span className={`h-4 w-4 mr-2 ${iconColor}`}>
        {icon}
      </span>
      {label || (variant === "known" ? "Gewusst" : "Nicht gewusst")}
    </Button>
  );
}
