import { useState, useEffect, useRef } from "react";
import debounce from "lodash.debounce";
import { fetchPublications, deletePublication } from "../services/publicationService";
import { fetchAllProductionTypes } from "../services/productionTypeService";
import PublicationsTable from "@/components/publication/publication-table";
import PublicationCards from "@/components/publication/publication-cards";
import TablePagination from "@/components/table-pagination";
import PublicationNavTable from "@/components/publication/publication-nav-table";
import { Toaster, toast } from "sonner";
import { DeletePublicationModal } from "@/components/publication/delete-modal";
import { CircleAlert, CircleCheck } from 'lucide-react';
import { useLocation } from "react-router-dom";
import { fetchAllLaboratories } from "../services/laboratoryService";
import { fetchAllReviews } from "../services/reviewService";

interface Researcher {
  res_code: number;
  res_fname: string;
  res_lname: string;
}

interface DoctoralStudent {
  reg_num: number;
  doc_stud_fname: string;
  doc_stud_lname: string;
}

interface Publication {
  doi: string;
  article_title: string;
  submission_date: string;
  acceptance_date: string;
  pub_pages?: string | null;
  review_num: number;
  type_id: number;
  review?: {
    review_title?: string;
  };
  production_type?: {
    type_name?: string;
  };
}

interface ProductionType {
  type_id: number;
  type_name: string;
}

interface Review {
  review_num: number;
  review_title: string;
}

interface Laboratory {
  lab_code: number;
  lab_name: string;
}

export default function Publications() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>("submission_date");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedLaboratory, setSelectedLaboratory] = useState<number | null>(null);
  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  const [productionTypes, setProductionTypes] = useState<ProductionType[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
  const debouncedLoadPublications = debounce(() => loadPublications(), 300);

  const location = useLocation();
  const toastDisplayed = useRef(false);

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    pub_pages: false,
    review: false,
    production_type: false,
  });

  // Fetch laboratories and reviews on component mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [labsData, reviewsData] = await Promise.all([
          fetchAllLaboratories(),
          fetchAllReviews()
        ]);
        setLaboratories(labsData.laboratories);
        setReviews(reviewsData.reviews);
      } catch (error) {
        console.error((error as Error).message);
      }
    }

    loadInitialData();
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

  // Load publications when filters or pagination change
  useEffect(() => {
    debouncedLoadPublications();
    return () => debouncedLoadPublications.cancel();
  }, [currentPage, itemsPerPage, sortBy, order, searchQuery, selectedLaboratory]);

  // Function to load publications
  async function loadPublications() {
    try {
      const data = await fetchPublications(
        currentPage,
        itemsPerPage,
        sortBy,
        order,
        searchQuery,
        selectedLaboratory
      );
      
      setPublications(data.publications);
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
  const openDeleteModal = (publication: Publication) => {
    setSelectedPublication(publication);
    setIsDeleteModalOpen(true);
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedPublication(null);
  };

  // Handle publication deletion
  const handleDelete = async (): Promise<void> => {
    if (!selectedPublication) {
      toast.error("No publication selected", {
        icon: <CircleAlert className="w-4 h-4 text-red-600" />,
      });
      return;
    }
    try {
      const response = await deletePublication(selectedPublication.doi);
      if ("message" in response) {
        toast.success(response.message, {
          icon: <CircleCheck className="w-4 h-4 text-green-600" />,
        });
        loadPublications();
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
      <PublicationNavTable
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
        <PublicationsTable
          publications={publications}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          toggleSort={toggleSort}
          openDeleteModal={openDeleteModal}
          visibleColumns={visibleColumns}
        />
      </div>

      <div className="md:hidden">
        <PublicationCards
          publications={publications}
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

      <DeletePublicationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
      />

      <Toaster position="bottom-right" />
    </>
  );
}