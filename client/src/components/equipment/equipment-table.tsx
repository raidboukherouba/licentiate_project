import { useTranslation } from 'react-i18next';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { MoreVertical, Pencil, Trash2, ArrowUpDown, Eye } from "lucide-react";
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
interface EquipmentTableProps {
  equipments: Equipment[];
  currentPage: number;
  itemsPerPage: number;
  openDeleteModal: (equipment: Equipment) => void;
  toggleSort: (column: string) => void;
  visibleColumns: Record<string, boolean>;
}

export default function EquipmentTable({
  equipments,
  currentPage,
  itemsPerPage,
  openDeleteModal,
  toggleSort,
  visibleColumns,
}: EquipmentTableProps) {
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
    <Table>
      <TableHeader className="bg-muted/50">
        <TableRow>
          <TableHead className="w-[100px]">N°</TableHead>
          <TableHead>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleSort('inventory_num')}>
              <ArrowUpDown className="w-3 h-3" size={20} strokeWidth={2} />
              {t("equipment.inventory_num")}
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleSort('equip_name')}>
              <ArrowUpDown className="w-3 h-3" size={20} strokeWidth={2} />
              {t("equipment.equip_name")}
            </div>
          </TableHead>
          {visibleColumns.equip_status && (
            <TableHead>
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleSort('equip_status')}>
                <ArrowUpDown className="w-3 h-3" size={20} strokeWidth={2} />
                {t("equipment.status")}
              </div>
            </TableHead>
          )}
          {visibleColumns.acq_date && (
            <TableHead>
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleSort('acq_date')}>
                <ArrowUpDown className="w-3 h-3" size={20} strokeWidth={2} />
                {t("equipment.acq_date")}
              </div>
            </TableHead>
          )}
          {visibleColumns.purchase_price && (
            <TableHead>
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleSort('purchase_price')}>
                <ArrowUpDown className="w-3 h-3" size={20} strokeWidth={2} />
                {t("equipment.purchase_price")}
              </div>
            </TableHead>
          )}
          <TableHead className="text-center">{t("global.actions")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {equipments.map((equipment, index) => (
          <TableRow key={equipment.inventory_num}>
            <TableCell className="font-medium">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
            <TableCell>{equipment.inventory_num}</TableCell>
            <TableCell>{equipment.equip_name}</TableCell>
            {visibleColumns.equip_status && (
              <TableCell>{equipment.equip_status || "N/A"}</TableCell>
            )}
            {visibleColumns.acq_date && (
              <TableCell>{formatDate(equipment.acq_date)}</TableCell>
            )}
            {visibleColumns.purchase_price && (
              <TableCell>{formatPrice(equipment.purchase_price)}</TableCell>
            )}
            <TableCell className="text-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-4 w-4 p-0">
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
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}