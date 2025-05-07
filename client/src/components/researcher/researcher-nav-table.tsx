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
import { exportResearchers } from "@/services/researcherService";

// Define Team type
interface Team {
  team_id: number;
  team_name: string;
}

// Define Team type
interface Laboratory {
  lab_code: number;
  lab_name: string;
}

interface ResearcherNavTableProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  itemsPerPage: number;
  setItemsPerPage: (value: number) => void;
  setCurrentPage: (value: number) => void;
  selectedTeam: number | null;
  setSelectedTeam: (value: number | null) => void;
  teams: Team[];
  selectedLaboratory: number | null;
  setSelectedLaboratory: (value: number | null) => void;
  laboratories: Laboratory[];
  visibleColumns: Record<string, boolean>;
  setVisibleColumns: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

export default function ResearcherNavTable({
  searchQuery,
  setSearchQuery,
  itemsPerPage,
  setItemsPerPage,
  setCurrentPage,
  selectedTeam,
  setSelectedTeam,
  teams,
  selectedLaboratory,
  setSelectedLaboratory,
  laboratories,
  visibleColumns,
  setVisibleColumns,
}: ResearcherNavTableProps) {
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
      const blob = await exportResearchers();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "researchers.xlsx"; // File name
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting researchers:", error);
    }
  };

  // Navigate to the Add Researcher page
  const navigateToAddResearcherPage = () => {
    navigate('/personnel-management/researchers/add-researcher');
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

              {/* Team Dropdown */}
              <div className="flex items-center gap-2">
                <Select
                  value={selectedTeam ? selectedTeam.toString() : "all"}
                  onValueChange={(value) => {
                    if (value === "all") {
                      setSelectedTeam(null);
                    } else {
                      setSelectedTeam(Number(value));
                    }
                  }}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder={t("researcher.select_team")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("team.all_teams")}</SelectItem>
                    {teams.map((team) => (
                      <SelectItem key={team.team_id} value={team.team_id.toString()}>
                        <span className='truncate'>{team.team_name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Laboratory Dropdown */}
              <div className="flex items-center gap-2">
                <Select
                  value={selectedLaboratory ? selectedLaboratory.toString() : "all"}
                  onValueChange={(value) => {
                    if (value === "all") {
                      setSelectedLaboratory(null);
                    } else {
                      setSelectedLaboratory(Number(value));
                    }
                  }}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder={t("researcher.select_laboratory")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("laboratory.all_laboratories")}</SelectItem>
                    {laboratories.map((laboratory) => (
                      <SelectItem key={laboratory.lab_code} value={laboratory.lab_code.toString()}>
                        <span className='truncate'>{laboratory.lab_name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Export Researcher Button */}
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
                      {t(`researcher.${column}`)}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Add Researcher Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={navigateToAddResearcherPage}
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