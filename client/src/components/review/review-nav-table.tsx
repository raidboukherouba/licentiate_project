import { useTranslation } from 'react-i18next';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Search, PlusCircle, ChevronDown } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface ReviewNavTableProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  itemsPerPage: number;
  setItemsPerPage: (value: number) => void;
  setCurrentPage: (value: number) => void;
  visibleColumns: Record<string, boolean>;
  setVisibleColumns: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

export default function ReviewNavTable({
  searchQuery,
  setSearchQuery,
  itemsPerPage,
  setItemsPerPage,
  setCurrentPage,
  visibleColumns,
  setVisibleColumns,
}: ReviewNavTableProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleColumnToggle = (column: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  // Navigate to the Add Review page
  const navigateToAddReviewPage = () => {
    navigate('/publications-management/scientific-reviews/add-review');
  };
  
  return (
    <div className="flex justify-center pt-2">
      <div className="w-full">
        <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center mb-4">
          {/* Search Input */}
          <div className="relative w-full md:w-70">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <Input
              type="text"
              placeholder={t("global.search_placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2 justify-between">
            <div className="flex justify-between gap-2">
              {/* Show: Dropdown */}
              <div className="flex items-center gap-2">
                <label htmlFor="itemsPerPage" className="text-sm text-gray-500">
                  {t("global.show")}
                </label>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[60px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="15">15</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Column Visibility Dropdown */}
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                    {t("global.columns")} <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  {Object.keys(visibleColumns).map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column}
                      checked={visibleColumns[column]}
                      onCheckedChange={() => handleColumnToggle(column)}
                    >
                      {t(`review.${column}`)}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Add Review Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={navigateToAddReviewPage}
              className="flex items-center justify-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              {t("global.add")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}