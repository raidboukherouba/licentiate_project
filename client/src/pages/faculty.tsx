import { useState, useEffect } from "react";
import debounce from "lodash.debounce";
import { fetchFaculties, deleteFaculty, updateFaculty, createFaculty } from "../services/facultyService";
import FacultyTable from "@/components/faculty/faculty-table";
import FacultyCards from "@/components/faculty/faculty-cards";
import TablePagination from "@/components/table-pagination";
import FacultyNavTable from "@/components/faculty/faculty-nav-table";
import { Toaster, toast } from "sonner";
import { AddModal } from "@/components/faculty/add-modal";
import { EditModal } from "@/components/faculty/edit-modal";
import { DeleteModal } from "@/components/faculty/delete-modal";
import { CircleAlert, CircleCheck } from 'lucide-react';

// Define Faculty type
interface Faculty {
  faculty_id: number;
  faculty_name: string;
}

export default function Faculty() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>("faculty_name");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);

  const debouncedLoadFaculties = debounce(() => loadFaculties(), 300);

  useEffect(() => {
    debouncedLoadFaculties();
    return () => debouncedLoadFaculties.cancel();
  }, [currentPage, itemsPerPage, sortBy, order, searchQuery]);

  async function loadFaculties() {
    try {
      const data = await fetchFaculties(
        currentPage,
        itemsPerPage,
        sortBy,
        order,
        searchQuery
      );
      setFaculties(data.faculties);
      setTotalPages(data.totalPages);
      setTotalItems(data.totalItems);
    } catch (error) {
      console.error((error as Error).message);
    }
  }

  const toggleSort = (column: string) => {
    if (sortBy === column) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setOrder("asc");
    }
  };

  const openEditModal = (faculty: Faculty) => {
    setSelectedFaculty(faculty);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (faculty: Faculty) => {
    setSelectedFaculty(faculty);
    setIsDeleteModalOpen(true);
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedFaculty(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedFaculty(null);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleDelete = async (): Promise<void> => {
    if (!selectedFaculty) {
      toast.error("No faculty selected", {
        icon: <CircleAlert className="w-4 h-4 text-red-600" />,
      });
      return;
    }
    try {
      const response = await deleteFaculty(selectedFaculty.faculty_id);
      if ("message" in response) {
        toast.success(response.message, {
          icon: <CircleCheck className="w-4 h-4 text-green-600" />,
        });
        loadFaculties();
      }
    } 
    catch (error: any) {
      const errorMessage = error.response?.data?.error || "An unexpected error occurred";
      toast.error(errorMessage, {
        icon: <CircleAlert className="w-4 h-4 text-red-600" />,
      });
    } finally {
      closeDeleteModal();
    }
  };
  

  const handleEdit = async (facultyName: string): Promise<void> => {
    if (!selectedFaculty) {
      toast.error("No faculty selected", {
        icon: <CircleAlert className="w-4 h-4 text-red-600" />
      }); 
      return;
    }
    try {
      const response = await updateFaculty(selectedFaculty.faculty_id, facultyName);
      toast.success(response.message, {
        icon: <CircleCheck className="w-4 h-4 text-green-600" />
      });
      loadFaculties();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "An unexpected error occurred";
      toast.error(errorMessage, {
        icon: <CircleAlert className="w-4 h-4 text-red-600" />,
      });
    } finally {
      closeEditModal();
    }
  };

  const handleAdd = async (facultyName: string): Promise<void> => {
    try {
      const response = await createFaculty(facultyName);
      toast.success(response.message, {
        icon: <CircleCheck className="w-4 h-4 text-green-600" />
      });
      loadFaculties();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "An unexpected error occurred";
      toast.error(errorMessage, {
        icon: <CircleAlert className="w-4 h-4 text-red-600" />,
      });
    } finally {
      closeAddModal();
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <FacultyNavTable 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        setCurrentPage={setCurrentPage}
        openAddModal={openAddModal}
      />

      <div className="hidden md:block">
        <FacultyTable 
          faculties={faculties}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          toggleSort={toggleSort}
          openEditModal={openEditModal}
          openDeleteModal={openDeleteModal}
        />
      </div>

      <div className="md:hidden">
          <FacultyCards
            faculties={faculties}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            openEditModal={openEditModal}
            openDeleteModal={openDeleteModal}
          />
      </div>
      
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <AddModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onAdd={handleAdd}
      />

      <EditModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onEdit={handleEdit}
        selectedFaculty={selectedFaculty}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
      />

      <Toaster position="bottom-right" />
    </>
  );
}