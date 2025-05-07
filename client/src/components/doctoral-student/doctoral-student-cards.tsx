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
interface DoctoralStudentCardsProps {
  doctoralStudents: DoctoralStudent[];
  currentPage: number;
  itemsPerPage: number;
  openDeleteModal: (doctoralStudent: DoctoralStudent) => void;
}

export default function DoctoralStudentCards({
  doctoralStudents,
  currentPage,
  itemsPerPage,
  openDeleteModal,
}: DoctoralStudentCardsProps) {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {doctoralStudents.map((doctoralStudent, index) => (
        <Card key={doctoralStudent.reg_num} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardDescription>N° {(currentPage - 1) * itemsPerPage + index + 1}</CardDescription>
            <CardTitle className="text-lg">
              <span className="text-muted-foreground capitalize">
                {doctoralStudent.doc_stud_gender.toLowerCase()}.
              </span>
              <span> {doctoralStudent.doc_stud_fname} {doctoralStudent.doc_stud_lname}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm">
              <p className="font-medium">{doctoralStudent.doc_stud_prof_email}</p>
              {doctoralStudent.doc_stud_phone && (
                <p className="text-muted-foreground">{doctoralStudent.doc_stud_phone}</p>
              )}
            </div>
            
            <div className="text-sm space-y-1">
              {doctoralStudent.function?.func_name && (
                <p className="text-muted-foreground">
                  <span className="font-medium">{t('doctoralStudent.function')}:</span> {doctoralStudent.function?.func_name}
                </p>
              )}
              {doctoralStudent.doc_stud_grade && (
                <p className="text-muted-foreground">
                  <span className="font-medium">{t('doctoralStudent.doc_stud_grade')}:</span> {doctoralStudent.doc_stud_grade}
                </p>
              )}
            </div>
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
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}