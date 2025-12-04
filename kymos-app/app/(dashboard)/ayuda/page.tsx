import PageHeader from '@/components/ui/PageHeader';
import { HelpCircle } from 'lucide-react';

export default function AyudaPage() {
  return (
    <>
      <PageHeader
        title="Ayuda"
        description="Centro de ayuda y documentación del sistema"
        icon={HelpCircle}
      />
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <p className="text-gray-600">Módulo de ayuda en construcción...</p>
      </div>
    </>
  );
}
