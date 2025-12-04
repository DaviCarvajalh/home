import PageHeader from '@/components/ui/PageHeader';
import { BarChart3 } from 'lucide-react';

export default function ReporteAsistenciaPage() {
  return (
    <>
      <PageHeader
        title="Reporte de Asistencia"
        description="Reporte detallado de asistencia"
        icon={BarChart3}
      />
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <p className="text-gray-600">Reporte de asistencia en construcción...</p>
      </div>
    </>
  );
}
