"use client";

import { Button, ButtonPutih } from "@/components/shared/ui/Button";

interface Props {
  onDelete?: () => void;
  onSave?: () => void;
  onPilihTerbaik?: () => void;
  onBatalkanTerbaik?: () => void;
  loading?: boolean;
  isTerbaik?: boolean;
}

export default function DetailAction({
  onDelete,
  onSave,
  onPilihTerbaik,
  onBatalkanTerbaik,
  loading,
  isTerbaik,
}: Props) {
  return (
    <div className="flex justify-end gap-3 pt-4">
      {/* Hapus — hanya Admin */}
      {onDelete && (
        <ButtonPutih
          onClick={onDelete}
          className="px-8 py-2.5 rounded-lg hover:opacity-80"
        >
          Hapus
        </ButtonPutih>
      )}

      {/* Batalkan Terbaik — hanya KPS, jika sudah terbaik */}
      {onBatalkanTerbaik && isTerbaik && (
        <ButtonPutih
          onClick={onBatalkanTerbaik}
          disabled={loading}
          className="px-8 py-2.5 rounded-lg hover:opacity-80"
        >
          {loading ? "Memproses..." : "Batalkan Terbaik"}
        </ButtonPutih>
      )}

      {/* Pilih Terbaik — hanya KPS, jika belum terbaik */}
      {onPilihTerbaik && !isTerbaik && (
        <Button
          onClick={onPilihTerbaik}
          disabled={loading}
          className="px-8 py-2.5 text-white rounded-lg hover:opacity-80"
        >
          {loading ? "Memproses..." : "Pilih Terbaik"}
        </Button>
      )}

      {/* Simpan — hanya Ketua PBL */}
      {onSave && (
        <Button
          onClick={onSave}
          disabled={loading}
          className="px-8 py-2.5 text-white rounded-lg hover:opacity-80"
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </Button>
      )}
    </div>
  );
}
