import { Suspense } from 'react';
import UbahPasswordForm from './UbahPasswordForm';

export default function UbahPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-main-blue">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-white border-t-transparent" />
        </div>
      }
    >
      <UbahPasswordForm />
    </Suspense>
  );
}
