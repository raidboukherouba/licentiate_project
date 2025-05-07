import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { publisherSchema } from "../../validations/publisher-schema"; // Import your publisher schema
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { useEffect } from "react";

interface AddPublisherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, country?: string) => void; // Accept publisher name and optional country
}

export function AddPublisherModal({ isOpen, onClose, onAdd }: AddPublisherModalProps) {
  const { t } = useTranslation();

  // Initialize the form with zodResolver and default values
  const form = useForm<z.infer<typeof publisherSchema>>({
    resolver: zodResolver(publisherSchema),
    defaultValues: {
      publisher_name: "", // Initialize with an empty string
      country: "", // Initialize with an empty string
    },
  });

  // Reset the form when the modal is opened
  useEffect(() => {
    if (isOpen) {
      form.reset({ publisher_name: "", country: "" });
    }
  }, [isOpen, form]);

  // Handle form submission
  const handleAdd = (values: z.infer<typeof publisherSchema>) => {
    onAdd(values.publisher_name, values.country || undefined); // Pass the validated publisher name and country
    onClose(); // Close the modal
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("publisher.add_title")}</DialogTitle>
        </DialogHeader>
        {/* <DialogDescription>
          {t("publisher.add_description")}
        </DialogDescription> */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAdd)} className="space-y-4">
            {/* Publisher Name Field */}
            <FormField
              control={form.control}
              name="publisher_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("publisher.publisher_name")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ""} // Ensure value is always a string
                    />
                  </FormControl>
                  <FormMessage /> {/* Display validation errors */}
                </FormItem>
              )}
            />

            {/* Country Field */}
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("publisher.country")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ""} // Ensure value is always a string
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