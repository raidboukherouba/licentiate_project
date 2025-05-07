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
import { domainSchema } from "../../validations/domain-schema"; // Import your domain schema
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { useEffect } from "react";

interface AddDomainModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, abbr?: string) => void; // Accept domain name and optional abbreviation
}

export function AddDomainModal({ isOpen, onClose, onAdd }: AddDomainModalProps) {
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof domainSchema>>({
    resolver: zodResolver(domainSchema),
    defaultValues: {
      domain_name: "", // Initialize with an empty string
      domain_abbr: "", // Initialize with an empty string
    },
  });

  // Reset the form when the modal is opened
  useEffect(() => {
    if (isOpen) {
      form.reset({ domain_name: "", domain_abbr: "" });
    }
  }, [isOpen, form]);

  const handleAdd = (values: z.infer<typeof domainSchema>) => {
    onAdd(values.domain_name, values.domain_abbr || undefined); // Pass the validated domain name and abbreviation
    onClose(); // Close the modal
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("domain.add_title")}</DialogTitle>
        </DialogHeader>
        {/* <DialogDescription>
          {t("domain.add_description")}
        </DialogDescription> */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAdd)} className="space-y-4">
            {/* Domain Name Field */}
            <FormField
              control={form.control}
              name="domain_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("domain.domain_name")}</FormLabel>
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

            {/* Domain Abbreviation Field */}
            <FormField
              control={form.control}
              name="domain_abbr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("domain.domain_abbr")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("domain.domain_abbr")}
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