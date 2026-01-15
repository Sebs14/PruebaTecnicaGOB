'use client';

import { ProtectedRoute, Sidebar } from '@/components/layout';
import { Toaster } from 'sonner';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className='flex min-h-screen bg-zinc-50 dark:bg-zinc-900'>
        <Sidebar />
        <main className='flex-1 overflow-auto'>
          <div className='mx-auto max-w-7xl p-6'>{children}</div>
        </main>
      </div>
      <Toaster position='top-right' richColors />
    </ProtectedRoute>
  );
}
