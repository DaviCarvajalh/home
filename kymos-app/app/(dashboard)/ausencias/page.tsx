import PageHeader from '@/components/ui/PageHeader';
import { CalendarX } from 'lucide-react';

export default function AusenciasPage() {
  return (
    <>
      <PageHeader
        title="Días Ausentes"
        description="Registro y gestión de ausencias"
        icon={CalendarX}
      />
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <p className="text-gray-600">Módulo de ausencias en construcción...</p>
      </div>
    </>
  );
}
