
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Category } from "@/api/categories/types";

// Define the form schema for editing a category
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
  description: z.string().max(200, "Description must be less than 200 characters").optional(),
  isPro: z.boolean().default(false)
});

type FormValues = z.infer<typeof formSchema>;

interface CategoryEditDialogProps {
  category: Category | null;
  isUpdating: boolean;
  onClose: () => void;
  onSave: (values: FormValues) => void;
}

const CategoryEditDialog: React.FC<CategoryEditDialogProps> = ({
  category,
  isUpdating,
  onClose,
  onSave
}) => {
  // Initialize the form for editing
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
      isPro: category?.isPro || false
    }
  });

  React.useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        description: category.description || "",
        isPro: category.isPro || false
      });
    }
  }, [category, form]);

  return (
    <Dialog open={!!category} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Kategorie bearbeiten</DialogTitle>
          <DialogDescription>
            Ändern Sie die Details der Kategorie
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSave)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
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
                      className="resize-y min-h-[80px] border-gray-300 focus:border-loklernen-ultramarine focus:ring-loklernen-ultramarine/20"
                      rows={3}
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
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
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
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Abbrechen
              </Button>
              <Button
                type="submit"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Speichern...
                  </>
                ) : (
                  'Speichern'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryEditDialog;
