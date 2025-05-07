import { useState, useEffect } from "react";
import debounce from "lodash.debounce";
import {
  fetchReviewSpecialities,
  deleteReviewSpeciality,
  updateReviewSpeciality,
  createReviewSpeciality,
} from "../services/reviewSpecialityService";
import ReviewSpecialityTable from "@/components/review-speciality/review-speciality-table";
import ReviewSpecialityCards from "@/components/review-speciality/review-speciality-cards";
import TablePagination from "@/components/table-pagination";
import ReviewSpecialityNavTable from "@/components/review-speciality/review-speciality-nav-table";
import { Toaster, toast } from "sonner";
import { AddModal } from "@/components/review-speciality/add-modal";
import { EditModal } from "@/components/review-speciality/edit-modal";
import { DeleteModal } from "@/components/review-speciality/delete-modal";
import { CircleAlert, CircleCheck } from "lucide-react";

// Define ReviewSpeciality type
interface ReviewSpeciality {
  spec_id_review: number;
  spec_name_review: string;
}

export default function ReviewSpeciality() {
  const [reviewSpecialities, setReviewSpecialities] = useState<ReviewSpeciality[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>("spec_name_review");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [selectedReviewSpeciality, setSelectedReviewSpeciality] = useState<ReviewSpeciality | null>(null);

  const debouncedLoadReviewSpecialities = debounce(() => loadReviewSpecialities(), 300);

  useEffect(() => {
    debouncedLoadReviewSpecialities();
    return () => debouncedLoadReviewSpecialities.cancel();
  }, [currentPage, itemsPerPage, sortBy, order, searchQuery]);

  async function loadReviewSpecialities() {
    try {
      const data = await fetchReviewSpecialities(
        currentPage,
        itemsPerPage,
        sortBy,
        order,
        searchQuery
      );
      setReviewSpecialities(data.reviewSpecialities);
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

  const openEditModal = (spec: ReviewSpeciality) => {
    setSelectedReviewSpeciality(spec);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (spec: ReviewSpeciality) => {
    setSelectedReviewSpeciality(spec);
    setIsDeleteModalOpen(true);
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedReviewSpeciality(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedReviewSpeciality(null);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleDelete = async (): Promise<void> => {
    if (!selectedReviewSpeciality) {
      toast.error("No review speciality selected", {
        icon: <CircleAlert className="w-4 h-4 text-red-600" />,
      });
      return;
    }
    try {
      const response = await deleteReviewSpeciality(selectedReviewSpeciality.spec_id_review);
      if ("message" in response) {
        toast.success(response.message, {
          icon: <CircleCheck className="w-4 h-4 text-green-600" />,
        });
        loadReviewSpecialities();
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
    if (!selectedReviewSpeciality) {
      toast.error("No review speciality selected", {
        icon: <CircleAlert className="w-4 h-4 text-red-600" />,
      });
      return;
    }
    try {
      const response = await updateReviewSpeciality(selectedReviewSpeciality.spec_id_review, specName);
      toast.success(response.message, {
        icon: <CircleCheck className="w-4 h-4 text-green-600" />,
      });
      loadReviewSpecialities();
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
      const response = await createReviewSpeciality(specName);
      toast.success(response.message, {
        icon: <CircleCheck className="w-4 h-4 text-green-600" />,
      });
      loadReviewSpecialities();
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
      <ReviewSpecialityNavTable
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        setCurrentPage={setCurrentPage}
        openAddModal={openAddModal}
      />

      <div className="hidden md:block">
        <ReviewSpecialityTable
          reviewSpecialities={reviewSpecialities}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          toggleSort={toggleSort}
          openEditModal={openEditModal}
          openDeleteModal={openDeleteModal}
        />
      </div>

      <div className="md:hidden">
        <ReviewSpecialityCards
          reviewSpecialities={reviewSpecialities}
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
        selectedReviewSpeciality={selectedReviewSpeciality}
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