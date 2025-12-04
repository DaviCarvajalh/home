import PageHeader from '@/components/ui/PageHeader';
import { FileX } from 'lucide-react';

export default function FiniquitosPage() {
  return (
    <>
      <PageHeader
        title="Finiquitos"
        description="Gestión de finiquitos laborales"
        icon={FileX}
      />
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <p className="text-gray-600">Módulo de finiquitos en construcción...</p>
      </div>
    </>
  );
}
