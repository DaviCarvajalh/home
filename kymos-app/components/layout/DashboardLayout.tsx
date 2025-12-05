'use client';

import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { APP_DEVELOPER } from '@/config/menu';
import { SidebarProvider } from '@/contexts/SidebarContext';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-100 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 p-3 md:p-6 lg:p-8 overflow-auto relative">
            {children}
          </main>
          {/* Footer - Developer Credit */}
          <footer className="px-3 md:px-6 py-2 text-right">
            <span className="text-[10px] text-gray-400">
              Desarrollado por <span className="font-semibold">{APP_DEVELOPER}</span>
            </span>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
