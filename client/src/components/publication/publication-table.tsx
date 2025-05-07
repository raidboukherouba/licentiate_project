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
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

import { MoreVertical, Pencil, Trash2, ArrowUpDown, Eye, Users, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

interface Publication {
  doi: string;
  article_title: string;
  submission_date: string;
  acceptance_date: string;
  pub_pages?: string | null;
  review_num: number;
  type_id: number;
  review?: {
    review_title?: string;
  };
  production_type?: {
    type_name?: string;
  };
}

interface PublicationsTableProps {
  publications: Publication[];
  currentPage: number;
  itemsPerPage: number;
  openDeleteModal: (publication: Publication) => void;
  toggleSort: (column: string) => void;
  visibleColumns: Record<string, boolean>;
}

export default function PublicationsTable({
  publications,
  currentPage,
  itemsPerPage,
  openDeleteModal,
  toggleSort,
  visibleColumns,
}: PublicationsTableProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const navigateToEditPublicationPage = (doi: string) => {
    const encodedDoi = encodeURIComponent(doi);
    navigate(`/research-productions/publications/edit-publication/${encodedDoi}`);
  };

  const navigateToPublicationDetailPage = (doi: string) => {
    const encodedDoi = encodeURIComponent(doi);
    navigate(`/research-productions/publications/${encodedDoi}`);
  };

  const navigateToResearcherAssignment = (doi: string) => {
    const encodedDoi = encodeURIComponent(doi);
    navigate(`/research-productions/publications/${encodedDoi}/researchers`);
  };

  const navigateToDoctoralStudentAssignment = (doi: string) => {
    const encodedDoi = encodeURIComponent(doi);
    navigate(`/research-productions/publications/${encodedDoi}/doctoral-students`);
  };

  return (
    <Table>
      <TableHeader className="bg-muted/50">
        <TableRow>
          <TableHead className="w-[100px]">N°</TableHead>
          <TableHead>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleSort('article_title')}>
              <ArrowUpDown className="w-3 h-3" size={20} strokeWidth={2} />
              {t("publication.article_title")}
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleSort('submission_date')}>
              <ArrowUpDown className="w-3 h-3" size={20} strokeWidth={2} />
              {t("publication.submission_date")}
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleSort('acceptance_date')}>
              <ArrowUpDown className="w-3 h-3" size={20} strokeWidth={2} />
              {t("publication.acceptance_date")}
            </div>
          </TableHead>
          {visibleColumns.pub_pages && (
            <TableHead>
              <div className="flex items-center gap-2">
                {t("publication.pub_pages")}
              </div>
            </TableHead>
          )}
          {visibleColumns.review && (
            <TableHead>
              <div className="flex items-center gap-2">
                {t("publication.review")}
              </div>
            </TableHead>
          )}
          {visibleColumns.production_type && (
            <TableHead>
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleSort('type_id')}>
                <ArrowUpDown className="w-3 h-3" size={20} strokeWidth={2} />
                {t("publication.type")}
              </div>
            </TableHead>
          )}
          <TableHead className="text-center">{t("global.actions")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {publications.map((publication, index) => (
          <TableRow key={publication.doi}>
            <TableCell className="font-medium">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
            <TableCell>{publication.article_title}</TableCell>
            <TableCell>{new Date(publication.submission_date).toLocaleDateString()}</TableCell>
            <TableCell>{new Date(publication.acceptance_date).toLocaleDateString()}</TableCell>
            {visibleColumns.pub_pages && (
              <TableCell>{publication.pub_pages || "N/A"}</TableCell>
            )}
            {visibleColumns.review && (
              <TableCell>{publication.review?.review_title || "N/A"}</TableCell>
            )}
            {visibleColumns.production_type && (
              <TableCell>{publication.production_type?.type_name || "N/A"}</TableCell>
            )}
            <TableCell className="text-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-4 w-4 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuLabel>{t("global.actions")}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => navigateToPublicationDetailPage(publication.doi)}
                    className="cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Eye className="h-3 w-3" />
                      {t("global.details")}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigateToEditPublicationPage(publication.doi)}
                    className="cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Pencil className="h-3 w-3" />
                      {t("global.edit")}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => openDeleteModal(publication)}
                    className="cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Trash2 className="h-3 w-3" />
                      {t("global.delete")}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>{t("global.management")}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => navigateToResearcherAssignment(publication.doi)}
                    className="cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Users className="h-3 w-3" />
                      {t("researcher.plural")}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigateToDoctoralStudentAssignment(publication.doi)}
                    className="cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <GraduationCap className="h-3 w-3" />
                      {t("doctoralStudent.plural")}
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