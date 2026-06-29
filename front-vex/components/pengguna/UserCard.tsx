import { FaUser } from 'react-icons/fa';
import { FaCircleCheck } from 'react-icons/fa6';
import { FiXCircle } from 'react-icons/fi';
import { UserType, getProdiKode } from '@/types/pengguna';
import { PRODI_OPTIONS } from '@/types/pameran';

type Props = {
  user: UserType;
  isActive: boolean;
  onClick: () => void;
  onToggleStatus: (user: UserType) => void;
};

export default function UserCard({ user, onClick, isActive, onToggleStatus }: Props) {
  const inactive = user.status === 'Tidak Aktif';

  // Resolve nama prodi dari kode atau object
  const prodiNama = typeof user.prodi === 'object'
    ? user.prodi.nama_prodi ?? ''
    : PRODI_OPTIONS.find(p => p.kode === user.prodi)?.nama ?? user.prodi;

  return (
    <div
      onClick={onClick}
      className={`flex shadow-sm justify-between items-center p-3 rounded-lg cursor-pointer transition ${
        isActive ? 'border-main-blue shadow-md scale-[1.02]' : 'bg-white hover:shadow-lg'
      } ${inactive ? 'bg-gray-300/60' : ''}`}
    >
      {/* Kiri */}
      <div className="flex gap-3 items-center min-w-0">
        <div
          className={`w-10 h-10 rounded-full flex justify-center items-center shrink-0 ${
            inactive ? 'bg-gray-400' : 'bg-main-blue'
          }`}
        >
          <FaUser className="text-white" />
        </div>

        <div className="group min-w-0 relative">
          <h4
            className={`text-sm font-bold truncate whitespace-nowrap overflow-hidden ${
              inactive ? 'text-gray-400' : ''
            }`}
          >
            {user.nama}
          </h4>

          {/* Tooltip nama */}
          <div className="pointer-events-none absolute -top-8 left-0 whitespace-nowrap rounded-xl bg-blue-100 px-3 py-1.5 text-xs font-bold text-main-blue opacity-0 shadow-lg transition-all duration-400 delay-[800ms] group-hover:-top-10 group-hover:opacity-100">
            {user.nama}
          </div>

          <p className="text-xs text-gray-400 truncate">{user.role}</p>

          {/* Tampilkan prodi jika ada */}
          {prodiNama && (
            <p className="text-xs text-gray-300 truncate">{prodiNama}</p>
          )}
        </div>
      </div>

      {/* Kanan – toggle status */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleStatus(user);
        }}
        className="shrink-0 ml-2"
      >
        {inactive ? (
          <FiXCircle title="Akun mati" className="text-red-500 text-xl hover:scale-110 transition" />
        ) : (
          <FaCircleCheck title="Akun aktif" className="text-green-500 text-xl hover:scale-110 transition" />
        )}
      </button>
    </div>
  );
}