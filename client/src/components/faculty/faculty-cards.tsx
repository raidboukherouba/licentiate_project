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
  } from "@/components/ui/dropdown-menu";
  
  import { MoreVertical, Pencil, Trash2 } from "lucide-react";
  import { Button } from "@/components/ui/button";
  
  // Define Faculty type
  interface Faculty {
    faculty_id: number;
    faculty_name: string;
  }
  
  // Define Props type
  interface FacultyCardProps {
    faculties: Faculty[];
    currentPage: number;
    itemsPerPage: number;
    openEditModal: (faculty: Faculty) => void;
    openDeleteModal: (faculty: Faculty) => void;
  }
  
  export default function FacultyCards({ faculties, currentPage, itemsPerPage, openEditModal, openDeleteModal }: FacultyCardProps) {
    const { t } = useTranslation();

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {faculties.map((faculty, index) => (
          <Card key={faculty.faculty_id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardDescription>N° {(currentPage - 1) * itemsPerPage + index + 1}</CardDescription>
              <CardTitle className="text-lg">{faculty.faculty_name}</CardTitle>
            </CardHeader>
            {/* <CardContent>
              <p>Additional details about the faculty can go here.</p>
            </CardContent> */}
            <CardFooter className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
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
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }