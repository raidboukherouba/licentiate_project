import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import { departmentSchema } from "../../validations/department-schema"; // Import the department schema
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { useEffect } from "react";

// Define Department type
interface Department {
  dept_id: number;
  dept_name: string;
}

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (name: string) => void; // Accept the department name
  selectedDepartment: Department | null; // Pass the selected department
}

export function EditModal({ isOpen, onClose, onEdit, selectedDepartment }: EditModalProps) {
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof departmentSchema>>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      dept_name: selectedDepartment?.dept_name || "", // Initialize with the selected department's name
    },
  });

  // Reset the form when the modal is opened or the selected department changes
  useEffect(() => {
    if (isOpen && selectedDepartment) {
      form.reset({ dept_name: selectedDepartment.dept_name });
    }
  }, [isOpen, selectedDepartment, form]);

  const handleEdit = (values: z.infer<typeof departmentSchema>) => {
    if (selectedDepartment) {
      onEdit(values.dept_name); // Pass the validated department name
      onClose(); // Close the modal
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("department.edit_title")}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          
        </DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleEdit)} className="space-y-4">
            <FormField
              control={form.control}
              name="dept_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("department.dept_name")}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value}
                      placeholder={t("department.dept_name_placeholder")}
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