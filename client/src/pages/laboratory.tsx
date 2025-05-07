import { useState, useEffect, useRef } from "react";
import debounce from "lodash.debounce";
import { fetchLaboratories, deleteLaboratory } from "../services/laboratoryService"; // Add fetchFaculties
import LaboratoryTable from "@/components/laboratory/laboratory-table";
import LaboratoryCards from "@/components/laboratory/laboratory-cards";
import TablePagination from "@/components/table-pagination";
import LaboratoryNavTable from "@/components/laboratory/laboratory-nav-table";
import { Toaster, toast } from "sonner";
import { DeleteLaboratoryModal } from "@/components/laboratory/delete-modal";
import { CircleAlert, CircleCheck } from 'lucide-react';
import { useLocation } from "react-router-dom";
import { fetchAllFaculties } from "@/services/facultyService";

// Define Laboratory type
interface Laboratory {
  lab_code: number;
  lab_name: string;
  lab_abbr?: string | null;
  lab_desc?: string | null;
  lab_address?: string | null;
  lab_phone?: string | null;
  faculty_id: number;
  domain_id: number;
  dept_id: number;
}

// Define Faculty type
interface Faculty {
  faculty_id: number;
  faculty_name: string;
}

export default function Laboratory() {
  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>("lab_name");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedFaculty, setSelectedFaculty] = useState<number | null>(null); // Add selectedFaculty state
  const [faculties, setFaculties] = useState<Faculty[]>([]); // Add faculties state

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedLaboratory, setSelectedLaboratory] = useState<Laboratory | null>(null);
  const debouncedLoadLaboratories = debounce(() => loadLaboratories(), 300);

  const location = useLocation();
  const toastDisplayed = useRef(false);

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    lab_abbr: true,
    lab_phone: false,
  });

  // Fetch faculties on component mount
  useEffect(() => {
    async function loadFaculties() {
      try {
        const data = await fetchAllFaculties();
        setFaculties(data.faculties);
      } catch (error) {
        console.error((error as Error).message);
      }
    }

    loadFaculties();
  }, []);

  // Display toast messages from navigation state
  useEffect(() => {
    if (!location.state || toastDisplayed.current) return;

    const { successMessage, errorMessage } = location.state;

    if (successMessage) {
      toast.success(successMessage, {
        icon: <CircleCheck className="w-4 h-4 text-green-600" />,
      });
    }

    if (errorMessage) {
      toast.error(errorMessage, {
        icon: <CircleAlert className="w-4 h-4 text-red-600" />,
      });
    }

    toastDisplayed.current = true; // Prevent duplicate toasts

    // Clear navigation state after displaying the toast
    window.history.replaceState({}, document.title);
  }, [location.state]);

  // Load laboratories when filters or pagination change
  useEffect(() => {
    debouncedLoadLaboratories();
    return () => debouncedLoadLaboratories.cancel();
  }, [currentPage, itemsPerPage, sortBy, order, searchQuery, selectedFaculty]); // Add selectedFaculty to dependencies

  // Function to load laboratories
  async function loadLaboratories() {
    try {
      const data = await fetchLaboratories(
        currentPage,
        itemsPerPage,
        sortBy,
        order,
        searchQuery,
        selectedFaculty // Pass selectedFaculty to the API call
      );
      setLaboratories(data.laboratories);
      setTotalPages(data.totalPages);
      setTotalItems(data.totalItems);
    } catch (error) {
      console.error((error as Error).message);
    }
  }

  // Toggle sorting
  const toggleSort = (column: string) => {
    if (sortBy === column) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setOrder("asc");
    }
  };

  // Open delete modal
  const openDeleteModal = (laboratory: Laboratory) => {
    setSelectedLaboratory(laboratory);
    setIsDeleteModalOpen(true);
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedLaboratory(null);
  };

  // Handle laboratory deletion
  const handleDelete = async (): Promise<void> => {
    if (!selectedLaboratory) {
      toast.error("No laboratory selected", {
        icon: <CircleAlert className="w-4 h-4 text-red-600" />,
      });
      return;
    }
    try {
      const response = await deleteLaboratory(selectedLaboratory.lab_code);
      if ("message" in response) {
        toast.success(response.message, {
          icon: <CircleCheck className="w-4 h-4 text-green-600" />,
        });
        loadLaboratories();
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

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <LaboratoryNavTable
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        setCurrentPage={setCurrentPage}
        selectedFaculty={selectedFaculty}
        setSelectedFaculty={setSelectedFaculty}
        faculties={faculties}
        visibleColumns={visibleColumns} // Pass visibleColumns
        setVisibleColumns={setVisibleColumns} // Pass setVisibleColumns
      />

      <div className="hidden md:block">
        <LaboratoryTable
          laboratories={laboratories}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          toggleSort={toggleSort}
          openDeleteModal={openDeleteModal}
          visibleColumns={visibleColumns} // Pass visibleColumns
        />
      </div>

      <div className="md:hidden">
        <LaboratoryCards
          laboratories={laboratories}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          openDeleteModal={openDeleteModal}
        />
      </div>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <DeleteLaboratoryModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
      />

      <Toaster position="bottom-right" />
    </>
  );
}