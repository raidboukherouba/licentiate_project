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
import { productionTypeSchema } from "../../validations/production-type-schema"; // Import the production type schema
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { useEffect } from "react";

// Define ProductionType type
interface ProductionType {
  type_id: number;
  type_name: string;
}

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (name: string) => void; // Accept the production type name
  selectedProductionType: ProductionType | null; // Pass the selected production type
}

export function EditModal({ isOpen, onClose, onEdit, selectedProductionType }: EditModalProps) {
  const { t } = useTranslation();

  // Initialize the form with zodResolver and productionTypeSchema
  const form = useForm<z.infer<typeof productionTypeSchema>>({
    resolver: zodResolver(productionTypeSchema),
    defaultValues: {
      type_name: selectedProductionType?.type_name || "", // Initialize with the selected production type's name
    },
  });

  // Reset the form when the modal is opened or the selected production type changes
  useEffect(() => {
    if (isOpen && selectedProductionType) {
      form.reset({ type_name: selectedProductionType.type_name });
    }
  }, [isOpen, selectedProductionType, form]);

  // Handle form submission
  const handleEdit = (values: z.infer<typeof productionTypeSchema>) => {
    if (selectedProductionType) {
      onEdit(values.type_name); // Pass the validated production type name
      onClose(); // Close the modal
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("productionType.edit_title")}</DialogTitle>
        </DialogHeader>
        {/* <DialogDescription>
          {t("productionType.edit_description")}
        </DialogDescription> */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleEdit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("productionType.type_name")}</FormLabel>
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
              <Button size="sm" variant="outline" onClick={onClose}>
                {t("global.cancel")}
              </Button>
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