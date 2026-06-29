"use client";

import { useEffect, useState } from "react";

import NavAdmin from "@/components/shared/ui/NavAdmin";
import SearchBar from "@/components/shared/filter/SearchBar";
import SelectStatus from "@/components/shared/filter/SelectStatus";

import UserCard from "./UserCard";
import UserDetail from "./UserDetail";
import SectionHeader from "./SectionHeader";
import FormTambahUser from "./FormTambahUser";
import { PRODI_OPTIONS, KELAS_OPTIONS } from "@/types/pameran";
import { useUsers } from "@/hooks/userHook/useUser";
import { UserType } from "@/types/pengguna";
import { showToast } from "@/components/shared/ui/ToastNotification";

export default function Admin() {
  const {
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    filteredKps,
    paginatedKps,
    pageKps,
    totalPagesKps,
    nextPageKps,
    prevPageKps,
    paginatedMhs,
    pageMhs,
    totalPages,
    nextPage,
    prevPage,
    addUser,
    updateUser,
    toggleStatus,
    isLoading,
  } = useUsers();

  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [formData, setFormData] = useState<UserType | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    setFormData(selectedUser);
    setIsEdit(false);
  }, [selectedUser]);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    // PRODI
    if (name === "program_studi") {
      const selectedProdi = PRODI_OPTIONS.find((p) => p.kode === value);

      setFormData((prev) =>
        prev
          ? {
            ...prev,
            program_studi: value,
            prodi: {
              kode_prodi: value,
              nama_prodi: selectedProdi?.nama || "",
            },
          }
          : null,
      );

      return;
    }

    // KELAS
    if (name === "kelas") {
      const selectedKelas = KELAS_OPTIONS.find(
        (k) => String(k.id_kelas) === value,
      );

      setFormData((prev) =>
        prev
          ? {
            ...prev,
            kelas: {
              id_kelas: Number(value),
              nama_kelas: selectedKelas?.nama_kelas || "",
            },
          }
          : null,
      );

      return;
    }

    setFormData((prev) =>
      prev
        ? {
          ...prev,
          [name]: value,
        }
        : null,
    );
  };

  const handleSaveEdit = async () => {
    if (!formData) return;
    const success = await updateUser(formData);
    if (success) {
      setSelectedUser(formData);
      setIsEdit(false);
      showToast("Data pengguna berhasil diupdate!", "success");
    } else {
      showToast("Gagal mengupdate data pengguna.", "error");
    }
  };

  const handleToggleStatus = async (user: UserType) => {
    const { updated, success } = await toggleStatus(user);
    if (success) {
      if (selectedUser?.id === user.id) setSelectedUser(updated);
      showToast(
        `Akun ${updated.nama} berhasil ${updated.status === "Aktif" ? "diaktifkan" : "dinonaktifkan"}.`,
        updated.status === "Aktif" ? "success" : "warning",
      );
    } else {
      showToast("Gagal mengubah status akun.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-secondary-color font-poppins pb-[120px]">
      <NavAdmin
        isFormOpen={isFormOpen}
        onAddClick={() => setIsFormOpen((prev) => !prev)}
      />

      {/* TOP BAR */}
      <div className="bg-main-blue rounded-b-[20px] shadow-lg">
        <div className="autoMid py-[20px] flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="w-full md:w-[70%]">
            <SearchBar
              text="Cari nama..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="w-full md:w-[20%]">

            <SelectStatus
  selected={selectedStatus}
  onChange={setSelectedStatus}
/>

          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="autoMid mt-6 px-2 sm:px-4">
        <div className="flex flex-col xl:flex-row gap-6">
          {/* PANEL KIRI */}
          <div className="w-full xl:w-[30%] xl:mt-[50px] xl:block xl:top-24 h-fit">
            {isFormOpen ? (
              <FormTambahUser
                onClose={() => setIsFormOpen(false)}
                onSave={async (data) => {
                  const success = await addUser(data);
                  if (success) {
                    showToast("Pengguna berhasil ditambahkan!", "success");
                    setIsFormOpen(false);
                  } else {
                    showToast("Gagal menambahkan pengguna.", "error");
                  }
                }}
              />
            ) : (
              <UserDetail
                selectedUser={selectedUser}
                formData={formData}
                isEdit={isEdit}
                onToggleEdit={() => setIsEdit((prev) => !prev)}
                onSaveEdit={handleSaveEdit}
                onFormChange={handleFormChange}
              />
            )}
          </div>

          {/* PANEL KANAN */}
          <div className="flex-1 space-y-8">
            {isLoading ? (
              // SKELETON LOADING
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[80px] rounded-xl bg-gray-200 animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <>
                {/* KPS */}
                <section  className="min-h-[280px]">
                  <SectionHeader
                    title="Kepala Program Studi"
                    currentPage={pageKps}
                    totalPages={totalPagesKps}
                    onNext={nextPageKps}
                    onPrev={prevPageKps}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    {paginatedKps.map((user) => (
                      <UserCard
                        key={user.id}
                        user={user}
                        isActive={selectedUser?.id === user.id}
                        onClick={() => setSelectedUser(user)}
                        onToggleStatus={handleToggleStatus}
                      />
                    ))}
                  </div>
                </section>

                {/* Mahasiswa */}
                <section  className="min-h-[280px]">
                  <SectionHeader
                    title="Mahasiswa"
                    currentPage={pageMhs}
                    totalPages={totalPages}
                    onNext={nextPage}
                    onPrev={prevPage}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    {paginatedMhs.map((user) => (
                      <UserCard
                        key={user.id}
                        user={user}
                        isActive={selectedUser?.id === user.id}
                        onClick={() => setSelectedUser(user)}
                        onToggleStatus={handleToggleStatus}
                      />
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
