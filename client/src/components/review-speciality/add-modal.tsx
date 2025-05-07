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
import { reviewSpecialitySchema } from "../../validations/review-speciality-schema"; // Import the review speciality schema
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { useEffect } from "react";

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string) => void; // Accept the review speciality name
}

export function AddModal({ isOpen, onClose, onAdd }: AddModalProps) {
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof reviewSpecialitySchema>>({
    resolver: zodResolver(reviewSpecialitySchema),
    defaultValues: {
      spec_name_review: "", // Initialize with an empty string
    },
  });

  // Reset the form when the modal is opened
  useEffect(() => {
    if (isOpen) {
      form.reset({ spec_name_review: "" });
    }
  }, [isOpen, form]);

  const handleAdd = (values: z.infer<typeof reviewSpecialitySchema>) => {
    onAdd(values.spec_name_review); // Pass the validated review speciality name
    onClose(); // Close the modal
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("reviewSpeciality.add_title")}</DialogTitle>
        </DialogHeader>
        {/* <DialogDescription>
          {t("reviewSpeciality.add_description")}
        </DialogDescription> */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAdd)} className="space-y-4">
            <FormField
              control={form.control}
              name="spec_name_review"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("reviewSpeciality.spec_name_review")}</FormLabel>
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