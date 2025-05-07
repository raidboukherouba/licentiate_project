import { useState, useEffect, useRef } from "react";
import debounce from "lodash.debounce";
import { fetchReviews, deleteReview } from "../services/reviewService";
import { fetchAllPublishers } from "../services/publisherService";
import ReviewsTable from "@/components/review/review-table";
import ReviewCards from "@/components/review/review-cards";
import TablePagination from "@/components/table-pagination";
import ReviewNavTable from "@/components/review/review-nav-table";
import { Toaster, toast } from "sonner";
import { DeleteReviewModal } from "@/components/review/delete-modal";
import { CircleAlert, CircleCheck } from 'lucide-react';
import { useLocation } from "react-router-dom";

// Category type
interface Category {
  cat_id: number;
  cat_name: string;
}

// ReviewSpeciality type
interface ReviewSpeciality {
  spec_id_review: number;
  spec_name_review: string;
}

interface Review {
  review_num: number;
  review_title: string;
  issn: string;
  e_issn?: string | null;
  review_vol?: string | null;
  publisher_id: number;
  publisher_name?: string;
}

interface Publisher {
  publisher_id: number;
  publisher_name: string;
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>("review_num");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [publishers, setPublishers] = useState<Publisher[]>([]); // Add faculties state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const debouncedLoadReviews = debounce(() => loadReviews(), 300);

  const location = useLocation();
  const toastDisplayed = useRef(false);

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    e_issn: true,
    review_vol: false,
    publisher: true,
  });

  // Fetch publishers on component mount
  useEffect(() => {
    async function loadPublishers() {
      try {
        const data = await fetchAllPublishers();
        setPublishers(data.publishers);
      } catch (error) {
        console.error((error as Error).message);
      }
    }

    loadPublishers();
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

  // Load reviews when filters or pagination change
  useEffect(() => {
    debouncedLoadReviews();
    return () => debouncedLoadReviews.cancel();
  }, [currentPage, itemsPerPage, sortBy, order, searchQuery]);

  // Function to load reviews
  async function loadReviews() {
    try {
      const data = await fetchReviews(
        currentPage,
        itemsPerPage,
        sortBy,
        order,
        searchQuery
      );
      
      setReviews(data.reviews);
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
  const openDeleteModal = (review: Review) => {
    setSelectedReview(review);
    setIsDeleteModalOpen(true);
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedReview(null);
  };

  // Handle review deletion
  const handleDelete = async (): Promise<void> => {
    if (!selectedReview) {
      toast.error("No review selected", {
        icon: <CircleAlert className="w-4 h-4 text-red-600" />,
      });
      return;
    }
    try {
      const response = await deleteReview(selectedReview.review_num);
      if ("message" in response) {
        toast.success(response.message, {
          icon: <CircleCheck className="w-4 h-4 text-green-600" />,
        });
        loadReviews();
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
      <ReviewNavTable
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        setCurrentPage={setCurrentPage}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
      />

      <div className="hidden md:block">
        <ReviewsTable
          reviews={reviews}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          toggleSort={toggleSort}
          openDeleteModal={openDeleteModal}
          visibleColumns={visibleColumns}
        />
      </div>

      <div className="md:hidden">
        <ReviewCards
          reviews={reviews}
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

      <DeleteReviewModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
      />

      <Toaster position="bottom-right" />
    </>
  );
}