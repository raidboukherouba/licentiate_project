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
import { specialitySchema } from "../../validations/speciality-schema"; // Import the speciality schema
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { useEffect } from "react";

// Define Speciality type
interface Speciality {
  spec_code: number;
  spec_name: string;
}

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (name: string) => void; // Accept the speciality name
  selectedSpeciality: Speciality | null; // Pass the selected speciality
}

export function EditModal({ isOpen, onClose, onEdit, selectedSpeciality }: EditModalProps) {
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof specialitySchema>>({
    resolver: zodResolver(specialitySchema),
    defaultValues: {
      spec_name: selectedSpeciality?.spec_name || "", // Initialize with the selected speciality's name
    },
  });

  // Reset the form when the modal is opened or the selected speciality changes
  useEffect(() => {
    if (isOpen && selectedSpeciality) {
      form.reset({ spec_name: selectedSpeciality.spec_name });
    }
  }, [isOpen, selectedSpeciality, form]);

  const handleEdit = (values: z.infer<typeof specialitySchema>) => {
    if (selectedSpeciality) {
      onEdit(values.spec_name); // Pass the validated speciality name
      onClose(); // Close the modal
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("speciality.edit_title")}</DialogTitle>
        </DialogHeader>
        {/* <DialogDescription>
          {t("speciality.edit_description")}
        </DialogDescription> */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleEdit)} className="space-y-4">
            <FormField
              control={form.control}
              name="spec_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("speciality.spec_name")}</FormLabel>
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
                {t("global.save")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}