'use client';

import {
  ToastProvider as Provider,
  ToastViewport,
} from '@/components/ui/toast';

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider swipeDirection="right">
      {children}
      <ToastViewport className="fixed bottom-0 right-0 flex flex-col p-4 gap-2 w-full md:max-w-[420px] max-h-screen z-[100]" />
    </Provider>
  );
}
