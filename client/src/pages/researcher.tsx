import { useState, useEffect, useRef } from "react";
import debounce from "lodash.debounce";
import { fetchResearchers, deleteResearcher } from "../services/researcherService";
import ResearcherTable from "@/components/researcher/researcher-table";
import ResearcherCards from "@/components/researcher/resaercher-cards";
import TablePagination from "@/components/table-pagination";
import ResearcherNavTable from "@/components/researcher/researcher-nav-table";
import { Toaster, toast } from "sonner";
import { DeleteResearcherModal } from "@/components/researcher/delete-modal";
import { CircleAlert, CircleCheck } from 'lucide-react';
import { useLocation } from "react-router-dom";
import { fetchAllTeams } from "@/services/teamService";
import { fetchAllLaboratories } from "@/services/laboratoryService";

// Define Researcher type
interface Researcher {
  res_code: number;
  res_fname: string;
  res_lname: string;
  res_fname_ar: string;
  res_lname_ar: string;
  res_gender: 'Male' | 'Female';
  res_prof_email: string;
  res_grade?: string | null;
  res_phone?: string | null;
  team_id: number;
  team?: {
    team_name: string;
  };
  function?: {
    func_name: string;
  };
  speciality?: {
    spec_name: string;
  };
  laboratory?: {
    lab_name: string;
  };
}

// Define Team type
interface Team {
  team_id: number;
  team_name: string;
}

// Define Team type
interface Laboratory {
  lab_code: number;
  lab_name: string;
}

export default function Researcher() {
  const [researchers, setResearchers] = useState<Researcher[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>("res_fname");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedLaboratory, setSelectedLaboratory] = useState<number | null>(null);
  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedResearcher, setSelectedResearcher] = useState<Researcher | null>(null);
  const debouncedLoadResearchers = debounce(() => loadResearchers(), 300);

  const location = useLocation();
  const toastDisplayed = useRef(false);

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    res_prof_email: true,
    func_name: true,
    res_grade: false,
    res_phone: false,
  });

  // Fetch teams on component mount
  useEffect(() => {
    async function loadTeams() {
      try {
        const data = await fetchAllTeams();
        setTeams(data.teams);
      } catch (error) {
        console.error((error as Error).message);
      }
    }

    loadTeams();
  }, []);

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

    toastDisplayed.current = true; // Prevent duplicate toasts

    // Clear navigation state after displaying the toast
    window.history.replaceState({}, document.title);
  }, [location.state]);

  // Load researchers when filters or pagination change
  useEffect(() => {
    debouncedLoadResearchers();
    return () => debouncedLoadResearchers.cancel();
  }, [currentPage, itemsPerPage, sortBy, order, searchQuery, selectedTeam, selectedLaboratory]);

  // Function to load researchers
  async function loadResearchers() {
    try {
      const data = await fetchResearchers(
        currentPage,
        itemsPerPage,
        sortBy,
        order,
        searchQuery,
        selectedTeam,
        selectedLaboratory
      );
      setResearchers(data.researchers);
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
  const openDeleteModal = (researcher: Researcher) => {
    setSelectedResearcher(researcher);
    setIsDeleteModalOpen(true);
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedResearcher(null);
  };

  // Handle researcher deletion
  const handleDelete = async (): Promise<void> => {
    if (!selectedResearcher) {
      toast.error("No researcher selected", {
        icon: <CircleAlert className="w-4 h-4 text-red-600" />,
      });
      return;
    }
    try {
      const response = await deleteResearcher(selectedResearcher.res_code);
      if ("message" in response) {
        toast.success(response.message, {
          icon: <CircleCheck className="w-4 h-4 text-green-600" />,
        });
        loadResearchers();
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
      <ResearcherNavTable
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        setCurrentPage={setCurrentPage}
        selectedTeam={selectedTeam}
        setSelectedTeam={setSelectedTeam}
        teams={teams}
        selectedLaboratory={selectedLaboratory}
        setSelectedLaboratory={setSelectedLaboratory}
        laboratories={laboratories}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
      />

      <div className="hidden md:block">
        <ResearcherTable
          researchers={researchers}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          toggleSort={toggleSort}
          openDeleteModal={openDeleteModal}
          visibleColumns={visibleColumns}
        />
      </div>

      <div className="md:hidden">
        <ResearcherCards
          researchers={researchers}
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

      <DeleteResearcherModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
      />

      <Toaster position="bottom-right" />
    </>
  );
}