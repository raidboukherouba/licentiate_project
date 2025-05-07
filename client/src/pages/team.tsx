import { useState, useEffect } from "react";
import debounce from "lodash.debounce";
import { fetchTeams, deleteTeam, updateTeam, createTeam } from "../services/teamService";
import TeamTable from "@/components/team/team-table";
import TeamCards from "@/components/team/team-cards";
import TablePagination from "@/components/table-pagination";
import TeamNavTable from "@/components/team/team-nav-table";
import { Toaster, toast } from "sonner";
import { AddTeamModal } from "@/components/team/add-modal";
import { EditTeamModal } from "@/components/team/edit-modal";
import { DeleteTeamModal } from "@/components/team/delete-modal";
import { CircleAlert, CircleCheck } from 'lucide-react';

// Define Team type
interface Team {
  team_id: number;
  team_name: string;
  team_abbr?: string | null;
  team_desc?: string | null;
}

export default function Team() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>("team_name");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const debouncedLoadTeams = debounce(() => loadTeams(), 300);

  useEffect(() => {
    debouncedLoadTeams();
    return () => debouncedLoadTeams.cancel();
  }, [currentPage, itemsPerPage, sortBy, order, searchQuery]);

  async function loadTeams() {
    try {
      const data = await fetchTeams(
        currentPage,
        itemsPerPage,
        sortBy,
        order,
        searchQuery
      );
      setTeams(data.teams);
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

  const openEditModal = (team: Team) => {
    setSelectedTeam(team);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (team: Team) => {
    setSelectedTeam(team);
    setIsDeleteModalOpen(true);
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedTeam(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedTeam(null);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleDelete = async (): Promise<void> => {
    if (!selectedTeam) {
      toast.error("No team selected", {
        icon: <CircleAlert className="w-4 h-4 text-red-600" />,
      });
      return;
    }
    try {
      const response = await deleteTeam(selectedTeam.team_id);
      if ("message" in response) {
        toast.success(response.message, {
          icon: <CircleCheck className="w-4 h-4 text-green-600" />,
        });
        loadTeams();
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

  const handleEdit = async (
    teamName: string,
    teamAbbr?: string,
    teamDesc?: string
  ): Promise<void> => {
    if (!selectedTeam) {
      toast.error("No team selected", {
        icon: <CircleAlert className="w-4 h-4 text-red-600" />,
      });
      return;
    }
    try {
      const response = await updateTeam(
        selectedTeam.team_id,
        teamName,
        teamAbbr,
        teamDesc
      );

      if ("message" in response) {
        toast.success(response.message, {
          icon: <CircleCheck className="w-4 h-4 text-green-600" />,
        });
        loadTeams();
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

  const handleAdd = async (
    teamName: string,
    teamAbbr?: string,
    teamDesc?: string
  ): Promise<void> => {
    try {
      const response = await createTeam(
        teamName,
        teamAbbr,
        teamDesc
      );

      if ("message" in response) {
        toast.success(response.message, {
          icon: <CircleCheck className="w-4 h-4 text-green-600" />,
        });
        loadTeams();
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
      <TeamNavTable
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        setCurrentPage={setCurrentPage}
        openAddModal={openAddModal}
      />

      <div className="hidden md:block">
        <TeamTable
          teams={teams}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          toggleSort={toggleSort}
          openEditModal={openEditModal}
          openDeleteModal={openDeleteModal}
        />
      </div>

      <div className="md:hidden">
        <TeamCards
          teams={teams}
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

      <AddTeamModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onAdd={handleAdd}
      />

      <EditTeamModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onEdit={handleEdit}
        selectedTeam={selectedTeam}
      />

      <DeleteTeamModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
      />

      <Toaster position="bottom-right" />
    </>
  );
}