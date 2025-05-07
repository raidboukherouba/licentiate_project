import { useState, useEffect, useRef } from "react";
import debounce from "lodash.debounce";
import { fetchEquipment, deleteEquipment } from "../services/equipmentService";
import { fetchAllLaboratories } from "../services/laboratoryService";
import EquipmentTable from "@/components/equipment/equipment-table";
import EquipmentCards from "@/components/equipment/equipment-cards";
import TablePagination from "@/components/table-pagination";
import EquipmentNavTable from "@/components/equipment/equipment-nav-table";
import { Toaster, toast } from "sonner";
import { DeleteEquipmentModal } from "@/components/equipment/delete-modal";
import { CircleAlert, CircleCheck } from 'lucide-react';
import { useLocation } from "react-router-dom";

// Define Equipment type
interface Equipment {
  inventory_num: string;
  equip_name: string;
  equip_desc?: string | null;
  acq_date?: string | null;
  purchase_price?: number | null;
  equip_status?: string | null;
  equip_quantity?: number | null;
  lab_code: number;
  laboratory?: {
    lab_name: string;
  };
}

// Define Laboratory type
interface Laboratory {
  lab_code: number;
  lab_name: string;
}

export default function Equipment() {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>("inventory_num");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedLaboratory, setSelectedLaboratory] = useState<number | null>(null);
  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const debouncedLoadEquipments = debounce(() => loadEquipments(), 300);

  const location = useLocation();
  const toastDisplayed = useRef(false);

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    equip_status: true,
    acq_date: false,
    purchase_price: false,
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
    window.history.replaceState({}, document.title);
  }, [location.state]);

  // Load equipments when filters or pagination change
  useEffect(() => {
    debouncedLoadEquipments();
    return () => debouncedLoadEquipments.cancel();
  }, [currentPage, itemsPerPage, sortBy, order, searchQuery, selectedLaboratory]);

  // Function to load equipments
  async function loadEquipments() {
    try {
      const data = await fetchEquipment(
        currentPage,
        itemsPerPage,
        sortBy,
        order,
        searchQuery,
        selectedLaboratory
      );

      // Convert Date objects to ISO strings if necessary
      const normalizedEquipments = data.equipments.map(equip => ({
        ...equip,
        acq_date: equip.acq_date instanceof Date ? equip.acq_date.toISOString() : equip.acq_date
      }));
      
      setEquipments(normalizedEquipments);
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
  const openDeleteModal = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setIsDeleteModalOpen(true);
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedEquipment(null);
  };

  // Handle equipment deletion
  const handleDelete = async (): Promise<void> => {
    if (!selectedEquipment) {
      toast.error("No equipment selected", {
        icon: <CircleAlert className="w-4 h-4 text-red-600" />,
      });
      return;
    }
    try {
      const response = await deleteEquipment(selectedEquipment.inventory_num);
      if ("message" in response) {
        toast.success(response.message, {
          icon: <CircleCheck className="w-4 h-4 text-green-600" />,
        });
        loadEquipments();
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
      <EquipmentNavTable
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
        <EquipmentTable
          equipments={equipments}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          toggleSort={toggleSort}
          openDeleteModal={openDeleteModal}
          visibleColumns={visibleColumns}
        />
      </div>

      <div className="md:hidden">
        <EquipmentCards
          equipments={equipments}
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

      <DeleteEquipmentModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
      />

      <Toaster position="bottom-right" />
    </>
  );
}