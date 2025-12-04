import PageHeader from '@/components/ui/PageHeader';
import { Building2 } from 'lucide-react';

export default function EmpresasPage() {
  return (
    <>
      <PageHeader
        title="Empresas y Sucursales"
        description="Gestión de empresas y sus sucursales"
        icon={Building2}
      />
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <p className="text-gray-600">Módulo de empresas en construcción...</p>
      </div>
    </>
  );
}
