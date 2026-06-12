import { useEffect, useMemo, useState } from "react";
import { StatusType } from "@/components/shared/filter/SelectStatus";
import { UserType, KelasType, ProdiType } from "@/types/pengguna";
import {
  GetRole,
  CreateUser,
  UpdateUser,
} from "@/components/pengguna/apiPengguna";

const ITEMS_PER_PAGE = 9;
const itemsPerPageKps = 9;

export function useUsers() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<StatusType | null>(null);
  const [pageMhs, setPageMhs] = useState(1);
  const [pageKps, setPageKps] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  /* ---------- Load ---------- */
  const loadUsers = async () => {
    try {
      setIsLoading(true);

      const [kpsRes, mhsRes] = await Promise.all([
        GetRole("KPS"),
        GetRole("Ketua PBL"),
      ]);

      setUsers([...kpsRes.data, ...mhsRes.data]);
    } catch (error) {
      console.error(error);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  /* ---------- Filter ---------- */
  const filterData = (data: UserType[]) =>
    data.filter((item) => {
      const matchName = item.nama
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchStatus = selectedStatus
        ? item.status === selectedStatus.value
        : true;
      return matchName && matchStatus;
    });

  const filteredKps = useMemo(
    () => filterData(users.filter((u) => u.role === "KPS")),
    [users, searchTerm, selectedStatus],
  );

  const filteredMhs = useMemo(
    () => filterData(users.filter((u) => u.role !== "KPS")),
    [users, searchTerm, selectedStatus],
  );

  /* ---------- Pagination ---------- */
  useEffect(() => {
    setPageMhs(1);
  }, [searchTerm, selectedStatus]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredMhs.length / ITEMS_PER_PAGE),
  );

  const totalPagesKps = Math.ceil(
    filteredKps.length / itemsPerPageKps
  );

  const paginatedMhs = filteredMhs.slice(
    (pageMhs - 1) * ITEMS_PER_PAGE,
    pageMhs * ITEMS_PER_PAGE,
  );

  const paginatedKps = filteredKps.slice(
    (pageKps - 1) * itemsPerPageKps,
    pageKps * itemsPerPageKps
  );

  const nextPage = () => setPageMhs((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setPageMhs((p) => Math.max(p - 1, 1));

  const nextPageKps = () => {
    if (pageKps < totalPagesKps) {
      setPageKps(pageKps + 1);
    }
  };

  const prevPageKps = () => {
    if (pageKps > 1) {
      setPageKps(pageKps - 1);
    }
  };

  /* ---------- CRUD ---------- */
  const addUser = async (newUser: Omit<UserType, "id">) => {
    try {
      await CreateUser({
        nama: newUser.nama,
        email: newUser.email,
        role: newUser.role,

        prodi:
          typeof newUser.prodi === "object"
            ? newUser.prodi.kode_prodi
            : newUser.prodi,

        kelas:
          typeof newUser.kelas === "object"
            ? String(newUser.kelas.id_kelas)
            : newUser.kelas,
      });

      await loadUsers();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const updateUser = async (user: UserType) => {
    try {
      await UpdateUser(user);
      await loadUsers();
      return true; // ← tambah ini
    } catch (error) {
      console.error(error);
      return false; // ← tambah ini
    }
  };

  const toggleStatus = async (user: UserType) => {
    const updated = {
      ...user,
      status: user.status === "Aktif" ? "Tidak Aktif" : "Aktif",
    };
    const success = await updateUser(updated);
    return { updated, success }; // ← return keduanya
  };

  return {
    users,
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    pageMhs,
    totalPages,
    filteredKps,
    paginatedKps,
    pageKps,
    totalPagesKps,
    nextPageKps,
    prevPageKps,
    paginatedMhs,
    nextPage,
    prevPage,
    addUser,
    updateUser,
    toggleStatus,
    isLoading,
  };
}
