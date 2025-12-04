import PageHeader from '@/components/ui/PageHeader';
import { BarChart3 } from 'lucide-react';

export default function ReportesPage() {
  return (
    <>
      <PageHeader
        title="Reportes"
        description="Generación de reportes y estadísticas"
        icon={BarChart3}
      />
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <p className="text-gray-600">Módulo de reportes en construcción...</p>
      </div>
    </>
  );
}
