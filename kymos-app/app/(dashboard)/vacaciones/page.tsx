import PageHeader from '@/components/ui/PageHeader';
import { Palmtree } from 'lucide-react';

export default function VacacionesPage() {
  return (
    <>
      <PageHeader
        title="Vacaciones"
        description="Gestión de vacaciones del personal"
        icon={Palmtree}
      />
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <p className="text-gray-600">Módulo de vacaciones en construcción...</p>
      </div>
    </>
  );
}
