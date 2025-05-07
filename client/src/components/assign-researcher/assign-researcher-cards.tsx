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

// Define AssignResearcher type
interface AssignResearcher {
  res_code: number;
  inventory_num: string;
  res_assign_date: string;
  res_return_date?: string | null;
  Researcher?: {
    res_fname: string;
    res_lname: string;
    res_prof_email: string;
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
interface AssignResearcherCardsProps {
  assignments: AssignResearcher[];
  currentPage: number;
  itemsPerPage: number;
  openDeleteModal: (assignment: AssignResearcher) => void;
}

export default function AssignResearcherCards({
  assignments,
  currentPage,
  itemsPerPage,
  openDeleteModal,
}: AssignResearcherCardsProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Format date for display
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return t('assignResearcher.not_returned');
    return format(new Date(dateString), 'PP');
  };

  // Navigate to edit assignment page
  const navigateToEditAssignmentPage = (resCode: number, inventoryNum: string) => {
    navigate(`/equipment-management/assign-researcher/edit-assignment/${resCode}/${inventoryNum}`);
  };

  // Navigate to assignment details page
  const navigateToAssignmentDetailPage = (resCode: number, inventoryNum: string) => {
    navigate(`/equipment-management/assign-researcher/${resCode}/${inventoryNum}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {assignments.map((assignment, index) => (
        <Card 
          key={`${assignment.res_code}-${assignment.inventory_num}`} 
          className="hover:shadow-lg transition-shadow flex flex-col h-full"
        >
          <CardHeader>
            <CardDescription>N° {(currentPage - 1) * itemsPerPage + index + 1}</CardDescription>
            <CardTitle className="text-lg line-clamp-2">
              {assignment.Equipment?.equip_name || `Equipment #${assignment.inventory_num}`}
            </CardTitle>
            <CardDescription className="text-sm">
              {assignment.Researcher 
                ? `${assignment.Researcher.res_fname} ${assignment.Researcher.res_lname}`
                : `Researcher #${assignment.res_code}`}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex-grow">
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium">{t('assignResearcher.inventory_number')}</p>
                <p className="text-sm text-muted-foreground">
                  {assignment.inventory_num}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium">{t('assignResearcher.assignment_period')}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(assignment.res_assign_date)} - {formatDate(assignment.res_return_date)}
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
                  onClick={() => navigateToAssignmentDetailPage(assignment.res_code, assignment.inventory_num)}
                  className="cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Eye className="h-3 w-3" />
                    {t("global.details")}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigateToEditAssignmentPage(assignment.res_code, assignment.inventory_num)}
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
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}