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

// Define Researcher type
interface Researcher {
  res_code: number;
  res_fname: string;
  res_lname: string;
  res_fname_ar: string;
  res_lname_ar: string;
  res_gender: 'Male' | 'Female';
  res_prof_email: string;
  res_grade?: string | null;
  res_phone?: string | null;
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
interface ResearcherCardsProps {
  researchers: Researcher[];
  currentPage: number;
  itemsPerPage: number;
  openDeleteModal: (researcher: Researcher) => void;
}

export default function ResearcherCards({
  researchers,
  currentPage,
  itemsPerPage,
  openDeleteModal,
}: ResearcherCardsProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Navigate to the Edit Researcher page
  const navigateToEditResearcherPage = (resCode: number) => {
    navigate(`/personnel-management/researchers/edit-researcher/${resCode}`);
  };

  // Navigate to the Researcher Detail page
  const navigateToResearcherDetailPage = (resCode: number) => {
    navigate(`/personnel-management/researchers/${resCode}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {researchers.map((researcher, index) => (
        <Card key={researcher.res_code} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardDescription>N° {(currentPage - 1) * itemsPerPage + index + 1}</CardDescription>
            <CardTitle className="text-lg">
              <span className="text-muted-foreground capitalize">
                {researcher.res_gender.toLowerCase()}.
              </span>
              <span> {researcher.res_fname} {researcher.res_lname}</span>
              
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm">
              <p className="font-medium">{researcher.res_prof_email}</p>
              {researcher.res_phone && (
                <p className="text-muted-foreground">{researcher.res_phone}</p>
              )}
            </div>
            
            <div className="text-sm space-y-1">
              {researcher.function?.func_name && (
                <p className="text-muted-foreground">
                  <span className="font-medium">{t('researcher.function')}:</span> {researcher.function?.func_name}
                </p>
              )}
              {researcher.res_grade && (
                <p className="text-muted-foreground">
                  <span className="font-medium">{t('researcher.res_grade')}:</span> {researcher.res_grade}
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
                  onClick={() => navigateToResearcherDetailPage(researcher.res_code)}
                  className="cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Eye className="h-3 w-3" />
                    {t("global.details")}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigateToEditResearcherPage(researcher.res_code)}
                  className="cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Pencil className="h-3 w-3" />
                    {t("global.edit")}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => openDeleteModal(researcher)}
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