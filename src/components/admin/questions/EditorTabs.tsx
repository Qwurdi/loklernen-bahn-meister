
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, ListChecks, Settings } from "lucide-react";

interface EditorTabsProps {
  children: React.ReactNode;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

interface EditorTabContentProps {
  value: string;
  title: string;
  icon: string;
  children: React.ReactNode;
}

const EditorTabContent: React.FC<EditorTabContentProps> = ({ value, children }) => {
  return (
    <TabsContent value={value}>
      {children}
    </TabsContent>
  );
};

export const EditorTabs: React.FC<EditorTabsProps> & { Content: React.FC<EditorTabContentProps> } = ({ 
  children, 
  defaultValue = "basics",
  onValueChange
}) => {
  return (
    <Tabs 
      defaultValue={defaultValue} 
      className="w-full" 
      onValueChange={onValueChange}
    >
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

EditorTabs.Content = EditorTabContent;
