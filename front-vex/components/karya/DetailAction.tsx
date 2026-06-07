'use client';

import { Button, ButtonPutih } from '@/components/shared/ui/Button';

interface Props {
  onDelete: () => void;
  onSave: () => void;
  loading?: boolean;
}

export default function DetailAction({ onDelete, onSave, loading }: Props) {
  return (
    <div className="flex justify-end gap-3 pt-4">
      <ButtonPutih
        onClick={onDelete}
        className="px-8 py-2.5 rounded-lg hover:opacity-80"
      >
        Hapus
      </ButtonPutih>

      <Button
        onClick={onSave}
        disabled={loading}
        className="px-8 py-2.5 text-white rounded-lg hover:opacity-80"
      >
        {loading ? "Menyimpan..." : "Simpan"}
      </Button>
    </div>
  );
}