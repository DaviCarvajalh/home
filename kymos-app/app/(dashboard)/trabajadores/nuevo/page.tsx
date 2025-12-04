import PageHeader from '@/components/ui/PageHeader';
import { UserCircle } from 'lucide-react';

export default function NuevoTrabajadorPage() {
  return (
    <>
      <PageHeader
        title="Nuevo Trabajador"
        description="Crear ficha de nuevo trabajador"
        icon={UserCircle}
      />
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <p className="text-gray-600">Formulario de nuevo trabajador en construcción...</p>
      </div>
    </>
  );
}
