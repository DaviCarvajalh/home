import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
}

export default function PageHeader({ title, description, icon: Icon }: PageHeaderProps) {
  return (
    <div className="mb-4 md:mb-8">
      <div className="flex items-center gap-2 md:gap-3">
        {Icon && (
          <div className="w-9 h-9 md:w-12 md:h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
            <Icon size={20} className="text-white md:hidden" />
            <Icon size={24} className="text-white hidden md:block" />
          </div>
        )}
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-gray-900">{title}</h1>
          {description && (
            <p className="text-xs md:text-base text-gray-500">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
