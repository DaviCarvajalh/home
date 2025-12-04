import PageHeader from '@/components/ui/PageHeader';
import { Building2 } from 'lucide-react';

export default function SucursalesPage() {
  return (
    <>
      <PageHeader
        title="Sucursales"
        description="Gestión de sucursales por empresa"
        icon={Building2}
      />
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <p className="text-gray-600">Módulo de sucursales en construcción...</p>
      </div>
    </>
  );
}
