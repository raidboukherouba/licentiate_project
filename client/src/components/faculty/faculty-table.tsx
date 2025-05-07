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

// Define Faculty type
interface Faculty {
    faculty_id: number;
    faculty_name: string;
}
  
// Define Props type
interface FacultyTableProps {
  faculties: Faculty[];
  currentPage: number;
  itemsPerPage: number;
  openEditModal: (faculty: Faculty) => void; 
  openDeleteModal: (faculty: Faculty) => void; 
  toggleSort: (column: string) => void;
}

export default function FacultyTable({ faculties, currentPage, itemsPerPage, openEditModal, openDeleteModal, toggleSort }: FacultyTableProps) {
  const { t } = useTranslation();

  return(
    <>
      <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[100px]">N°</TableHead>
              <TableHead className="flex items-center gap-2 cursor-pointer" onClick={() => toggleSort('faculty_name')}>
                <ArrowUpDown className="w-3 h-3" size={20} strokeWidth={2} />
                {t("faculty.faculty_name")}
              </TableHead>
              <TableHead className="text-center">{t("global.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {faculties.map((faculty, index) => (
              <TableRow key={faculty.faculty_id}>
                <TableCell className="font-medium">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                <TableCell>{faculty.faculty_name}</TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-4 w-4 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem
                        onClick={() => openEditModal(faculty)}
                        className="cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Pencil className="h-3 w-3" />
                          {t("global.edit")}
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => openDeleteModal(faculty)}
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
  )
}
  