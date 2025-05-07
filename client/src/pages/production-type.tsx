import { useState, useEffect } from "react";
import debounce from "lodash.debounce";
import { fetchProductionTypes, deleteProductionType, updateProductionType, createProductionType } from "../services/productionTypeService";
import ProductionTypeTable from "@/components/production-type/production-type-table";
import ProductionTypeCards from "@/components/production-type/production-type-cards";
import TablePagination from "@/components/table-pagination";
import ProductionTypeNavTable from "@/components/production-type/production-type-nav-table";
import { Toaster, toast } from "sonner";
import { AddModal } from "@/components/production-type/add-modal";
import { EditModal } from "@/components/production-type/edit-modal";
import { DeleteModal } from "@/components/production-type/delete-modal";
import { CircleAlert, CircleCheck } from 'lucide-react';

// Define ProductionType type
interface ProductionType {
  type_id: number;
  type_name: string;
}

export default function ProductionType() {
  const [productionTypes, setProductionTypes] = useState<ProductionType[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>("type_name");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [selectedProductionType, setSelectedProductionType] = useState<ProductionType | null>(null);

  const debouncedLoadProductionTypes = debounce(() => loadProductionTypes(), 300);

  useEffect(() => {
    debouncedLoadProductionTypes();
    return () => debouncedLoadProductionTypes.cancel();
  }, [currentPage, itemsPerPage, sortBy, order, searchQuery]);

  async function loadProductionTypes() {
    try {
      const data = await fetchProductionTypes(
        currentPage,
        itemsPerPage,
        sortBy,
        order,
        searchQuery
      );
      setProductionTypes(data.productionTypes);
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

  const openEditModal = (productionType: ProductionType) => {
    setSelectedProductionType(productionType);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (productionType: ProductionType) => {
    setSelectedProductionType(productionType);
    setIsDeleteModalOpen(true);
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedProductionType(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedProductionType(null);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleDelete = async (): Promise<void> => {
    if (!selectedProductionType) {
      toast.error("No production type selected", {
        icon: <CircleAlert className="w-4 h-4 text-red-600" />,
      });
      return;
    }
    try {
      const response = await deleteProductionType(selectedProductionType.type_id);
      if ("message" in response) {
        toast.success(response.message, {
          icon: <CircleCheck className="w-4 h-4 text-green-600" />,
        });
        loadProductionTypes();
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

  const handleEdit = async (typeName: string): Promise<void> => {
    if (!selectedProductionType) {
      toast.error("No production type selected", {
        icon: <CircleAlert className="w-4 h-4 text-red-600" />,
      });
      return;
    }
    try {
      const response = await updateProductionType(selectedProductionType.type_id, typeName);
      toast.success(response.message, {
        icon: <CircleCheck className="w-4 h-4 text-green-600" />,
      });
      loadProductionTypes();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "An unexpected error occurred";
      toast.error(errorMessage, {
        icon: <CircleAlert className="w-4 h-4 text-red-600" />,
      });
    } finally {
      closeEditModal();
    }
  };

  const handleAdd = async (typeName: string): Promise<void> => {
    try {
      const response = await createProductionType(typeName);
      toast.success(response.message, {
        icon: <CircleCheck className="w-4 h-4 text-green-600" />,
      });
      loadProductionTypes();
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
      <ProductionTypeNavTable
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        setCurrentPage={setCurrentPage}
        openAddModal={openAddModal}
      />

      <div className="hidden md:block">
        <ProductionTypeTable
          productionTypes={productionTypes}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          toggleSort={toggleSort}
          openEditModal={openEditModal}
          openDeleteModal={openDeleteModal}
        />
      </div>

      <div className="md:hidden">
        <ProductionTypeCards
          productionTypes={productionTypes}
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
        selectedProductionType={selectedProductionType}
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