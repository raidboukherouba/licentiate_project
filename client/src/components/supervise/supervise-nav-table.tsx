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
import { Search, PlusCircle, FileSpreadsheet, ChevronDown } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { exportSupervises } from "@/services/superviseService";

// Define Laboratory type for filtering
interface Laboratory {
  lab_code: number;
  lab_name: string;
}

interface SuperviseNavTableProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  itemsPerPage: number;
  setItemsPerPage: (value: number) => void;
  setCurrentPage: (value: number) => void;
  selectedLab: number | null;
  setSelectedLab: (value: number | null) => void;
  laboratories: Laboratory[];
  visibleColumns: Record<string, boolean>;
  setVisibleColumns: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

export default function SuperviseNavTable({
  searchQuery,
  setSearchQuery,
  itemsPerPage,
  setItemsPerPage,
  setCurrentPage,
  selectedLab,
  setSelectedLab,
  laboratories,
  visibleColumns,
  setVisibleColumns,
}: SuperviseNavTableProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleColumnToggle = (column: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  // Handle Export Function
  const handleExport = async () => {
    try {
      const blob = await exportSupervises(searchQuery, selectedLab || undefined);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "supervises.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting supervises:", error);
    }
  };

  // Navigate to the Add Supervise page
  const navigateToAddSupervisePage = () => {
    navigate('/personnel-management/supervise/add-supervise');
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
              placeholder={t("supervise.search_placeholder")}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page when searching
              }}
              className="pl-10"
            />
          </div>

          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <div className="flex justify-between gap-2 w-full md:w-auto">
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

              {/* Laboratory Dropdown */}
              <div className="flex items-center gap-2">
                <Select
                  value={selectedLab ? selectedLab.toString() : "all"}
                  onValueChange={(value) => {
                    if (value === "all") {
                      setSelectedLab(null);
                      setCurrentPage(1);
                    } else {
                      setSelectedLab(Number(value));
                      setCurrentPage(1);
                    }
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t("laboratory.select_laboratory")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("laboratory.all_laboratories")}</SelectItem>
                    {laboratories.map((lab) => (
                      <SelectItem key={lab.lab_code} value={lab.lab_code.toString()}>
                        <span className='truncate'>{lab.lab_name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Export Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="flex items-center justify-center gap-1"
            >
              <FileSpreadsheet className="w-4 h-4" />
              {t("global.export")}
            </Button>

            {/* Column Visibility Dropdown */}
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                    {t("global.columns")} <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  {Object.keys(visibleColumns).map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column}
                      checked={visibleColumns[column]}
                      onCheckedChange={() => handleColumnToggle(column)}
                    >
                      {t(`supervise.${column}`)}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Add Supervise Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={navigateToAddSupervisePage}
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