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
import { format } from 'date-fns';

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
interface SuperviseCardsProps {
  supervises: Supervise[];
  currentPage: number;
  itemsPerPage: number;
  openDeleteModal: (supervise: Supervise) => void;
}

export default function SuperviseCards({
  supervises,
  currentPage,
  itemsPerPage,
  openDeleteModal,
}: SuperviseCardsProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Format date for display
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return t('supervise.ongoing');
    return format(new Date(dateString), 'PP');
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {supervises.map((supervise, index) => (
        <Card 
          key={`${supervise.res_code}-${supervise.reg_num}`} 
          className="hover:shadow-lg transition-shadow flex flex-col h-full"
        >
          <CardHeader>
            <CardDescription>N° {(currentPage - 1) * itemsPerPage + index + 1}</CardDescription>
            <CardTitle className="text-lg line-clamp-2">
              {supervise.super_theme}
            </CardTitle>
            <CardDescription className="text-sm">
              {supervise.Researcher 
                ? `${supervise.Researcher.res_fname} ${supervise.Researcher.res_lname}`
                : `Researcher #${supervise.res_code}`}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex-grow">
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium">{t('supervise.doctoral_student')}</p>
                <p className="text-sm text-muted-foreground">
                  {supervise.DoctoralStudent
                    ? `${supervise.DoctoralStudent.doc_stud_fname} ${supervise.DoctoralStudent.doc_stud_lname}`
                    : `Student #${supervise.reg_num}`}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium">{t('supervise.period')}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(supervise.super_start_date)} - {formatDate(supervise.super_end_date)}
                </p>
              </div>
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
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}