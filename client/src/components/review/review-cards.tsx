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

import { MoreVertical, Pencil, Trash2, Eye, LayoutList, Boxes } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

interface Review {
  review_num: number;
  review_title: string;
  issn: string;
  e_issn?: string | null;
  review_vol?: string | null;
  publisher_id: number;
  publisher?: {
    publisher_name?: string;
  };
}

interface ReviewCardsProps {
  reviews: Review[];
  currentPage: number;
  itemsPerPage: number;
  openDeleteModal: (review: Review) => void;
}

export default function ReviewCards({
  reviews,
  currentPage,
  itemsPerPage,
  openDeleteModal,
}: ReviewCardsProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const navigateToEditReviewPage = (reviewNum: number) => {
    navigate(`/publications-management/scientific-reviews/edit-review/${reviewNum}`);
  };

  const navigateToReviewDetailPage = (reviewNum: number) => {
    navigate(`/publications-management/scientific-reviews/${reviewNum}`);
  };

  const navigateToSpecialityAssignment = (reviewNum: number) => {
    navigate(`/publications-management/scientific-reviews/${reviewNum}/specialities`);
  };

  const navigateToCategoryAssignment = (reviewNum: number) => {
    navigate(`/publications-management/scientific-reviews/${reviewNum}/categories`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {reviews.map((review, index) => (
        <Card key={review.review_num} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardDescription>N° {(currentPage - 1) * itemsPerPage + index + 1}</CardDescription>
            <CardTitle className="text-lg">{review.review_title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">ISSN:</span> {review.issn}
            </p>
            
            {review.e_issn && (
              <p className="text-sm">
                <span className="font-medium">E-ISSN:</span> {review.e_issn}
              </p>
            )}
            
            {review.review_vol && (
              <p className="text-sm">
                <span className="font-medium">{t("review.review_vol")}:</span> {review.review_vol}
              </p>
            )}
            
            {review.publisher?.publisher_name && (
              <p className="text-sm">
                <span className="font-medium">{t("review.publisher")}:</span> {review.publisher?.publisher_name}
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
                  onClick={() => navigateToReviewDetailPage(review.review_num)}
                  className="cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Eye className="h-3 w-3" />
                    {t("global.details")}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigateToEditReviewPage(review.review_num)}
                  className="cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Pencil className="h-3 w-3" />
                    {t("global.edit")}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => openDeleteModal(review)}
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
                  onClick={() => navigateToSpecialityAssignment(review.review_num)}
                  className="cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <LayoutList className="h-3 w-3" />
                    {t("speciality.plural")}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigateToCategoryAssignment(review.review_num)}
                  className="cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Boxes className="h-3 w-3" />
                    {t("category.plural")}
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