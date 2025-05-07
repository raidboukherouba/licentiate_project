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

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export function DeleteModal({ isOpen, onClose, onDelete }: DeleteModalProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("category.delete_title")}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {t("category.delete_confirmation")}
        </DialogDescription>
        <DialogFooter>
          <Button size="sm" variant="primary" onClick={onClose}>{t("global.cancel")}</Button>
          <Button size="sm" variant="destructive" onClick={onDelete}>
            <CircleX className="w-4 h-4"/>
            {t("global.delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}