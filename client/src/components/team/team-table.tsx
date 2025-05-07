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
} from "@/components/ui/dropdown-menu";

import { MoreVertical, Pencil, Trash2, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

// Define Team type
interface Team {
  team_id: number;
  team_name: string;
  team_abbr?: string | null;
  team_desc?: string | null;
}

// Define Props type
interface TeamTableProps {
  teams: Team[];
  currentPage: number;
  itemsPerPage: number;
  openEditModal: (team: Team) => void;
  openDeleteModal: (team: Team) => void;
  toggleSort: (column: string) => void; // Callback for sorting
}

export default function TeamTable({ teams, currentPage, itemsPerPage, openEditModal, openDeleteModal, toggleSort }: TeamTableProps) {
  const { t } = useTranslation();
  return (
    <>
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[100px]">N°</TableHead>
            <TableHead>
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleSort('team_name')}>
                <ArrowUpDown className="w-3 h-3" size={20} strokeWidth={2} />
                {t("team.team_name")}
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleSort('team_abbr')}>
                <ArrowUpDown className="w-3 h-3" size={20} strokeWidth={2} />
                {t("team.team_abbr")}
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                {t("team.team_desc")}
              </div>
            </TableHead>
            <TableHead className="text-center">{t("global.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teams.map((team, index) => (
            <TableRow key={team.team_id}>
              <TableCell className="font-medium">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
              <TableCell>
                {team.team_name.length > 40 ? `${team.team_name.slice(0, 40)}...` : team.team_name}
              </TableCell>
              <TableCell className={team.team_abbr ? "" : "text-red-500"}>
                {team.team_abbr || "N/A"}
              </TableCell>
              <TableCell className={team.team_desc ? "" : "text-red-500"}>
                {team.team_desc
                ? team.team_desc.length > 30
                  ? `${team.team_desc.slice(0, 30)}...`
                  : team.team_desc
                : "N/A"}
              </TableCell>
              <TableCell className="text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-4 w-4 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem
                      onClick={() => openEditModal(team)}
                      className="cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Pencil className="h-3 w-3" />
                        {t("global.edit")}
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => openDeleteModal(team)}
                      className="cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Trash2 className="h-3 w-3" />
                        {t("global.delete")}
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}