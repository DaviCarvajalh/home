import PageHeader from '@/components/ui/PageHeader';
import { UserCircle } from 'lucide-react';

export default function TrabajadoresPage() {
  return (
    <>
      <PageHeader
        title="Ficha Trabajador"
        description="Gestión de fichas de trabajadores"
        icon={UserCircle}
      />
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <p className="text-gray-600">Módulo de trabajadores en construcción...</p>
      </div>
    </>
  );
}
