import { useState, useEffect } from "react";
import debounce from "lodash.debounce";
import { fetchFunctions, deleteFunction, updateFunction, createFunction } from "../services/functionService";
import FunctionTable from "@/components/function/function-table";
import FunctionCards from "@/components/function/function-cards";
import TablePagination from "@/components/table-pagination";
import FunctionNavTable from "@/components/function/function-nav-table";
import { Toaster, toast } from "sonner";
import { AddModal } from "@/components/function/add-modal";
import { EditModal } from "@/components/function/edit-modal";
import { DeleteModal } from "@/components/function/delete-modal";
import { CircleAlert, CircleCheck } from 'lucide-react';

// Define Function type
interface Function {
  func_code: number;
  func_name: string;
}

export default function Function() {
  const [functions, setFunctions] = useState<Function[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>("func_name");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [selectedFunction, setSelectedFunction] = useState<Function | null>(null);

  const debouncedLoadFunctions = debounce(() => loadFunctions(), 300);

  useEffect(() => {
    debouncedLoadFunctions();
    return () => debouncedLoadFunctions.cancel();
  }, [currentPage, itemsPerPage, sortBy, order, searchQuery]);

  async function loadFunctions() {
    try {
      const data = await fetchFunctions(
        currentPage,
        itemsPerPage,
        sortBy,
        order,
        searchQuery
      );
      setFunctions(data.functions);
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

  const openEditModal = (func: Function) => {
    setSelectedFunction(func);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (func: Function) => {
    setSelectedFunction(func);
    setIsDeleteModalOpen(true);
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedFunction(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedFunction(null);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleDelete = async (): Promise<void> => {
    if (!selectedFunction) {
      toast.error("No function selected", {
        icon: <CircleAlert className="w-4 h-4 text-red-600" />,
      });
      return;
    }
    try {
      const response = await deleteFunction(selectedFunction.func_code);
      if ("message" in response) {
        toast.success(response.message, {
          icon: <CircleCheck className="w-4 h-4 text-green-600" />,
        });
        loadFunctions();
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

  const handleEdit = async (funcName: string): Promise<void> => {
    if (!selectedFunction) {
      toast.error("No function selected", {
        icon: <CircleAlert className="w-4 h-4 text-red-600" />
      });
      return;
    }
    try {
      const response = await updateFunction(selectedFunction.func_code, funcName);
      toast.success(response.message, {
        icon: <CircleCheck className="w-4 h-4 text-green-600" />
      });
      loadFunctions();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "An unexpected error occurred";
      toast.error(errorMessage, {
        icon: <CircleAlert className="w-4 h-4 text-red-600" />,
      });
    } finally {
      closeEditModal();
    }
  };

  const handleAdd = async (funcName: string): Promise<void> => {
    try {
      const response = await createFunction(funcName);
      toast.success(response.message, {
        icon: <CircleCheck className="w-4 h-4 text-green-600" />
      });
      loadFunctions();
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
      <FunctionNavTable
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        setCurrentPage={setCurrentPage}
        openAddModal={openAddModal}
      />

      <div className="hidden md:block">
        <FunctionTable
          functions={functions}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          toggleSort={toggleSort}
          openEditModal={openEditModal}
          openDeleteModal={openDeleteModal}
        />
      </div>

      <div className="md:hidden">
        <FunctionCards
          functions={functions}
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
        selectedFunction={selectedFunction}
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