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

interface PublicationCardsProps {
  publications: Publication[];
  currentPage: number;
  itemsPerPage: number;
  openDeleteModal: (publication: Publication) => void;
}

export default function PublicationCards({
  publications,
  currentPage,
  itemsPerPage,
  openDeleteModal,
}: PublicationCardsProps) {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {publications.map((publication, index) => (
        <Card key={publication.doi} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardDescription>N° {(currentPage - 1) * itemsPerPage + index + 1}</CardDescription>
            <CardTitle className="text-lg">{publication.article_title}</CardTitle>
            {publication.review?.review_title && (
              <CardDescription>{publication.review.review_title}</CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">{t("publication.submission_date")}:</span> {formatDate(publication.submission_date)}
            </p>
            <p className="text-sm">
              <span className="font-medium">{t("publication.acceptance_date")}:</span> {formatDate(publication.acceptance_date)}
            </p>
            
            {publication.production_type?.type_name && (
              <p className="text-sm">
                <span className="font-medium">{t("publication.type")}:</span> {publication.production_type.type_name}
              </p>
            )}
            
            {publication.pub_pages && (
              <p className="text-sm">
                <span className="font-medium">{t("publication.pub_pages")}:</span> {publication.pub_pages}
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
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}