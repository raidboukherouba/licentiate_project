import { useState, useEffect, useRef } from "react";
import debounce from "lodash.debounce";
import { fetchCommunications, deleteCommunication } from "../services/communicationService";
import { fetchAllProductionTypes } from "../services/productionTypeService";
import CommunicationsTable from "@/components/communication/communication-table";
import CommunicationCards from "@/components/communication/communication-cards";
import TablePagination from "@/components/table-pagination";
import CommunicationNavTable from "@/components/communication/communication-nav-table";
import { Toaster, toast } from "sonner";
import { DeleteCommunicationModal } from "@/components/communication/delete-modal";
import { CircleAlert, CircleCheck } from 'lucide-react';
import { useLocation } from "react-router-dom";
import { fetchAllLaboratories } from "../services/laboratoryService";

// Researcher type
interface Researcher {
  res_code: number;
  res_fname: string;
  res_lname: string;
}

// DoctoralStudent type
interface DoctoralStudent {
  reg_num: number;
  doc_stud_fname: string;
  doc_stud_lname: string;
}

interface Communication {
  id_comm: number;
  title_comm: string;
  event_title: string;
  year_comm: number;
  url_comm?: string | null;
  type_id: number;
  production_type?: {
    type_name?: string;
  };
}

interface ProductionType {
  type_id: number;
  type_name: string;
}

// Define Laboratory type
interface Laboratory {
  lab_code: number;
  lab_name: string;
}

export default function Communications() {
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>("year_comm");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedLaboratory, setSelectedLaboratory] = useState<number | null>(null);
  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);

  const [productionTypes, setProductionTypes] = useState<ProductionType[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedCommunication, setSelectedCommunication] = useState<Communication | null>(null);
  const debouncedLoadCommunications = debounce(() => loadCommunications(), 300);

  const location = useLocation();
  const toastDisplayed = useRef(false);

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    url_comm: false,
    production_type: false,
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

  // Fetch production types on component mount
  useEffect(() => {
    async function loadProductionTypes() {
      try {
        const data = await fetchAllProductionTypes();
        setProductionTypes(data.productionTypes);
      } catch (error) {
        console.error((error as Error).message);
      }
    }

    loadProductionTypes();
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
    window.history.replaceState({}, document.title);
  }, [location.state]);

  // Load communications when filters or pagination change
  useEffect(() => {
    debouncedLoadCommunications();
    return () => debouncedLoadCommunications.cancel();
  }, [currentPage, itemsPerPage, sortBy, order, searchQuery, selectedLaboratory]);

  // Function to load communications
  async function loadCommunications() {
    try {
      const data = await fetchCommunications(
        currentPage,
        itemsPerPage,
        sortBy,
        order,
        searchQuery,
        selectedLaboratory
      );
      
      setCommunications(data.communications);
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
  const openDeleteModal = (communication: Communication) => {
    setSelectedCommunication(communication);
    setIsDeleteModalOpen(true);
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedCommunication(null);
  };

  // Handle communication deletion
  const handleDelete = async (): Promise<void> => {
    if (!selectedCommunication) {
      toast.error("No communication selected", {
        icon: <CircleAlert className="w-4 h-4 text-red-600" />,
      });
      return;
    }
    try {
      const response = await deleteCommunication(selectedCommunication.id_comm);
      if ("message" in response) {
        toast.success(response.message, {
          icon: <CircleCheck className="w-4 h-4 text-green-600" />,
        });
        loadCommunications();
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
      <CommunicationNavTable
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        setCurrentPage={setCurrentPage}
        selectedLaboratory={selectedLaboratory}
        setSelectedLaboratory={setSelectedLaboratory}
        laboratories={laboratories}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
      />

      <div className="hidden md:block">
        <CommunicationsTable
          communications={communications}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          toggleSort={toggleSort}
          openDeleteModal={openDeleteModal}
          visibleColumns={visibleColumns}
        />
      </div>

      <div className="md:hidden">
        <CommunicationCards
          communications={communications}
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

      <DeleteCommunicationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
      />

      <Toaster position="bottom-right" />
    </>
  );
}