import { useState, useEffect } from "react";
import debounce from "lodash.debounce";
import { fetchCategories, deleteCategory, updateCategory, createCategory } from "../services/categoryService";
import CategoryTable from "@/components/category/category-table";
import CategoryCards from "@/components/category/category-cards";
import TablePagination from "@/components/table-pagination";
import CategoryNavTable from "@/components/category/category-nav-table";
import { Toaster, toast } from "sonner";
import { AddCategoryModal } from "@/components/category/add-modal";
import { EditCategoryModal } from "@/components/category/edit-modal";
import { DeleteModal } from "@/components/category/delete-modal";
import { CircleAlert, CircleCheck } from 'lucide-react';

// Define Category type
interface Category {
  cat_id: number;
  cat_name: string;
}

export default function Category() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>("cat_name");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const debouncedLoadCategories = debounce(() => loadCategories(), 300);

  useEffect(() => {
    debouncedLoadCategories();
    return () => debouncedLoadCategories.cancel();
  }, [currentPage, itemsPerPage, sortBy, order, searchQuery]);

  async function loadCategories() {
    try {
      const data = await fetchCategories(
        currentPage,
        itemsPerPage,
        sortBy,
        order,
        searchQuery
      );
      setCategories(data.categories);
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

  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedCategory(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedCategory(null);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleDelete = async (): Promise<void> => {
    if (!selectedCategory) {
      toast.error("No category selected", {
        icon: <CircleAlert className="w-4 h-4 text-red-600" />,
      });
      return;
    }
    try {
      const response = await deleteCategory(selectedCategory.cat_id);
      if ("message" in response) {
        toast.success(response.message, {
          icon: <CircleCheck className="w-4 h-4 text-green-600" />,
        });
        loadCategories();
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

  const handleEdit = async (categoryName: string): Promise<void> => {
    if (!selectedCategory) {
      toast.error("No category selected", {
        icon: <CircleAlert className="w-4 h-4 text-red-600" />,
      });
      return;
    }
    try {
      const response = await updateCategory(selectedCategory.cat_id, categoryName);
      toast.success(response.message, {
        icon: <CircleCheck className="w-4 h-4 text-green-600" />,
      });
      loadCategories();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "An unexpected error occurred";
      toast.error(errorMessage, {
        icon: <CircleAlert className="w-4 h-4 text-red-600" />,
      });
    } finally {
      closeEditModal();
    }
  };

  const handleAdd = async (categoryName: string): Promise<void> => {
    try {
      const response = await createCategory(categoryName);
      toast.success(response.message, {
        icon: <CircleCheck className="w-4 h-4 text-green-600" />,
      });
      loadCategories();
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
      <CategoryNavTable
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        setCurrentPage={setCurrentPage}
        openAddModal={openAddModal}
      />

      <div className="hidden md:block">
        <CategoryTable
          categories={categories}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          toggleSort={toggleSort}
          openEditModal={openEditModal}
          openDeleteModal={openDeleteModal}
        />
      </div>

      <div className="md:hidden">
        <CategoryCards
          categories={categories}
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

      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onAdd={handleAdd}
      />

      <EditCategoryModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onEdit={handleEdit}
        selectedCategory={selectedCategory}
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