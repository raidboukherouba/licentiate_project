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
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

import { MoreVertical, Pencil, Trash2, Eye, Users, GraduationCap } from "lucide-react";
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

interface CommunicationCardsProps {
  communications: Communication[];
  currentPage: number;
  itemsPerPage: number;
  openDeleteModal: (communication: Communication) => void;
}

export default function CommunicationCards({
  communications,
  currentPage,
  itemsPerPage,
  openDeleteModal,
}: CommunicationCardsProps) {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {communications.map((communication, index) => (
        <Card key={communication.id_comm} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardDescription>N° {(currentPage - 1) * itemsPerPage + index + 1}</CardDescription>
            <CardTitle className="text-lg">{communication.title_comm}</CardTitle>
            <CardDescription>{communication.event_title}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">{t("communication.year_comm")}:</span> {communication.year_comm}
            </p>
            
            {communication.production_type?.type_name && (
              <p className="text-sm">
                <span className="font-medium">{t("communication.type")}:</span> {communication.production_type.type_name}
              </p>
            )}
            
            {communication.url_comm && (
              <p className="text-sm">
                <span className="font-medium">{t("communication.url_comm")}:</span>{' '}
                <a 
                  href={communication.url_comm} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {t("global.view_link")}
                </a>
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
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}