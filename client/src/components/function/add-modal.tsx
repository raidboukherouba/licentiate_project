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
import { functionSchema } from "../../validations/function-schema"; // Import your function schema
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { useEffect } from "react";

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string) => void; // Accept the function name
}

export function AddModal({ isOpen, onClose, onAdd }: AddModalProps) {
  const { t } = useTranslation();

  // Initialize the form with zodResolver and default values
  const form = useForm<z.infer<typeof functionSchema>>({
    resolver: zodResolver(functionSchema),
    defaultValues: {
      func_name: "", // Initialize with an empty string
    },
  });

  // Reset the form when the modal is opened
  useEffect(() => {
    if (isOpen) {
      form.reset({ func_name: "" });
    }
  }, [isOpen, form]);

  // Handle form submission
  const handleAdd = (values: z.infer<typeof functionSchema>) => {
    onAdd(values.func_name); // Pass the validated function name
    onClose(); // Close the modal
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("function.add_title")}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          
        </DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAdd)} className="space-y-4">
            <FormField
              control={form.control}
              name="func_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("function.func_name")}</FormLabel>
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