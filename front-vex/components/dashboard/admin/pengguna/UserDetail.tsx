import React from 'react';
import { FaUser } from 'react-icons/fa';
import { FiInfo } from 'react-icons/fi';
import { HiPencilAlt } from 'react-icons/hi';
import { UserType } from '@/types/pengguna';
import { Button } from '@/components/ui/Button';
import { PRODI_OPTIONS } from '@/types/pameran';

type Props = {
  selectedUser: UserType | null;
  formData: UserType | null;
  isEdit: boolean;
  onToggleEdit: () => void;
  onSaveEdit: () => void;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
};

export default function UserDetail({ selectedUser, formData, isEdit, onToggleEdit, onSaveEdit, onFormChange }: Props) {
  return (
    <div className="bg-white rounded-lg min-h-[420px] p-6 shadow-sm">
      {!selectedUser ? (
        <div className="h-full min-h-[350px] flex flex-col justify-center items-center text-gray-400">
          <FiInfo size={30} />
          <p className="mt-3 text-sm">Pilih akun</p>
        </div>
      ) : (
        <div>
          {/* Tombol edit */}
          <div title="Edit" className="flex justify-end">
            <HiPencilAlt
              size={26}
              className="cursor-pointer duration-200 transition-all  hover:scale-120"
              onClick={onToggleEdit}
            />
          </div>

          {/* Avatar */}
          <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto rounded-full bg-main-blue flex justify-center items-center">
            <FaUser className="text-white text-6xl" />
          </div>

          {/* Field detail */}
          <div className="space-y-4 mt-6">
            {/* Nama */}
            <DetailField
              label="Nama"
              name="nama"
              value={formData?.nama || ''}
              isEdit={isEdit}
              onChange={onFormChange}
            />

            {/* Email */}
            <DetailField
              label="Email"
              name="email"
              value={formData?.email || ''}
              isEdit={isEdit}
              onChange={onFormChange}
            />

            {/* Program Studi */}
            <SelectField
              label="Program Studi"
              name="prodi"
              value={formData?.prodi || ''}
              isEdit={isEdit}
              onChange={onFormChange}
              options={PRODI_OPTIONS}
            />

            {/* Kelas — hanya untuk non-KPS */}
            {selectedUser.role !== 'KPS' && (
              <DetailField
                label="Kelas"
                name="kelas"
                value={formData?.kelas || ''}
                isEdit={isEdit}
                onChange={onFormChange}
              />
            )}

            {/* Role + Status / Tombol Simpan */}
            <div className="flex gap-2 flex-col sm:flex-row cursor-default select-none">
              <DetailField
                label="Role"
                name="role"
                value={formData?.role || ''}
                // isEdit={isEdit}
                onChange={onFormChange}
                className="w-full"
              />

              <div className="w-full">
                {!isEdit && <p className="text-sm font-semibold mb-1 text-gray-600">Status</p>}
                {isEdit && <p className="text-sm font-semibold mb-1 text-gray-600">Aksi</p>}

                {!isEdit && (
                  <div
                    className={`w-full h-[42px] rounded-lg flex items-center justify-center ${
                      selectedUser.status === 'active' ? 'bg-green-500 text-white' : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {selectedUser.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                  </div>
                )}

                {isEdit && (
                  <Button onClick={onSaveEdit} className="w-full h-[42px] text-white rounded-lg">
                    Simpan
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

type FieldProps = {
  label: string;
  name: string;
  value: string;
  isEdit?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  className?: string;
};

function DetailField({ label, name, value, isEdit, onChange, className = '', ...props }: FieldProps) {
  return (
    <div className={className}>
      <p className="text-sm font-semibold mb-1 text-gray-600">{label}</p>
      <input
        name={name}
        value={value}
        onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
        disabled={!isEdit}
        className={`w-full p-2 px-4 rounded-lg ${isEdit ? 'bg-gray-200' : 'bg-gray-200'}`}
        {...props}
      />
    </div>
  );
}

type SelectFieldProps = FieldProps & {
  options: string[];
};

function SelectField({ label, name, value, isEdit, options, onChange, className = '', ...props }: SelectFieldProps) {
  return (
    <div className={className}>
      <p className="text-sm font-semibold mb-1 text-gray-600">{label}</p>
      {isEdit ? (
        <select name={name} value={value} onChange={onChange} className="w-full bg-gray-200 p-2 px-3 rounded-lg">
          <option value="" disabled>
            -- Pilih Prodi --
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          name={name}
          value={value}
          disabled
          onChange={() => {}}
          className="w-full bg-gray-200 p-2 px-4 rounded-lg"
          {...props}
        />
      )}
    </div>
  );
}
