import { useState, useEffect } from "react";
import debounce from "lodash.debounce";
import { fetchPublishers, deletePublisher, updatePublisher, createPublisher } from "../services/publisherService";
import PublisherTable from "@/components/publisher/publisher-table";
import PublisherCards from "@/components/publisher/publisher-cards";
import TablePagination from "@/components/table-pagination";
import PublisherNavTable from "@/components/publisher/publisher-nav-table";
import { Toaster, toast } from "sonner";
import { AddPublisherModal } from "@/components/publisher/add-modal";
import { EditPublisherModal } from "@/components/publisher/edit-modal";
import { DeletePublisherModal } from "@/components/publisher/delete-modal";
import { CircleAlert, CircleCheck } from 'lucide-react';

// Define Publisher type
interface Publisher {
  publisher_id: number;
  publisher_name: string;
  country?: string | null;
}

export default function Publisher() {
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>("publisher_name");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [selectedPublisher, setSelectedPublisher] = useState<Publisher | null>(null);

  const debouncedLoadPublishers = debounce(() => loadPublishers(), 300);

  useEffect(() => {
    debouncedLoadPublishers();
    return () => debouncedLoadPublishers.cancel();
  }, [currentPage, itemsPerPage, sortBy, order, searchQuery]);

  async function loadPublishers() {
    try {
      const data = await fetchPublishers(
        currentPage,
        itemsPerPage,
        sortBy,
        order,
        searchQuery
      );
      setPublishers(data.publishers);
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

  const openEditModal = (publisher: Publisher) => {
    setSelectedPublisher(publisher);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (publisher: Publisher) => {
    setSelectedPublisher(publisher);
    setIsDeleteModalOpen(true);
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedPublisher(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedPublisher(null);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleDelete = async (): Promise<void> => {
    if (!selectedPublisher) {
      toast.error("No publisher selected", {
        icon: <CircleAlert className="w-4 h-4 text-red-600" />,
      });
      return;
    }
    try {
      const response = await deletePublisher(selectedPublisher.publisher_id);
      if ("message" in response) {
        toast.success(response.message, {
          icon: <CircleCheck className="w-4 h-4 text-green-600" />,
        });
        loadPublishers();
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

  const handleEdit = async (publisherName: string, country?: string): Promise<void> => {
    if (!selectedPublisher) {
      toast.error("No publisher selected", {
        icon: <CircleAlert className="w-4 h-4 text-red-600" />,
      });
      return;
    }
    try {
      const response = await updatePublisher(selectedPublisher.publisher_id, publisherName, country);
      if ("message" in response) {
        toast.success(response.message, {
          icon: <CircleCheck className="w-4 h-4 text-green-600" />,
        });
        loadPublishers();
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "An unexpected error occurred";
      toast.error(errorMessage, {
        icon: <CircleAlert className="w-4 h-4 text-red-600" />,
      });
    } finally {
      closeEditModal();
    }
  };

  const handleAdd = async (publisherName: string, country?: string): Promise<void> => {
    try {
      const response = await createPublisher(publisherName, country);
      if ("message" in response) {
        toast.success(response.message, {
          icon: <CircleCheck className="w-4 h-4 text-green-600" />,
        });
        loadPublishers();
      }
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
      <PublisherNavTable
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        setCurrentPage={setCurrentPage}
        openAddModal={openAddModal}
      />

      <div className="hidden md:block">
        <PublisherTable
          publishers={publishers}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          toggleSort={toggleSort}
          openEditModal={openEditModal}
          openDeleteModal={openDeleteModal}
        />
      </div>

      <div className="md:hidden">
        <PublisherCards
          publishers={publishers}
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

      <AddPublisherModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onAdd={handleAdd}
      />

      <EditPublisherModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onEdit={handleEdit}
        selectedPublisher={selectedPublisher}
      />

      <DeletePublisherModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
      />

      <Toaster position="bottom-right" />
    </>
  );
}