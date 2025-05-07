import { useState, useEffect, useRef } from "react";
import debounce from "lodash.debounce";
import { fetchSupervises, deleteSupervise } from "../services/superviseService";
import SuperviseTable from "@/components/supervise/supervise-table";
import SuperviseCards from "@/components/supervise/supervise-cards";
import TablePagination from "@/components/table-pagination";
import SuperviseNavTable from "@/components/supervise/supervise-nav-table";
import { Toaster, toast } from "sonner";
import { DeleteSuperviseModal } from "@/components/supervise/delete-modal";
import { CircleAlert, CircleCheck } from 'lucide-react';
import { useLocation } from "react-router-dom";
import { fetchAllLaboratories } from "@/services/laboratoryService";

// Define Supervise type
interface Supervise {
  res_code: number;
  reg_num: number;
  super_start_date: string;
  super_end_date?: string | null;
  super_theme: string;
  Researcher?: {
    res_fname: string;
    res_lname: string;
    res_prof_email: string;
    lab_code: number;
    laboratory?: {
      lab_name: string;
    };
  };
  DoctoralStudent?: {
    doc_stud_fname: string;
    doc_stud_lname: string;
    doc_stud_prof_email: string;
  };
}
// Define Laboratory type for filtering
interface Laboratory {
  lab_code: number;
  lab_name: string;
}

export default function Supervise() {
  const [supervises, setSupervises] = useState<Supervise[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>("res_code");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedLab, setSelectedLab] = useState<number | null>(null);
  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedSupervise, setSelectedSupervise] = useState<Supervise | null>(null);
  const debouncedLoadSupervises = debounce(() => loadSupervises(), 300);

  const location = useLocation();
  const toastDisplayed = useRef(false);

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    super_theme: true,
    super_start_date: false,
    super_end_date: false,
  });

  // Fetch laboratories on component mount
  useEffect(() => {
    async function loadLaboratories() {
      try {
        const data = await fetchAllLaboratories();
        setLaboratories(data.laboratories);
      } catch (error) {
        console.error((error as Error).message);
      }
    }

    loadLaboratories();
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

    toastDisplayed.current = true;

    // Clear navigation state after displaying the toast
    window.history.replaceState({}, document.title);
  }, [location.state]);

  // Load supervises when filters or pagination change
  useEffect(() => {
    debouncedLoadSupervises();
    return () => debouncedLoadSupervises.cancel();
  }, [currentPage, itemsPerPage, sortBy, order, searchQuery, selectedLab]);

  // Function to load supervises
  async function loadSupervises() {
    try {
      const data = await fetchSupervises(
        currentPage,
        itemsPerPage,
        sortBy,
        order,
        searchQuery,
        selectedLab
      );
      setSupervises(data.supervises);
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
  const openDeleteModal = (supervise: Supervise) => {
    setSelectedSupervise(supervise);
    setIsDeleteModalOpen(true);
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedSupervise(null);
  };

  // Handle supervise deletion
  const handleDelete = async (): Promise<void> => {
    if (!selectedSupervise) {
      toast.error("No supervision selected", {
        icon: <CircleAlert className="w-4 h-4 text-red-600" />,
      });
      return;
    }
    try {
      const response = await deleteSupervise(
        selectedSupervise.res_code,
        selectedSupervise.reg_num
      );
      if ("message" in response) {
        toast.success(response.message, {
          icon: <CircleCheck className="w-4 h-4 text-green-600" />,
        });
        loadSupervises();
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
      <SuperviseNavTable
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        setCurrentPage={setCurrentPage}
        selectedLab={selectedLab}
        setSelectedLab={setSelectedLab}
        laboratories={laboratories}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
      />

      <div className="hidden md:block">
        <SuperviseTable
          supervises={supervises}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          toggleSort={toggleSort}
          openDeleteModal={openDeleteModal}
          visibleColumns={visibleColumns}
        />
      </div>

      <div className="md:hidden">
        <SuperviseCards
          supervises={supervises}
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

      <DeleteSuperviseModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
      />

      <Toaster position="bottom-right" />
    </>
  );
}