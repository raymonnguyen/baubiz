'use client';

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/providers/Providers";
import ToastProvider from '@/components/providers/ToastProvider';

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <Header />
      <main className="flex-grow pt-24">
        {children}
      </main>
      <Footer />
      <ToastProvider />
    </Providers>
  );
} 