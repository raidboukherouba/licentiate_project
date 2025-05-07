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

// Define DoctoralStudent type
interface DoctoralStudent {
  reg_num: number;
  doc_stud_fname: string;
  doc_stud_lname: string;
  doc_stud_fname_ar: string;
  doc_stud_lname_ar: string;
  doc_stud_gender: 'Male' | 'Female';
  doc_stud_prof_email: string;
  doc_stud_grade?: string | null;
  doc_stud_phone?: string | null;
  team_id: number;
  team?: {
    team_name: string;
  };
  function?: {
    func_name: string;
  };
  speciality?: {
    spec_name: string;
  };
  laboratory?: {
    lab_name: string;
  };
}

// Define Props type
interface DoctoralStudentTableProps {
  doctoralStudents: DoctoralStudent[];
  currentPage: number;
  itemsPerPage: number;
  openDeleteModal: (doctoralStudent: DoctoralStudent) => void;
  toggleSort: (column: string) => void;
  visibleColumns: Record<string, boolean>;
}

export default function DoctoralStudentTable({
  doctoralStudents,
  currentPage,
  itemsPerPage,
  openDeleteModal,
  toggleSort,
  visibleColumns,
}: DoctoralStudentTableProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Navigate to the Edit Doctoral Student page
  const navigateToEditDoctoralStudentPage = (regNum: number) => {
    navigate(`/personnel-management/doctoral-students/edit-doctoral-student/${regNum}`);
  };

  // Navigate to the Doctoral Student Detail page
  const navigateToDoctoralStudentDetailPage = (regNum: number) => {
    navigate(`/personnel-management/doctoral-students/${regNum}`);
  };

  return (
    <>
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[100px]">N°</TableHead>
            <TableHead>
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleSort('doc_stud_fname')}>
                <ArrowUpDown className="w-3 h-3" size={20} strokeWidth={2} />
                {t("doctoralStudent.name")}
              </div>
            </TableHead>
            {visibleColumns.doc_stud_prof_email && (
              <TableHead>
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleSort('doc_stud_prof_email')}>
                  <ArrowUpDown className="w-3 h-3" size={20} strokeWidth={2} />
                  {t("doctoralStudent.doc_stud_prof_email")}
                </div>
              </TableHead>
            )}
            {visibleColumns.func_name && (
              <TableHead>
                <div className="flex items-center gap-2">
                  {t("doctoralStudent.function")}
                </div>
              </TableHead>
            )}
            {visibleColumns.doc_stud_grade && (
              <TableHead>
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleSort('doc_stud_grade')}>
                  <ArrowUpDown className="w-3 h-3" size={20} strokeWidth={2} />
                  {t("doctoralStudent.doc_stud_grade")}
                </div>
              </TableHead>
            )}
            {visibleColumns.doc_stud_phone && (
              <TableHead>
                <div className="flex items-center gap-2">
                  {t("doctoralStudent.doc_stud_phone")}
                </div>
              </TableHead>
            )}
            <TableHead className="text-center">{t("global.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {doctoralStudents.map((doctoralStudent, index) => (
            <TableRow key={doctoralStudent.reg_num}>
              <TableCell className="font-medium">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
              <TableCell>{`${doctoralStudent.doc_stud_fname} ${doctoralStudent.doc_stud_lname}`}</TableCell>
              
              {visibleColumns.doc_stud_prof_email && (
                <TableCell>{doctoralStudent.doc_stud_prof_email}</TableCell>
              )}

              {visibleColumns.func_name && (
                <TableCell>{doctoralStudent.function?.func_name || "N/A"}</TableCell>
              )}

              {visibleColumns.doc_stud_grade && (
                <TableCell className={doctoralStudent.doc_stud_grade ? "" : "text-red-500"}>
                  {doctoralStudent.doc_stud_grade || "N/A"}
                </TableCell>
              )}
              
              {visibleColumns.doc_stud_phone && (
                <TableCell className={doctoralStudent.doc_stud_phone ? "" : "text-red-500"}>
                  {doctoralStudent.doc_stud_phone || "N/A"}
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
                      onClick={() => navigateToDoctoralStudentDetailPage(doctoralStudent.reg_num)}
                      className="cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Eye className="h-3 w-3" />
                        {t("global.details")}
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigateToEditDoctoralStudentPage(doctoralStudent.reg_num)}
                      className="cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Pencil className="h-3 w-3" />
                        {t("global.edit")}
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => openDeleteModal(doctoralStudent)}
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