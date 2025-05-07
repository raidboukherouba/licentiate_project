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

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string) => void; // Accept the department name
}

export function AddModal({ isOpen, onClose, onAdd }: AddModalProps) {
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof departmentSchema>>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      dept_name: "", // Initialize with an empty string
    },
  });

  // Reset the form when the modal is opened
  useEffect(() => {
    if (isOpen) {
      form.reset({ dept_name: "" });
    }
  }, [isOpen, form]);

  const handleAdd = (values: z.infer<typeof departmentSchema>) => {
    onAdd(values.dept_name); // Pass the validated department name
    onClose(); // Close the modal
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("department.add_title")}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          
        </DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAdd)} className="space-y-4">
            <FormField
              control={form.control}
              name="dept_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("department.dept_name")}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
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
                {t("global.add")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}