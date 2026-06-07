import { FaCloudUploadAlt } from "react-icons/fa";
import { PameranForm as PameranFormType, PRODI_OPTIONS } from "@/types/pameran";
import { Button } from "@/components/shared/ui/Button";

type Props = {
  form: PameranFormType;
  preview: string | null;
  loading: boolean;
  onChangeImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
  onSubmit: () => void;
};

const inputClass =
  "w-full p-2.5 px-3 rounded-lg border border-gray-300 mt-1.5 focus:outline-none focus:border-main-blue focus:ring-1 focus:ring-main-blue transition-all text-sm";

function Label({ text, required }: { text: string; required?: boolean }) {
  return (
    <p className="text-sm font-semibold">
      {text} {required && <span className="text-red-500">*</span>}
    </p>
  );
}

export default function FormPameran({
  form,
  preview,
  loading,
  onChangeImage,
  onChange,
  onSubmit,
}: Props) {
  return (
    <div className="flex flex-col lg:flex-row gap-10">
      {/* LEFT - THUMBNAIL */}
      <div className="w-full lg:w-[62%]">
        <p className="text-xl font-semibold mt-10 mb-1.5">
          Thumbnail<span className="text-red-500">*</span>
        </p>

        <label
          htmlFor="file"
          className="cursor-pointer h-[220px] md:h-[320px] w-full flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 hover:border-main-blue hover:bg-blue-50 rounded-xl mt-2 overflow-hidden transition-all duration-200"
        >
          {preview ? (
            <img src={preview} className="w-full h-full object-cover" />
          ) : (
            <div className="text-center text-gray-400">
              <FaCloudUploadAlt className="text-5xl mx-auto mb-2" />
              <p className="text-sm font-medium">Klik untuk upload</p>
              <p className="text-xs mt-1">PNG, JPG, JPEG</p>
            </div>
          )}
          <input
            id="file"
            type="file"
            className="hidden"
            accept="image/png,image/jpeg,image/jpg"
            onChange={onChangeImage}
          />
        </label>

        <p className="text-xs text-gray-400 mt-2">
          Format: PNG, JPG, JPEG. Ukuran maks 2MB.
        </p>
      </div>

      {/* RIGHT - FIELDS */}
      <div className="w-full lg:w-[60%] mt-10 flex flex-col gap-4">
        {/* PRODI */}
        <div>
          <Label text="Program Studi" required />
          <select
            name="prodi"
            value={form.prodi}
            onChange={onChange}
            className={inputClass}
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

        {/* TITLE */}
        <div>
          <Label text="Judul Pameran" required />
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={onChange}
            placeholder="Masukkan judul pameran"
            className={inputClass}
          />
        </div>

        {/* CAPACITY */}
        <div>
          <Label text="Kapasitas Pameran" required />
          <div className="flex items-center mt-1.5">
            <button
              type="button"
              onClick={() => {
                const current = Number(form.capacity);
                if (current > 24) {
                  onChange({
                    target: { name: "capacity", value: String(current - 24) },
                  } as any);
                }
              }}
              className="px-3 py-2.5 border border-gray-300 rounded-l-lg bg-gray-50 hover:bg-gray-100 text-sm font-bold transition-all"
            >
              −
            </button>

            <input
              type="number"
              name="capacity"
              value={form.capacity}
              readOnly
              className="w-full p-2.5 px-3 border-y border-gray-300 text-center text-sm focus:outline-none"
            />

            <button
              type="button"
              onClick={() => {
                const current = Number(form.capacity);
                onChange({
                  target: { name: "capacity", value: String(current + 24) },
                } as any);
              }}
              className="px-3 py-2.5 border border-gray-300 rounded-r-lg bg-gray-50 hover:bg-gray-100 text-sm font-bold transition-all"
            >
              +
            </button>
          </div>
        </div>

        {/* TANGGAL PAMERAN */}
        <div>
          <Label text="Tanggal Pameran" required />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1.5">
            <div>
              <p className="text-xs text-gray-400 mb-1">Mulai</p>
              <input
                type="date"
                name="publishDate"
                value={form.publishDate}
                onChange={onChange}
                className={inputClass}
              />
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Berakhir</p>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={onChange}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* TANGGAL PERSIAPAN */}
        <div>
          <Label text="Tanggal Persiapan" required />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1.5">
            <div>
              <p className="text-xs text-gray-400 mb-1">Mulai</p>
              <input
                type="date"
                name="prepareStart"
                value={form.prepareStart}
                onChange={onChange}
                className={inputClass}
              />
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Berakhir</p>
              <input
                type="date"
                name="prepareEnd"
                value={form.prepareEnd}
                onChange={onChange}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* DESKRIPSI */}
        <div>
          <Label text="Deskripsi" required />
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            placeholder="Masukkan deskripsi pameran..."
            className={`${inputClass} h-[140px] resize-none`}
          />
        </div>

        {/* BUTTON */}
        <div className="flex justify-end">
          <Button
            onClick={onSubmit}
            disabled={loading}
            className="px-8 py-2.5 text-white rounded-lg hover:opacity-80"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </div>
    </div>
  );
}
