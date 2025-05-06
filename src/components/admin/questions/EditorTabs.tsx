
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, ListChecks, Settings } from "lucide-react";

interface EditorTabsProps {
  children: React.ReactNode;
  defaultValue?: string;
}

export const EditorTabs: React.FC<EditorTabsProps> = ({ 
  children, 
  defaultValue = "basics" 
}) => {
  return (
    <Tabs defaultValue={defaultValue} className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="basics" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline">Grunddaten</span>
        </TabsTrigger>
        <TabsTrigger value="content" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Inhalt</span>
        </TabsTrigger>
        <TabsTrigger value="answers" className="flex items-center gap-2">
          <ListChecks className="h-4 w-4" />
          <span className="hidden sm:inline">Antworten</span>
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
};

export const EditorTabContent: React.FC<{
  value: string;
  className?: string;
  children: React.ReactNode;
}> = ({ value, className, children }) => {
  return (
    <TabsContent value={value} className={className}>
      {children}
    </TabsContent>
  );
};
