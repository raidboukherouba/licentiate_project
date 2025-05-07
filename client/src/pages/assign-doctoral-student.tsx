import { useState, useEffect, useRef } from "react";
import debounce from "lodash.debounce";
import { fetchAssignDoctoralStudents, deleteAssignDoctoralStudent } from "../services/assignDoctoralStudentService";
import AssignDoctoralStudentTable from "@/components/assign-doctoral-student/assign-doctoral-student-table";
import AssignDoctoralStudentCards from "@/components/assign-doctoral-student/assign-doctoral-student-cards";
import TablePagination from "@/components/table-pagination";
import AssignDoctoralStudentNavTable from "@/components/assign-doctoral-student/assign-doctoral-student-nav-table";
import { Toaster, toast } from "sonner";
import { DeleteAssignDoctoralStudentModal } from "@/components/assign-doctoral-student/delete-modal";
import { CircleAlert, CircleCheck } from 'lucide-react';
import { useLocation } from "react-router-dom";
import { fetchAllLaboratories } from "@/services/laboratoryService";

// Define AssignDoctoralStudent type
interface AssignDoctoralStudent {
  reg_num: number;
  inventory_num: string;
  doc_stud_assign_date: string;
  doc_stud_return_date?: string | null;
  DoctoralStudent?: {
    doc_stud_fname: string;
    doc_stud_lname: string;
    doc_stud_email: string;
    lab_code: number;
    laboratory?: {
      lab_name: string;
    };
  };
  Equipment?: {
    equip_name: string;
    inventory_num: string;
  };
}

// Define Laboratory type for filtering
interface Laboratory {
  lab_code: number;
  lab_name: string;
}

export default function AssignDoctoralStudent() {
  const [assignments, setAssignments] = useState<AssignDoctoralStudent[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>("reg_num");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedLab, setSelectedLab] = useState<number | null>(null);
  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedAssignment, setSelectedAssignment] = useState<AssignDoctoralStudent | null>(null);
  const debouncedLoadAssignments = debounce(() => loadAssignments(), 300);

  const location = useLocation();
  const toastDisplayed = useRef(false);

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    doc_stud_assign_date: true,
    doc_stud_return_date: true,
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

  // Load assignments when filters or pagination change
  useEffect(() => {
    debouncedLoadAssignments();
    return () => debouncedLoadAssignments.cancel();
  }, [currentPage, itemsPerPage, sortBy, order, searchQuery, selectedLab]);

  // Function to load assignments
  async function loadAssignments() {
    try {
      const data = await fetchAssignDoctoralStudents(
        currentPage,
        itemsPerPage,
        sortBy,
        order,
        searchQuery,
        selectedLab
      );
      setAssignments(data.assignments);
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
  const openDeleteModal = (assignment: AssignDoctoralStudent) => {
    setSelectedAssignment(assignment);
    setIsDeleteModalOpen(true);
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedAssignment(null);
  };

  // Handle assignment deletion
  const handleDelete = async (): Promise<void> => {
    if (!selectedAssignment) {
      toast.error("No assignment selected", {
        icon: <CircleAlert className="w-4 h-4 text-red-600" />,
      });
      return;
    }
    try {
      const response = await deleteAssignDoctoralStudent(
        selectedAssignment.reg_num,
        selectedAssignment.inventory_num
      );
      if ("message" in response) {
        toast.success(response.message, {
          icon: <CircleCheck className="w-4 h-4 text-green-600" />,
        });
        loadAssignments();
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
      <AssignDoctoralStudentNavTable
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
        <AssignDoctoralStudentTable
          assignments={assignments}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          toggleSort={toggleSort}
          openDeleteModal={openDeleteModal}
          visibleColumns={visibleColumns}
        />
      </div>

      <div className="md:hidden">
        <AssignDoctoralStudentCards
          assignments={assignments}
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

      <DeleteAssignDoctoralStudentModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
      />

      <Toaster position="bottom-right" />
    </>
  );
}