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

interface Communication {
  id_comm: number;
  title_comm: string;
  event_title: string;
  year_comm: number;
  url_comm?: string | null;
  type_id: number;
  production_type?: {
    type_name?: string;
  };
}

interface CommunicationsTableProps {
  communications: Communication[];
  currentPage: number;
  itemsPerPage: number;
  openDeleteModal: (communication: Communication) => void;
  toggleSort: (column: string) => void;
  visibleColumns: Record<string, boolean>;
}

export default function CommunicationsTable({
  communications,
  currentPage,
  itemsPerPage,
  openDeleteModal,
  toggleSort,
  visibleColumns,
}: CommunicationsTableProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const navigateToEditCommunicationPage = (idComm: number) => {
    navigate(`/research-productions/communications/edit-communication/${idComm}`);
  };

  const navigateToCommunicationDetailPage = (idComm: number) => {
    navigate(`/research-productions/communications/${idComm}`);
  };

  const navigateToResearcherAssignment = (idComm: number) => {
    navigate(`/research-productions/communications/${idComm}/researchers`);
  };

  const navigateToDoctoralStudentAssignment = (idComm: number) => {
    navigate(`/research-productions/communications/${idComm}/doctoral-students`);
  };

  return (
    <Table>
      <TableHeader className="bg-muted/50">
        <TableRow>
          <TableHead className="w-[100px]">N°</TableHead>
          <TableHead>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleSort('title_comm')}>
              <ArrowUpDown className="w-3 h-3" size={20} strokeWidth={2} />
              {t("communication.title")}
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleSort('event_title')}>
              <ArrowUpDown className="w-3 h-3" size={20} strokeWidth={2} />
              {t("communication.event_title")}
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleSort('year_comm')}>
              <ArrowUpDown className="w-3 h-3" size={20} strokeWidth={2} />
              {t("communication.year_comm")}
            </div>
          </TableHead>
          {visibleColumns.url_comm && (
            <TableHead>
              <div className="flex items-center gap-2">
                {t("communication.url_comm")}
              </div>
            </TableHead>
          )}
          {visibleColumns.production_type && (
            <TableHead>
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleSort('type_id')}>
                <ArrowUpDown className="w-3 h-3" size={20} strokeWidth={2} />
                {t("communication.type")}
              </div>
            </TableHead>
          )}
          <TableHead className="text-center">{t("global.actions")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {communications.map((communication, index) => (
          <TableRow key={communication.id_comm}>
            <TableCell className="font-medium">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
            <TableCell>{communication.title_comm}</TableCell>
            <TableCell>{communication.event_title}</TableCell>
            <TableCell>{communication.year_comm}</TableCell>
            {visibleColumns.url_comm && (
              <TableCell>
                {communication.url_comm ? (
                  <a href={communication.url_comm} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    {t("global.view_link")}
                  </a>
                ) : "N/A"}
              </TableCell>
            )}
            {visibleColumns.production_type && (
              <TableCell>{communication.production_type?.type_name || "N/A"}</TableCell>
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
                    onClick={() => navigateToCommunicationDetailPage(communication.id_comm)}
                    className="cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Eye className="h-3 w-3" />
                      {t("global.details")}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigateToEditCommunicationPage(communication.id_comm)}
                    className="cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Pencil className="h-3 w-3" />
                      {t("global.edit")}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => openDeleteModal(communication)}
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
                    onClick={() => navigateToResearcherAssignment(communication.id_comm)}
                    className="cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Users className="h-3 w-3" />
                      {t("researcher.plural")}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigateToDoctoralStudentAssignment(communication.id_comm)}
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