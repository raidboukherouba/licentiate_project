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

// Define Supervise type
interface Supervise {
  res_code: number;
  reg_num: number;
  super_start_date: string;
  super_end_date?: string | null;
  super_theme: string;
  Researcher?: {
    res_fname: string;
    res_lname: string;
    res_prof_email: string;
    lab_code: number;
    laboratory?: {
      lab_name: string;
    };
  };
  DoctoralStudent?: {
    doc_stud_fname: string;
    doc_stud_lname: string;
    doc_stud_prof_email: string;
  };
}

// Define Props type
interface SuperviseTableProps {
  supervises: Supervise[];
  currentPage: number;
  itemsPerPage: number;
  openDeleteModal: (supervise: Supervise) => void;
  toggleSort: (column: string) => void;
  visibleColumns: Record<string, boolean>;
}

export default function SuperviseTable({
  supervises,
  currentPage,
  itemsPerPage,
  openDeleteModal,
  toggleSort,
  visibleColumns,
}: SuperviseTableProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Format date for display
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Navigate to edit supervise page
  const navigateToEditSupervisePage = (resCode: number, regNum: number) => {
    navigate(`/personnel-management/supervise/edit-supervise/${resCode}/${regNum}`);
  };

  // Navigate to supervise details page
  const navigateToSuperviseDetailPage = (resCode: number, regNum: number) => {
    navigate(`/personnel-management/supervise/${resCode}/${regNum}`);
  };

  return (
    <Table>
      <TableHeader className="bg-muted/50">
        <TableRow>
          <TableHead className="w-[100px]">N°</TableHead>
          <TableHead>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleSort('res_code')}>
              <ArrowUpDown className="w-3 h-3" />
              {t("supervise.researcher")}
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleSort('reg_num')}>
              <ArrowUpDown className="w-3 h-3" />
              {t("supervise.doctoral_student")}
            </div>
          </TableHead>
          {visibleColumns.super_theme && (
            <TableHead>
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleSort('super_theme')}>
                <ArrowUpDown className="w-3 h-3" />
                {t("supervise.super_theme")}
              </div>
            </TableHead>
          )}
          {visibleColumns.super_start_date && (
            <TableHead>
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleSort('super_start_date')}>
                <ArrowUpDown className="w-3 h-3" />
                {t("supervise.super_start_date")}
              </div>
            </TableHead>
          )}
          {visibleColumns.super_end_date && (
            <TableHead>
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleSort('super_end_date')}>
                <ArrowUpDown className="w-3 h-3" />
                {t("supervise.super_end_date")}
              </div>
            </TableHead>
          )}
          <TableHead className="text-center">{t("global.actions")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {supervises.map((supervise, index) => (
          <TableRow key={`${supervise.res_code}-${supervise.reg_num}`}>
            <TableCell className="font-medium">
              {(currentPage - 1) * itemsPerPage + index + 1}
            </TableCell>
            <TableCell>
              {supervise.Researcher 
                ? `${supervise.Researcher.res_fname} ${supervise.Researcher.res_lname}`
                : `Researcher #${supervise.res_code}`}
            </TableCell>
            <TableCell>
              {supervise.DoctoralStudent
                ? `${supervise.DoctoralStudent.doc_stud_fname} ${supervise.DoctoralStudent.doc_stud_lname}`
                : `Student #${supervise.reg_num}`}
            </TableCell>
            {visibleColumns.super_theme && (
              <TableCell className="max-w-[200px] truncate">
                {supervise.super_theme}
              </TableCell>
            )}
            {visibleColumns.super_start_date && (
              <TableCell>
                {formatDate(supervise.super_start_date)}
              </TableCell>
            )}
            {visibleColumns.super_end_date && (
              <TableCell className={!supervise.super_end_date ? "text-red-500" : ""}>
                {formatDate(supervise.super_end_date) || "Ongoing"}
              </TableCell>
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
                    onClick={() => navigateToSuperviseDetailPage(supervise.res_code, supervise.reg_num)}
                    className="cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Eye className="h-3 w-3" />
                      {t("global.details")}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigateToEditSupervisePage(supervise.res_code, supervise.reg_num)}
                    className="cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Pencil className="h-3 w-3" />
                      {t("global.edit")}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => openDeleteModal(supervise)}
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