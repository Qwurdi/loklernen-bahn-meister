
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

export default function LearningBoxHelp() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="p-1 h-auto">
          <HelpCircle className="h-4 w-4 text-gray-400" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Über unsere Lernboxen</DialogTitle>
          <DialogDescription>
            Spaced Repetition System für optimalen Lernfortschritt
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <p>
            Unser System basiert auf wissenschaftlich bewährten Lernintervallen. 
            Karten werden je nach deiner Leistung durch fünf Boxen bewegt:
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="font-medium">Box 1:</span> 
              <span className="text-gray-500">Neue Karten und solche, die du noch nicht gut kennst. Wiederholung nach 1 Tag.</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-amber-500"></div>
              <span className="font-medium">Box 2:</span> 
              <span className="text-gray-500">Grundlagenwissen. Wiederholung nach 6 Tagen.</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
              <span className="font-medium">Box 3:</span> 
              <span className="text-gray-500">Regelmäßig wiederholtes Wissen. Wiederholung nach 7-14 Tagen.</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-lime-500"></div>
              <span className="font-medium">Box 4:</span> 
              <span className="text-gray-500">Gefestigtes Wissen. Wiederholung nach 15-30 Tagen.</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-600"></div>
              <span className="font-medium">Box 5:</span> 
              <span className="text-gray-500">Langzeitgedächtnis. Wiederholung nach mehr als 30 Tagen.</span>
            </div>
          </div>
          
          <p>
            Wenn du eine Karte richtig beantwortest, wandert sie in die nächste Box. 
            Bei falscher Antwort geht sie zurück in Box 1, wo sie intensiver wiederholt wird.
          </p>
          
          <p className="text-xs text-gray-400 italic">
            Dieses System basiert auf dem SM-2 Algorithmus und ist auf langfristiges Behalten optimiert.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
