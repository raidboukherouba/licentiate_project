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

// Define Team type
interface Team {
  team_id: number;
  team_name: string;
  team_abbr?: string | null;
  team_desc?: string | null;
}

interface EditTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (
    name: string,
    abbr?: string,
    desc?: string
  ) => void; // Accept team details
  selectedTeam: Team | null; // Pass the selected team
}

export function EditTeamModal({ isOpen, onClose, onEdit, selectedTeam }: EditTeamModalProps) {
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof teamSchema>>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      team_name: selectedTeam?.team_name || "", // Initialize with the selected team's name
      team_abbr: selectedTeam?.team_abbr || "", // Initialize with the selected team's abbreviation
      team_desc: selectedTeam?.team_desc || "", // Initialize with the selected team's description
    },
  });

  // Reset the form when the modal is opened or the selected team changes
  useEffect(() => {
    if (isOpen && selectedTeam) {
      form.reset({
        team_name: selectedTeam.team_name,
        team_abbr: selectedTeam.team_abbr || "",
        team_desc: selectedTeam.team_desc || "",
      });
    }
  }, [isOpen, selectedTeam, form]);

  const handleEdit = (values: z.infer<typeof teamSchema>) => {
    if (selectedTeam) {
      onEdit(
        values.team_name,
        values.team_abbr || undefined,
        values.team_desc || undefined
      ); // Pass the validated team details
      onClose(); // Close the modal
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("team.edit_title")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleEdit)} className="space-y-4">
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
                {t("global.save")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}