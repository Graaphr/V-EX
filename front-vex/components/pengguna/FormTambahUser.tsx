import { useState } from "react";
import { FaTimes, FaUser } from "react-icons/fa";
import { UserType } from "@/types/pengguna";
import { Button, ButtonPutih } from "@/components/shared/ui/Button";
import { PRODI_OPTIONS, KELAS_OPTIONS } from "@/types/pameran";

type Props = {
  onClose: () => void;
  // mengambil props tanpa id
  onSave: (user: Omit<UserType, "id">) => void;
};

type FormState = Omit<UserType, "id">;

// DATA
const initialForm: FormState = {
  nama: "",
  email: "",
  prodi: "",
  kelas: "",
  role: "",
  status: "Aktif",
};

export default function FormTambahUser({ onClose, onSave }: Props) {
  const [step, setStep] = useState<"pilih" | "form">("pilih");
  const [form, setForm] = useState<FormState>(initialForm);

  const pilihRole = (role: string) => {
    setForm((prev) => ({ ...prev, role }));
    setStep("form");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    if (!form.nama || !form.email || !form.prodi) return;
    onSave(form);
    onClose();
  };

  return (
    <div className="bg-white rounded-lg min-h-[560px] p-5 shadow-xl">
      {/* Tombol tutup */}
      <div className="flex justify-end">
        <button onClick={onClose}>
          <FaTimes className="text-xl " />
        </button>
      </div>

      {/* Avatar */}
      <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-main-blue mx-auto flex justify-center items-center mt-2">
        <FaUser className="text-white text-6xl" />
      </div>

      {/* Step 1 – Pilih Role */}
      {step === "pilih" && (
        <div className="mt-8 space-y-4">
          <p className="text-center font-semibold text-lg">Pilih Jenis Akun</p>

          <Button
            onClick={() => pilihRole("KPS")}
            className="w-full bg-main-blue cursor-pointer text-white py-3 rounded-lg font-bold hover:bg-white border-2 border-main-blue hover:text-main-blue hover:opacity-90"
          >
            Kepala Program Studi
          </Button>

          <ButtonPutih
            onClick={() => pilihRole("Ketua PBL")}
            className="w-full bg-white border-2 cursor-pointer border-main-blue font-bold text-main-blue py-3 rounded-lg hover:opacity-90"
          >
            Ketua PBL
          </ButtonPutih>
        </div>
      )}

      {/* Step 2 – Isi Form */}
      {step === "form" && (
        <div className="space-y-4 mt-6">
          <div className="text-center font-semibold text-lg">{form.role}</div>

          {[
            { label: "Nama", name: "nama", value: form.nama },
            { label: "Email", name: "email", value: form.email },
            // { label: 'Program Studi', name: 'prodi', value: form.prodi },
          ].map(({ label, name, value }) => (
            <div key={name}>
              <p className="text-sm font-semibold mb-1 text-gray-600">
                {label}
              </p>
              <input
                name={name}
                value={value}
                onChange={handleChange}
                className="w-full bg-gray-200 p-2 px-4 rounded-lg"
              />
            </div>
          ))}
          {/* Program Studi – select */}
          <div>
            <p className="text-sm font-semibold mb-1 text-gray-600">
              Program Studi
            </p>
            <select
              name="prodi"
              value={
                typeof form.prodi === "object"
                  ? form.prodi.kode_prodi
                  : form.prodi
              }
              onChange={handleChange}
              className="w-full bg-gray-200 p-2 px-4 rounded-lg"
            >
              <option value="" disabled>
                -- Pilih Prodi --
              </option>
              {PRODI_OPTIONS.map((prodi) => (
                <option key={prodi.kode} value={prodi.kode}>
                  {prodi.nama}
                </option>
              ))}
            </select>
          </div>
          {/* Kelas — hanya untuk Ketua PBL */}
          {form.role === "Ketua PBL" && (
            <div>
              <p className="text-sm font-semibold mb-1 text-gray-600">Kelas</p>
              <select
                name="kelas"
                value={
                  typeof form.kelas === "object"
                    ? String(form.kelas.id_kelas)
                    : form.kelas
                }
                onChange={handleChange}
                className="w-full bg-gray-200 p-2 px-4 rounded-lg"
              >
                <option value="" disabled>
                  -- Pilih Kelas --
                </option>
                {KELAS_OPTIONS.map((kelas) => (
                  <option key={kelas.id_kelas} value={kelas.id_kelas}>
                    {kelas.nama_kelas}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Status */}
          <div>
            <p className="text-sm font-semibold mb-1 text-gray-600">Status</p>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full bg-gray-200 p-2 px-4 rounded-lg"
            >
              <option value="active">Aktif</option>
              <option value="inactive">Tidak Aktif</option>
            </select>
          </div>

          {/* Tombol aksi */}
          <div className="gap-2 pt-2">
            <div className="w-full">
              <p className="text-sm font-semibold mb-1 text-gray-600">Aksi</p>
              <div className="flex flex-row gap-3">
                <button
                  onClick={() => setStep("pilih")}
                  className="w-full hover:scale-105 duration-300 text-white font-bold cursor-pointer bg-main-blue py-2 rounded-lg"
                >
                  Kembali
                </button>
                <button
                  onClick={handleSubmit}
                  className="w-full text-white hover:scale-105 duration-300 font-bold cursor-pointer bg-green-600 text-white py-2 rounded-lg"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
