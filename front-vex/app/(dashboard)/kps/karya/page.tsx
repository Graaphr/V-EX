'use client';

import { useState } from 'react';
import PageKarya from '@/components/karya/PageKarya';

export default function KaryaPage() {
  return (
    <div className="w-full">
      <PageKarya href={'/kps/karya/'} />
    </div>
  );
}
