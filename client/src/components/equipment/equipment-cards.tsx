import { useTranslation } from 'react-i18next';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { MoreVertical, Pencil, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

// Define Equipment type
interface Equipment {
  inventory_num: string;
  equip_name: string;
  equip_desc?: string | null;
  acq_date?: string | null;
  purchase_price?: number | null;
  equip_status?: string | null;
  equip_quantity?: number | null;
  lab_code: number;
  laboratory?: {
    lab_name: string;
  };
}

// Define Props type
interface EquipmentCardsProps {
  equipments: Equipment[];
  currentPage: number;
  itemsPerPage: number;
  openDeleteModal: (equipment: Equipment) => void;
}

export default function EquipmentCards({
  equipments,
  currentPage,
  itemsPerPage,
  openDeleteModal,
}: EquipmentCardsProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Format date for display
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Format price for display
  const formatPrice = (price?: number | null) => {
    if (price === null || price === undefined) return "N/A";
    return new Intl.NumberFormat('fr-DZ', { // 'fr-DZ' for French (Algeria) locale
      style: 'currency',
      currency: 'DZD',
    }).format(price);
  };

  const navigateToEditEquipmentPage = (inventoryNum: string) => {
    navigate(`/equipment-management/equipment-inventory/edit-equipment/${inventoryNum}`);
  };

  const navigateToEquipmentDetailPage = (inventoryNum: string) => {
    navigate(`/equipment-management/equipment-inventory/${inventoryNum}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {equipments.map((equipment, index) => (
        <Card key={equipment.inventory_num} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardDescription>N° {(currentPage - 1) * itemsPerPage + index + 1}</CardDescription>
            <CardTitle className="text-lg">{equipment.equip_name}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {equipment.inventory_num}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {equipment.equip_status && (
              <p className="text-sm">
                <span className="font-medium">{t("equipment.status")}:</span> {equipment.equip_status}
              </p>
            )}
            {equipment.acq_date && (
              <p className="text-sm">
                <span className="font-medium">{t("equipment.acq_date")}:</span> {formatDate(equipment.acq_date)}
              </p>
            )}
            {equipment.purchase_price && (
              <p className="text-sm">
                <span className="font-medium">{t("equipment.purchase_price")}:</span> {formatPrice(equipment.purchase_price)}
              </p>
            )}
            {equipment.equip_desc && (
              <p className="text-sm">
                <span className="font-medium">{t("equipment.description")}:</span> {equipment.equip_desc}
              </p>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                  onClick={() => navigateToEquipmentDetailPage(equipment.inventory_num)}
                  className="cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Eye className="h-3 w-3" />
                    {t("global.details")}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigateToEditEquipmentPage(equipment.inventory_num)}
                  className="cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Pencil className="h-3 w-3" />
                    {t("global.edit")}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => openDeleteModal(equipment)}
                  className="cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Trash2 className="h-3 w-3" />
                    {t("global.delete")}
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}