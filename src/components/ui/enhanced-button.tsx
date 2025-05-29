
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface EnhancedButtonProps extends ButtonProps {
  gradient?: boolean;
}

export function EnhancedButton({ 
  className, 
  gradient = false, 
  children, 
  ...props 
}: EnhancedButtonProps) {
  return (
    <Button
      className={cn(
        gradient && "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
