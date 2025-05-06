
import React from 'react';
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface FloatingLearnButtonProps {
  visible: boolean;
  onLearnStart: () => void;
  count: number;
}

export default function FloatingLearnButton({ 
  visible, 
  onLearnStart, 
  count 
}: FloatingLearnButtonProps) {
  if (!visible) return null;
  
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-20 left-0 right-0 z-50 flex justify-center px-4 sm:bottom-8"
        >
          <Button 
            onClick={onLearnStart}
            className="flex items-center gap-2 px-6 py-6 shadow-lg bg-gradient-ultramarine hover:opacity-90 transition-opacity"
            size="lg"
          >
            <Play className="h-5 w-5" />
            <span>
              {count === 1 
                ? '1 Kategorie lernen' 
                : `${count} Kategorien lernen`}
            </span>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
