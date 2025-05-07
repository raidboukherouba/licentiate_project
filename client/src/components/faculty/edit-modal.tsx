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
import { facultySchema } from "../../validations/faculty-schema"; 
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { useEffect } from "react";

// Define Faculty type
interface Faculty {
  faculty_id: number;
  faculty_name: string;
}

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (name: string) => void; // Accept the faculty name
  selectedFaculty: Faculty | null; // Pass the selected faculty
}

export function EditModal({ isOpen, onClose, onEdit, selectedFaculty }: EditModalProps) {
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof facultySchema>>({
    resolver: zodResolver(facultySchema),
    defaultValues: {
      faculty_name: selectedFaculty?.faculty_name || "", // Initialize with the selected faculty's name
    },
  });

  // Reset the form when the modal is opened or the selected faculty changes
  useEffect(() => {
    if (isOpen && selectedFaculty) {
      form.reset({ faculty_name: selectedFaculty.faculty_name });
    }
  }, [isOpen, selectedFaculty, form]);

  const handleEdit = (values: z.infer<typeof facultySchema>) => {
    if(selectedFaculty){
      onEdit(values.faculty_name); // Pass the validated faculty name
      onClose(); // Close the modal
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("faculty.edit_title")}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          
        </DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleEdit)} className="space-y-4">
            <FormField
              control={form.control}
              name="faculty_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("faculty.faculty_name")}</FormLabel>
                  <FormControl>
                    <Textarea
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