import { useState, useEffect } from "react";
import debounce from "lodash.debounce";
import { fetchDepartments, deleteDepartment, updateDepartment, createDepartment } from "../services/departmentService";
import DepartmentTable from "@/components/department/department-table";
import DepartmentCards from "@/components/department/department-cards";
import TablePagination from "@/components/table-pagination";
import DepartmentNavTable from "@/components/department/department-nav-table";
import { Toaster, toast } from "sonner";
import { AddModal } from "@/components/department/add-modal";
import { EditModal } from "@/components/department/edit-modal";
import { DeleteModal } from "@/components/department/delete-modal";
import { CircleAlert, CircleCheck } from 'lucide-react';

// Define Department type
interface Department {
  dept_id: number;
  dept_name: string;
}

export default function Department() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>("dept_name");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

  const debouncedLoadDepartments = debounce(() => loadDepartments(), 300);

  useEffect(() => {
    debouncedLoadDepartments();
    return () => debouncedLoadDepartments.cancel();
  }, [currentPage, itemsPerPage, sortBy, order, searchQuery]);

  async function loadDepartments() {
    try {
      const data = await fetchDepartments(
        currentPage,
        itemsPerPage,
        sortBy,
        order,
        searchQuery
      );
      setDepartments(data.departments);
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

  const openEditModal = (department: Department) => {
    setSelectedDepartment(department);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (department: Department) => {
    setSelectedDepartment(department);
    setIsDeleteModalOpen(true);
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedDepartment(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedDepartment(null);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleDelete = async (): Promise<void> => {
    if (!selectedDepartment) {
      toast.error("No department selected", {
        icon: <CircleAlert className="w-4 h-4 text-red-600" />,
      });
      return;
    }
    try {
      const response = await deleteDepartment(selectedDepartment.dept_id);
      if ("message" in response) {
        toast.success(response.message, {
          icon: <CircleCheck className="w-4 h-4 text-green-600" />,
        });
        loadDepartments();
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

  const handleEdit = async (deptName: string): Promise<void> => {
    if (!selectedDepartment) {
      toast.error("No department selected", {
        icon: <CircleAlert className="w-4 h-4 text-red-600" />,
      });
      return;
    }
    try {
      const response = await updateDepartment(selectedDepartment.dept_id, deptName);
      toast.success(response.message, {
        icon: <CircleCheck className="w-4 h-4 text-green-600" />,
      });
      loadDepartments();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "An unexpected error occurred";
      toast.error(errorMessage, {
        icon: <CircleAlert className="w-4 h-4 text-red-600" />,
      });
    } finally {
      closeEditModal();
    }
  };

  const handleAdd = async (deptName: string): Promise<void> => {
    try {
      const response = await createDepartment(deptName);
      toast.success(response.message, {
        icon: <CircleCheck className="w-4 h-4 text-green-600" />,
      });
      loadDepartments();
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
      <DepartmentNavTable
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        setCurrentPage={setCurrentPage}
        openAddModal={openAddModal}
      />

      <div className="hidden md:block">
        <DepartmentTable
          departments={departments}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          toggleSort={toggleSort}
          openEditModal={openEditModal}
          openDeleteModal={openDeleteModal}
        />
      </div>

      <div className="md:hidden">
        <DepartmentCards
          departments={departments}
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
        selectedDepartment={selectedDepartment}
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