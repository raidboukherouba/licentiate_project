import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { CircleCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { teamSchema } from "../../validations/team-schema"; // Import your team schema
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { useEffect } from "react";

interface AddTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, abbr?: string, desc?: string) => void;
}

export function AddTeamModal({ isOpen, onClose, onAdd }: AddTeamModalProps) {
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof teamSchema>>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      team_name: "",
      team_abbr: "",
      team_desc: "",
    },
  });

  // Reset the form when the modal is opened
  useEffect(() => {
    if (isOpen) {
      form.reset({
        team_name: "",
        team_abbr: "",
        team_desc: "",
      });
    }
  }, [isOpen, form]);

  const handleAdd = (values: z.infer<typeof teamSchema>) => {
    onAdd(
      values.team_name,
      values.team_abbr || undefined,
      values.team_desc || undefined,
    );
    onClose(); // Close the modal
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("team.add_title")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAdd)} className="space-y-4">
            {/* Team Name Field */}
            <FormField
              control={form.control}
              name="team_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("team.team_name")}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value || ""} // Ensure value is always a string
                    />
                  </FormControl>
                  <FormMessage /> {/* Display validation errors */}
                </FormItem>
              )}
            />

            {/* Team Abbreviation Field */}
            <FormField
              control={form.control}
              name="team_abbr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("team.team_abbr")}</FormLabel>
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

            {/* Team Description Field */}
            <FormField
              control={form.control}
              name="team_desc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("team.team_desc")}</FormLabel>
                  <FormControl>
                    <Textarea
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