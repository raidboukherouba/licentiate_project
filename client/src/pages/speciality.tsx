import { useState, useEffect } from "react";
import debounce from "lodash.debounce";
import { fetchSpecialities, deleteSpeciality, updateSpeciality, createSpeciality } from "../services/specialityService";
import SpecialityTable from "@/components/speciality/speciality-table";
import SpecialityCards from "@/components/speciality/speciality-cards";
import TablePagination from "@/components/table-pagination";
import SpecialityNavTable from "@/components/speciality/speciality-nav-table";
import { Toaster, toast } from "sonner";
import { AddModal } from "@/components/speciality/add-modal";
import { EditModal } from "@/components/speciality/edit-modal";
import { DeleteModal } from "@/components/speciality/delete-modal";
import { CircleAlert, CircleCheck } from 'lucide-react';

// Define Speciality type
interface Speciality {
  spec_code: number;
  spec_name: string;
}

export default function Speciality() {
  const [specialities, setSpecialities] = useState<Speciality[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>("spec_name");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [selectedSpeciality, setSelectedSpeciality] = useState<Speciality | null>(null);

  const debouncedLoadSpecialities = debounce(() => loadSpecialities(), 300);

  useEffect(() => {
    debouncedLoadSpecialities();
    return () => debouncedLoadSpecialities.cancel();
  }, [currentPage, itemsPerPage, sortBy, order, searchQuery]);

  async function loadSpecialities() {
    try {
      const data = await fetchSpecialities(
        currentPage,
        itemsPerPage,
        sortBy,
        order,
        searchQuery
      );
      setSpecialities(data.specialities);
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

  const openEditModal = (speciality: Speciality) => {
    setSelectedSpeciality(speciality);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (speciality: Speciality) => {
    setSelectedSpeciality(speciality);
    setIsDeleteModalOpen(true);
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedSpeciality(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedSpeciality(null);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleDelete = async (): Promise<void> => {
    if (!selectedSpeciality) {
      toast.error("No speciality selected", {
        icon: <CircleAlert className="w-4 h-4 text-red-600" />,
      });
      return;
    }
    try {
      const response = await deleteSpeciality(selectedSpeciality.spec_code);
      if ("message" in response) {
        toast.success(response.message, {
          icon: <CircleCheck className="w-4 h-4 text-green-600" />,
        });
        loadSpecialities();
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "An unexpected error occurred";
      toast.error(errorMessage, {
        icon: <CircleAlert className="w-4 h-4 text-red-600" />,
      });
    } finally {
      closeDeleteModal();
    }
  };

  const handleEdit = async (specName: string): Promise<void> => {
    if (!selectedSpeciality) {
      toast.error("No speciality selected", {
        icon: <CircleAlert className="w-4 h-4 text-red-600" />,
      });
      return;
    }
    try {
      const response = await updateSpeciality(selectedSpeciality.spec_code, specName);
      toast.success(response.message, {
        icon: <CircleCheck className="w-4 h-4 text-green-600" />,
      });
      loadSpecialities();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "An unexpected error occurred";
      toast.error(errorMessage, {
        icon: <CircleAlert className="w-4 h-4 text-red-600" />,
      });
    } finally {
      closeEditModal();
    }
  };

  const handleAdd = async (specName: string): Promise<void> => {
    try {
      const response = await createSpeciality(specName);
      toast.success(response.message, {
        icon: <CircleCheck className="w-4 h-4 text-green-600" />,
      });
      loadSpecialities();
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
      <SpecialityNavTable
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        setCurrentPage={setCurrentPage}
        openAddModal={openAddModal}
      />

      <div className="hidden md:block">
        <SpecialityTable
          specialities={specialities}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          toggleSort={toggleSort}
          openEditModal={openEditModal}
          openDeleteModal={openDeleteModal}
        />
      </div>

      <div className="md:hidden">
        <SpecialityCards
          specialities={specialities}
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
        selectedSpeciality={selectedSpeciality}
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