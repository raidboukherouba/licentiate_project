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

// Define Domain type
interface Domain {
  domain_id: number;
  domain_name: string;
  domain_abbr?: string | null;
}

// Define Props type
interface DomainTableProps {
  domains: Domain[];
  currentPage: number;
  itemsPerPage: number;
  openEditModal: (domain: Domain) => void;
  openDeleteModal: (domain: Domain) => void;
  toggleSort: (column: string) => void; // Callback for sorting
}

export default function DomainTable({ domains, currentPage, itemsPerPage, openEditModal, openDeleteModal, toggleSort }: DomainTableProps) {
  const { t } = useTranslation();

  return (
    <>
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[100px]">N°</TableHead>
            <TableHead>
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleSort('domain_name')}>
                <ArrowUpDown className="w-3 h-3" size={20} strokeWidth={2} />
                {t("domain.domain_name")}
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleSort('domain_abbr')}>
                <ArrowUpDown className="w-3 h-3" size={20} strokeWidth={2} />
                {t("domain.domain_abbr")}
              </div>
            </TableHead>
            <TableHead className="text-center">{t("global.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {domains.map((domain, index) => (
            <TableRow key={domain.domain_id}>
              <TableCell className="font-medium">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
              <TableCell>{domain.domain_name}</TableCell>
              <TableCell className={domain.domain_abbr ? "" : "text-red-500"}>
                {domain.domain_abbr || "N/A"}
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
                      onClick={() => openEditModal(domain)}
                      className="cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Pencil className="h-3 w-3" />
                        {t("global.edit")}
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => openDeleteModal(domain)}
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