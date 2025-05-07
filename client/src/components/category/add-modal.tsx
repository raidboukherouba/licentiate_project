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

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string) => void; // Accept the category name
}

export function AddCategoryModal({ isOpen, onClose, onAdd }: AddCategoryModalProps) {
  const { t } = useTranslation();

  // Initialize the form with zodResolver and default values
  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      cat_name: "", // Initialize with an empty string
    },
  });

  // Reset the form when the modal is opened
  useEffect(() => {
    if (isOpen) {
      form.reset({ cat_name: "" });
    }
  }, [isOpen, form]);

  // Handle form submission
  const handleAdd = (values: z.infer<typeof categorySchema>) => {
    onAdd(values.cat_name); // Pass the validated category name
    onClose(); // Close the modal
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("category.add_title")}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {/* Add a description if needed */}
        </DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAdd)} className="space-y-4">
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
              {/* Submit Button */}
              <Button size="sm" type="submit">
                <CircleCheck className="w-4 h-4" />
                {t("global.add")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}