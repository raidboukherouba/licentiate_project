import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Input } from '../ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { CircleCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema } from "../../validations/category-schema"; // Import the category schema
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { useEffect } from "react";

// Define Category type
interface Category {
  cat_id: number;
  cat_name: string;
}

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (name: string) => void; // Accept the category name
  selectedCategory: Category | null; // Pass the selected category
}

export function EditCategoryModal({ isOpen, onClose, onEdit, selectedCategory }: EditCategoryModalProps) {
  const { t } = useTranslation();

  // Initialize the form with zodResolver and default values
  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      cat_name: selectedCategory?.cat_name || "", // Initialize with the selected category's name
    },
  });

  // Reset the form when the modal is opened or the selected category changes
  useEffect(() => {
    if (isOpen && selectedCategory) {
      form.reset({ cat_name: selectedCategory.cat_name });
    }
  }, [isOpen, selectedCategory, form]);

  // Handle form submission
  const handleEdit = (values: z.infer<typeof categorySchema>) => {
    if (selectedCategory) {
      onEdit(values.cat_name); // Pass the validated category name
      onClose(); // Close the modal
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("category.edit_title")}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {/* Add a description if needed */}
        </DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleEdit)} className="space-y-4">
            {/* Category Name Field */}
            <FormField
              control={form.control}
              name="cat_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("category.cat_name")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage /> {/* Display validation errors */}
                </FormItem>
              )}
            />
            <DialogFooter>
              {/* Cancel Button */}
              <Button size="sm" variant="outline" onClick={onClose}>
                {t("global.cancel")}
              </Button>
              {/* Save Button */}
              <Button size="sm" type="submit">
                <CircleCheck className="w-4 h-4" />
                {t("global.save")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}