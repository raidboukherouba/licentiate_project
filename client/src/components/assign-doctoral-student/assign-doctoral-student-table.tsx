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

// Define AssignDoctoralStudent type
interface AssignDoctoralStudent {
  reg_num: number;
  inventory_num: string;
  doc_stud_assign_date: string;
  doc_stud_return_date?: string | null;
  DoctoralStudent?: {
    doc_stud_fname: string;
    doc_stud_lname: string;
    doc_stud_email: string;
    lab_code: number;
    laboratory?: {
      lab_name: string;
    };
  };
  Equipment?: {
    equip_name: string;
    inventory_num: string;
  };
}

// Define Props type
interface AssignDoctoralStudentTableProps {
  assignments: AssignDoctoralStudent[];
  currentPage: number;
  itemsPerPage: number;
  openDeleteModal: (assignment: AssignDoctoralStudent) => void;
  toggleSort: (column: string) => void;
  visibleColumns: Record<string, boolean>;
}

export default function AssignDoctoralStudentTable({
  assignments,
  currentPage,
  itemsPerPage,
  openDeleteModal,
  toggleSort,
  visibleColumns,
}: AssignDoctoralStudentTableProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Format date for display
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Navigate to edit assignment page
  const navigateToEditAssignmentPage = (regNum: number, inventoryNum: string) => {
    navigate(`/equipment-management/assign-doctoral-student/edit-assignment/${regNum}/${inventoryNum}`);
  };

  // Navigate to assignment details page
  const navigateToAssignmentDetailPage = (regNum: number, inventoryNum: string) => {
    navigate(`/equipment-management/assign-doctoral-student/${regNum}/${inventoryNum}`);
  };

  return (
    <Table>
      <TableHeader className="bg-muted/50">
        <TableRow>
          <TableHead className="w-[100px]">N°</TableHead>
          <TableHead>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleSort('reg_num')}>
              <ArrowUpDown className="w-3 h-3" />
              {t("assignDoctoralStudent.doctoral_student")}
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleSort('inventory_num')}>
              <ArrowUpDown className="w-3 h-3" />
              {t("assignDoctoralStudent.equipment")}
            </div>
          </TableHead>
          {visibleColumns.doc_stud_assign_date && (
            <TableHead>
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleSort('doc_stud_assign_date')}>
                <ArrowUpDown className="w-3 h-3" />
                {t("assignDoctoralStudent.doc_stud_assign_date")}
              </div>
            </TableHead>
          )}
          {visibleColumns.doc_stud_return_date && (
            <TableHead>
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleSort('doc_stud_return_date')}>
                <ArrowUpDown className="w-3 h-3" />
                {t("assignDoctoralStudent.doc_stud_return_date")}
              </div>
            </TableHead>
          )}
          <TableHead className="text-center">{t("global.actions")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assignments.map((assignment, index) => (
          <TableRow key={`${assignment.reg_num}-${assignment.inventory_num}`}>
            <TableCell className="font-medium">
              {(currentPage - 1) * itemsPerPage + index + 1}
            </TableCell>
            <TableCell>
              {assignment.DoctoralStudent 
                ? `${assignment.DoctoralStudent.doc_stud_fname} ${assignment.DoctoralStudent.doc_stud_lname}`
                : `Student #${assignment.reg_num}`}
            </TableCell>
            <TableCell>
              {assignment.Equipment
                ? `${assignment.Equipment.equip_name} (${assignment.inventory_num})`
                : `Equipment #${assignment.inventory_num}`}
            </TableCell>
            {visibleColumns.doc_stud_assign_date && (
              <TableCell>
                {formatDate(assignment.doc_stud_assign_date)}
              </TableCell>
            )}
            {visibleColumns.doc_stud_return_date && (
              <TableCell className={!assignment.doc_stud_return_date ? "text-red-500" : ""}>
                {formatDate(assignment.doc_stud_return_date) || "Not Returned"}
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
                    onClick={() => navigateToAssignmentDetailPage(assignment.reg_num, assignment.inventory_num)}
                    className="cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Eye className="h-3 w-3" />
                      {t("global.details")}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigateToEditAssignmentPage(assignment.reg_num, assignment.inventory_num)}
                    className="cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Pencil className="h-3 w-3" />
                      {t("global.edit")}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => openDeleteModal(assignment)}
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