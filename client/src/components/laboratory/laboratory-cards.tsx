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
interface LaboratoryCardsProps {
  laboratories: Laboratory[];
  currentPage: number;
  itemsPerPage: number;
  openDeleteModal: (laboratory: Laboratory) => void;
}

export default function LaboratoryCards({
  laboratories,
  currentPage,
  itemsPerPage,
  openDeleteModal,
}: LaboratoryCardsProps) {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {laboratories.map((laboratory, index) => (
        <Card key={laboratory.lab_code} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardDescription>N° {(currentPage - 1) * itemsPerPage + index + 1}</CardDescription>
            <CardTitle className="text-lg">{laboratory.lab_name}</CardTitle>
            {laboratory.lab_abbr && (
              <CardDescription className="text-sm text-muted-foreground">
                {laboratory.lab_abbr}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {laboratory.lab_desc && (
              <p className="text-sm text-muted-foreground">
                {laboratory.lab_desc}
              </p>
            )}
            {laboratory.lab_address && (
              <p className="text-sm text-muted-foreground">
                {laboratory.lab_address}
              </p>
            )}
            {laboratory.lab_phone && (
              <p className="text-sm text-muted-foreground">
                {laboratory.lab_phone}
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
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}