'use client';

import { useEffect, useState } from 'react';

import NavAdmin from '@/components/ui/NavAdmin';
import SearchBar from '@/components/shared/filter/SearchBar';
import SelectStatus from '@/components/shared/filter/SelectStatus';

import UserCard from './UserCard';
import UserDetail from './UserDetail';
import SectionHeader from './SectionHeader';
import FormTambahUser from './FormTambahUser';
import { useUsers } from '@/hooks/userHook/useUser';
import { UserType } from '@/types/pengguna';

export default function Admin() {
  const {
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    filteredKps,
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

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => prev && { ...prev, [name]: value });
  };

  const handleSaveEdit = async () => {
    if (!formData) return;
    await updateUser(formData);
    setSelectedUser(formData);
    setIsEdit(false);
  };

  const handleToggleStatus = async (user: UserType) => {
    const updated = await toggleStatus(user);
    if (selectedUser?.id === user.id) setSelectedUser(updated);
  };

  return (
    <div className="min-h-screen bg-secondary-color font-poppins pb-[120px]">
      <NavAdmin isFormOpen={isFormOpen} onAddClick={() => setIsFormOpen((prev) => !prev)} />

      {/* TOP BAR */}
      <div className="bg-main-blue rounded-b-[20px] shadow-lg">
        <div className="autoMid py-[20px] flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="w-full md:w-[70%]">
            <SearchBar text="Cari nama..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>

          <div className="w-full md:w-[20%]">
            <SelectStatus selected={selectedStatus} onChange={setSelectedStatus} />
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="autoMid mt-6 px-2 sm:px-4">
        <div className="flex flex-col xl:flex-row gap-6">
          {/* PANEL KIRI */}
          <div className="w-full xl:w-[30%] xl:sticky xl:top-24 h-fit">
            {isFormOpen ? (
              <FormTambahUser onClose={() => setIsFormOpen(false)} onSave={addUser} />
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
                  <div key={i} className="h-[80px] rounded-xl bg-gray-200 animate-pulse" />
                ))}
              </div>
            ) : (
              <>
                {/* KPS */}
                <section>
                  <SectionHeader title="Kepala Program Studi" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    {filteredKps.map((user) => (
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
                <section>
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
