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
// Define Laboratory type
interface Laboratory {
  lab_code: number;
  lab_name: string;
  lab_abbr?: string | null;
  lab_desc?: string | null;
  lab_address?: string | null;
  lab_phone?: string | null;
  faculty_id: number;
  domain_id: number;
  dept_id: number;
}

// Define Props type
interface LaboratoryTableProps {
  laboratories: Laboratory[];
  currentPage: number;
  itemsPerPage: number;
  openDeleteModal: (laboratory: Laboratory) => void;
  toggleSort: (column: string) => void; // Callback for sorting
}

export default function LaboratoryTable({
  laboratories,
  currentPage,
  itemsPerPage,
  openDeleteModal,
  toggleSort,
  visibleColumns, // Add visibleColumns prop
}: LaboratoryTableProps & { visibleColumns: Record<string, boolean> }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Navigate to the Add Laboratory page
  const navigateToEditLaboratoryPage = (labCode: number) => {
    navigate(`/organizational-structure/laboratories/edit-laboratory/${labCode}`);
  };

  // Navigate to the Laboratory Detail page
  const navigateToLaboratoryDetailPage = (labCode: number) => {
    navigate(`/organizational-structure/laboratories/${labCode}`);
  };

  return (
    <>
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[100px]">N°</TableHead>
            <TableHead>
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleSort('lab_name')}>
                <ArrowUpDown className="w-3 h-3" size={20} strokeWidth={2} />
                {t("laboratory.lab_name")}
              </div>
            </TableHead>
            {visibleColumns.lab_abbr && (
              <TableHead>
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleSort('lab_abbr')}>
                  <ArrowUpDown className="w-3 h-3" size={20} strokeWidth={2} />
                  {t("laboratory.lab_abbr")}
                </div>
              </TableHead>
            )}
            {visibleColumns.lab_phone && (
              <TableHead>
                <div className="flex items-center gap-2">
                  {t("laboratory.lab_phone")}
                </div>
              </TableHead>
            )}
            <TableHead className="text-center">{t("global.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {laboratories.map((laboratory, index) => (
            <TableRow key={laboratory.lab_code}>
              <TableCell className="font-medium">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
              <TableCell>{laboratory.lab_name}</TableCell>
              {visibleColumns.lab_abbr && (
                <TableCell className={laboratory.lab_abbr ? "" : "text-red-500"}>
                  {laboratory.lab_abbr || "N/A"}
                </TableCell>
              )}
              {visibleColumns.lab_phone && <TableCell>{laboratory.lab_phone || "N/A"}</TableCell>}
              
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-4 w-4 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem
                        onClick={() => navigateToLaboratoryDetailPage(laboratory.lab_code)}
                        className="cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Eye className="h-3 w-3" />
                          {t("global.details")}
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigateToEditLaboratoryPage(laboratory.lab_code)}
                        className="cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Pencil className="h-3 w-3" />
                          {t("global.edit")}
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => openDeleteModal(laboratory)}
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
    </>
  );
}