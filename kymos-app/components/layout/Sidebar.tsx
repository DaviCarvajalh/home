'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronLeft } from 'lucide-react';
import { menuItems, APP_NAME, APP_SUBTITLE, APP_DEVELOPER, MenuItem } from '@/config/menu';
import { useSidebar } from '@/contexts/SidebarContext';

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className = '' }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const { mobileOpen, setMobileOpen } = useSidebar();

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isActive = (path: string) => pathname === path;
  const isParentActive = (item: MenuItem) => {
    if (isActive(item.path)) return true;
    return item.subItems?.some((sub) => isActive(sub.path)) ?? false;
  };

  const renderMenuItem = (item: MenuItem) => {
    const Icon = item.icon;
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const active = isParentActive(item);

    return (
      <li key={item.id} className="mb-1">
        {hasSubItems ? (
          <>
            <button
              onClick={() => toggleExpanded(item.id)}
              className={`
                w-full flex items-center justify-between px-4 py-3 rounded-lg
                transition-all duration-200 group
                ${active
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <Icon size={20} className={active ? 'text-white' : 'text-gray-400 group-hover:text-emerald-400'} />
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </div>
              {!collapsed && (
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                />
              )}
            </button>
            {!collapsed && isExpanded && (
              <ul className="mt-1 ml-4 pl-4 border-l border-gray-700 space-y-1">
                {item.subItems?.map((subItem) => (
                  <li key={subItem.id}>
                    <Link
                      href={subItem.path}
                      onClick={() => setMobileOpen(false)}
                      className={`
                        block px-4 py-2 rounded-lg text-sm transition-all duration-200
                        ${isActive(subItem.path)
                          ? 'bg-emerald-600/20 text-emerald-400 font-medium'
                          : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
                        }
                      `}
                    >
                      {subItem.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <Link
            href={item.path}
            onClick={() => setMobileOpen(false)}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg
              transition-all duration-200 group
              ${active
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
              }
            `}
          >
            <Icon size={20} className={active ? 'text-white' : 'text-gray-400 group-hover:text-emerald-400'} />
            {!collapsed && <span className="font-medium">{item.label}</span>}
          </Link>
        )}
      </li>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          ${collapsed ? 'w-20' : 'w-72'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static
          bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900
          border-r border-gray-700/50
          flex flex-col
          transition-all duration-300 ease-in-out
          ${className}
        `}
      >
        {/* Logo Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700/50">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <div>
                <h1 className="text-white font-bold text-lg tracking-tight">{APP_NAME}</h1>
                <span className="text-emerald-400 text-xs font-medium">{APP_SUBTITLE}</span>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-10 h-10 mx-auto bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {menuItems.map(renderMenuItem)}
          </ul>
        </nav>

        {/* Collapse Button */}
        <div className="hidden lg:block p-4 border-t border-gray-700/50">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg
              text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
          >
            <ChevronLeft
              size={20}
              className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
            />
            {!collapsed && <span className="text-sm">Colapsar menú</span>}
          </button>
        </div>

              </aside>
    </>
  );
}
