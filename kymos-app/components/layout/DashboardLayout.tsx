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
          <footer className="px-3 md:px-6 py-3 text-right border-t border-gray-200 bg-white">
            <span className="text-xs text-gray-500">
              Creado por <span className="font-semibold text-gray-700">{APP_DEVELOPER}</span>
            </span>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
