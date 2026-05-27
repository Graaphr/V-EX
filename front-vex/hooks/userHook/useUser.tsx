import { useEffect, useMemo, useState } from 'react';
import { StatusType } from '@/components/shared/filter/SelectStatus';
import { UserType } from '@/types/pengguna';

const ITEMS_PER_PAGE = 12;

export function useUsers() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<StatusType | null>(null);
  const [pageMhs, setPageMhs] = useState(1);
  const [isLoading, setIsLoading] = useState(true); 

  /* ---------- Load ---------- */
  const loadUsers = async () => {
    try {
      setIsLoading(true); 
      const res = await fetch('/api/pengguna');
      if (!res.ok) throw new Error('Gagal fetch');
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('ERROR:', error);
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
      const matchName = item.nama.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = selectedStatus ? item.status === selectedStatus.value : true;
      return matchName && matchStatus;
    });

  const filteredKps = useMemo(
    () => filterData(users.filter((u) => u.role === 'KPS')),
    [users, searchTerm, selectedStatus],
  );

  const filteredMhs = useMemo(
    () => filterData(users.filter((u) => u.role !== 'KPS')),
    [users, searchTerm, selectedStatus],
  );

  /* ---------- Pagination ---------- */
  useEffect(() => {
    setPageMhs(1);
  }, [searchTerm, selectedStatus]);

  const totalPages = Math.max(1, Math.ceil(filteredMhs.length / ITEMS_PER_PAGE));
  const paginatedMhs = filteredMhs.slice((pageMhs - 1) * ITEMS_PER_PAGE, pageMhs * ITEMS_PER_PAGE);

  const nextPage = () => setPageMhs((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setPageMhs((p) => Math.max(p - 1, 1));

  /* ---------- CRUD ---------- */
  const addUser = async (newUser: Omit<UserType, 'id'>) => {
    await fetch('/api/pengguna', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });
    await loadUsers();
  };

  const updateUser = async (user: UserType) => {
    await fetch('/api/pengguna', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    await loadUsers();
  };

  const toggleStatus = async (user: UserType) => {
    const updated = { ...user, status: user.status === 'active' ? 'inactive' : 'active' };
    await updateUser(updated);
    return updated;
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
    paginatedMhs,
    nextPage,
    prevPage,
    addUser,
    updateUser,
    toggleStatus,
    isLoading, 
  };
}
