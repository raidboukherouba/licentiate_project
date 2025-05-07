import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { CircleX } from "lucide-react";

interface DeleteAssignResearcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void; // Callback for delete action
}

export function DeleteAssignResearcherModal({ isOpen, onClose, onDelete }: DeleteAssignResearcherModalProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("assignResearcher.delete_title")}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {t("assignResearcher.delete_confirmation")}
        </DialogDescription>
        <DialogFooter>
          <Button size="sm" variant="outline" onClick={onClose}>
            {t("global.cancel")}
          </Button>
          <Button size="sm" variant="destructive" onClick={onDelete}>
            <CircleX className="w-4 h-4" />
            {t("global.delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}