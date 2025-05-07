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

// Define Publisher type
interface Publisher {
  publisher_id: number;
  publisher_name: string;
  country?: string | null;
}

interface EditPublisherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (name: string, country?: string) => void; // Accept publisher name and optional country
  selectedPublisher: Publisher | null; // Pass the selected publisher
}

export function EditPublisherModal({ isOpen, onClose, onEdit, selectedPublisher }: EditPublisherModalProps) {
  const { t } = useTranslation();

  // Initialize the form with zodResolver and default values
  const form = useForm<z.infer<typeof publisherSchema>>({
    resolver: zodResolver(publisherSchema),
    defaultValues: {
      publisher_name: selectedPublisher?.publisher_name || "", // Initialize with the selected publisher's name
      country: selectedPublisher?.country || "", // Initialize with the selected publisher's country
    },
  });

  // Reset the form when the modal is opened or the selected publisher changes
  useEffect(() => {
    if (isOpen && selectedPublisher) {
      form.reset({
        publisher_name: selectedPublisher.publisher_name,
        country: selectedPublisher.country || "",
      });
    }
  }, [isOpen, selectedPublisher, form]);

  // Handle form submission
  const handleEdit = (values: z.infer<typeof publisherSchema>) => {
    if (selectedPublisher) {
      onEdit(values.publisher_name, values.country || undefined); // Pass the validated publisher name and country
      onClose(); // Close the modal
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("publisher.edit_title")}</DialogTitle>
        </DialogHeader>
        {/* <DialogDescription>
          {t("publisher.edit_description")}
        </DialogDescription> */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleEdit)} className="space-y-4">
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
                {t("global.save")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}