'use client';

import { Button, ButtonPutih } from '@/components/shared/ui/Button';

interface Props {
  onDelete: () => void;
  onSave: () => void;
}

export default function DetailAction({ onDelete, onSave }: Props) {
  return (
    <div className="flex justify-end gap-4 pt-4">
      <ButtonPutih className="px-4 py-2 rounded-md" onClick={onDelete}>
        Hapus
      </ButtonPutih>

      <Button className="px-4 py-2 rounded-md" onClick={onSave}>
        Simpan
      </Button>
    </div>
  );
}
