import PageHeader from '@/components/ui/PageHeader';
import { BarChart3 } from 'lucide-react';

export default function ReporteNominaPage() {
  return (
    <>
      <PageHeader
        title="Reporte de Nómina"
        description="Reporte detallado de nómina"
        icon={BarChart3}
      />
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <p className="text-gray-600">Reporte de nómina en construcción...</p>
      </div>
    </>
  );
}
