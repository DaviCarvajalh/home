import PageHeader from '@/components/ui/PageHeader';
import { BarChart3 } from 'lucide-react';

export default function ReporteCostosPage() {
  return (
    <>
      <PageHeader
        title="Reporte de Costos Laborales"
        description="Análisis de costos laborales"
        icon={BarChart3}
      />
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <p className="text-gray-600">Reporte de costos laborales en construcción...</p>
      </div>
    </>
  );
}
