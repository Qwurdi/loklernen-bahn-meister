
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useCategories } from "@/hooks/useCategories";
import { QuestionCategory } from "@/types/questions";
import { Plus, Loader2 } from "lucide-react";

interface CategoryFormProps {
  parentCategory: QuestionCategory;
}

// Define the form schema with validation rules
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
  description: z.string().max(200, "Description must be less than 200 characters").optional(),
  isPro: z.boolean().default(false)
});

type FormValues = z.infer<typeof formSchema>;

const CategoryForm: React.FC<CategoryFormProps> = ({ parentCategory }) => {
  const { createCategory, isCreating } = useCategories();

  // Initialize the form with react-hook-form and zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      isPro: false
    }
  });

  const onSubmit = (values: FormValues) => {
    createCategory({
      name: values.name.trim(),
      description: values.description?.trim() || undefined,
      parent_category: parentCategory,
      isPro: values.isPro
    });

    // Reset form after submission
    form.reset();
  };

  return (
    <Card className="shadow-md border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="bg-gradient-to-r from-loklernen-ultramarine/10 to-loklernen-sapphire/5 rounded-t-lg">
        <CardTitle className="text-loklernen-ultramarine">Neue Kategorie hinzufügen</CardTitle>
        <CardDescription>
          Erstellen Sie eine neue {parentCategory === "Signale" ? "Signal" : "Betriebsdienst"}-Kategorie
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategorienamen</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="z.B. Hauptsignale" 
                      className="border-gray-300 focus:border-loklernen-ultramarine focus:ring-loklernen-ultramarine/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Beschreibung (optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Kurze Beschreibung der Kategorie"
                      className="min-h-[80px] resize-y border-gray-300 focus:border-loklernen-ultramarine focus:ring-loklernen-ultramarine/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPro"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mt-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-medium">Pro-Kategorie</FormLabel>
                    <p className="text-sm text-gray-500">
                      Diese Kategorie ist nur für Pro-Nutzer verfügbar
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full mt-6 bg-loklernen-ultramarine hover:bg-loklernen-ultramarine/90 transition-colors" 
              disabled={isCreating}
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Wird erstellt...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Kategorie hinzufügen
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CategoryForm;
