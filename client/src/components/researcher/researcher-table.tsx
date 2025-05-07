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
interface ResearcherTableProps {
  researchers: Researcher[];
  currentPage: number;
  itemsPerPage: number;
  openDeleteModal: (researcher: Researcher) => void;
  toggleSort: (column: string) => void;
  visibleColumns: Record<string, boolean>;
}

export default function ResearcherTable({
  researchers,
  currentPage,
  itemsPerPage,
  openDeleteModal,
  toggleSort,
  visibleColumns,
}: ResearcherTableProps) {
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
    <>
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[100px]">N°</TableHead>
            <TableHead>
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleSort('res_fname')}>
                <ArrowUpDown className="w-3 h-3" size={20} strokeWidth={2} />
                {t("researcher.name")}
              </div>
            </TableHead>
            {visibleColumns.res_prof_email && (
              <TableHead>
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleSort('res_prof_email')}>
                  <ArrowUpDown className="w-3 h-3" size={20} strokeWidth={2} />
                  {t("researcher.res_prof_email")}
                </div>
              </TableHead>
            )}
            {visibleColumns.func_name && (
              <TableHead>
                <div className="flex items-center gap-2">
                  {t("researcher.function")}
                </div>
              </TableHead>
            )}
            {visibleColumns.res_grade && (
              <TableHead>
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleSort('res_grade')}>
                  <ArrowUpDown className="w-3 h-3" size={20} strokeWidth={2} />
                  {t("researcher.res_grade")}
                </div>
              </TableHead>
            )}
            {visibleColumns.res_phone && (
              <TableHead>
                <div className="flex items-center gap-2">
                  {t("researcher.res_phone")}
                </div>
              </TableHead>
            )}
            <TableHead className="text-center">{t("global.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {researchers.map((researcher, index) => (
            <TableRow key={researcher.res_code}>
              <TableCell className="font-medium">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
              <TableCell>{`${researcher.res_fname} ${researcher.res_lname}`}</TableCell>
              
              {visibleColumns.res_prof_email && (
                <TableCell>{researcher.res_prof_email}</TableCell>
              )}

              {visibleColumns.func_name && (
                <TableCell>{researcher.function?.func_name || "N/A"}</TableCell>
              )}

              {visibleColumns.res_grade && (
                <TableCell className={researcher.res_grade ? "" : "text-red-500"}>
                  {researcher.res_grade || "N/A"}
                </TableCell>
              )}
              
              {visibleColumns.res_phone && (
                <TableCell className={researcher.res_phone ? "" : "text-red-500"}>
                  {researcher.res_phone || "N/A"}
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}