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

import { MoreVertical, Pencil, Trash2, ArrowUpDown, Eye, LayoutList, Boxes } from "lucide-react";
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


interface ReviewsTableProps {
  reviews: Review[];
  currentPage: number;
  itemsPerPage: number;
  openDeleteModal: (review: Review) => void;
  toggleSort: (column: string) => void;
  visibleColumns: Record<string, boolean>;
}

export default function ReviewsTable({
  reviews,
  currentPage,
  itemsPerPage,
  openDeleteModal,
  toggleSort,
  visibleColumns,
}: ReviewsTableProps) {
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
    <Table>
      <TableHeader className="bg-muted/50">
        <TableRow>
          <TableHead className="w-[100px]">N°</TableHead>
          <TableHead>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleSort('review_title')}>
              <ArrowUpDown className="w-3 h-3" size={20} strokeWidth={2} />
              {t("review.title")}
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleSort('issn')}>
              <ArrowUpDown className="w-3 h-3" size={20} strokeWidth={2} />
              ISSN
            </div>
          </TableHead>
          {visibleColumns.e_issn && (
            <TableHead>
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleSort('e_issn')}>
                <ArrowUpDown className="w-3 h-3" size={20} strokeWidth={2} />
                E-ISSN
              </div>
            </TableHead>
          )}
          {visibleColumns.review_vol && (
            <TableHead>
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleSort('review_vol')}>
                <ArrowUpDown className="w-3 h-3" size={20} strokeWidth={2} />
                {t("review.review_vol")}
              </div>
            </TableHead>
          )}
          {visibleColumns.publisher && (
            <TableHead>
              <div className="flex items-center gap-2">
                {t("review.publisher")}
              </div>
            </TableHead>
          )}
          <TableHead className="text-center">{t("global.actions")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reviews.map((review, index) => (
          <TableRow key={review.review_num}>
            <TableCell className="font-medium">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
            <TableCell>{review.review_title}</TableCell>
            <TableCell>{review.issn}</TableCell>
            {visibleColumns.e_issn && (
              <TableCell>{review.e_issn || "N/A"}</TableCell>
            )}
            {visibleColumns.review_vol && (
              <TableCell>{review.review_vol || "N/A"}</TableCell>
            )}
            {visibleColumns.publisher && (
              <TableCell>{review.publisher?.publisher_name || "N/A"}</TableCell>
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
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}