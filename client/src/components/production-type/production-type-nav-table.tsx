import { useTranslation } from 'react-i18next';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, PlusCircle } from "lucide-react";

interface ProductionTypeNavTableProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  itemsPerPage: number;
  setItemsPerPage: (value: number) => void;
  setCurrentPage: (value: number) => void;
  openAddModal: () => void;
}

export default function ProductionTypeNavTable({
  searchQuery,
  setSearchQuery,
  itemsPerPage,
  setItemsPerPage,
  setCurrentPage,
  openAddModal,
}: ProductionTypeNavTableProps) {
  const { t } = useTranslation();

  return (
    <div className="flex justify-center pt-2">
      <div className="w-full">
        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-4">
          {/* Search Input */}
          <div className="relative w-full md:w-75">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <Input
              type="text"
              placeholder={t("global.search_placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex justify-between md:gap-4">
            {/* Show: Dropdown */}
            <div className="flex items-center gap-2">
              <label htmlFor="itemsPerPage" className="text-sm text-gray-500">
                {t("global.show")}
              </label>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value));
                  setCurrentPage(1); // Reset to the first page when changing items per page
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

            {/* Add Production Type Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={openAddModal}
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