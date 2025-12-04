import PageHeader from '@/components/ui/PageHeader';
import { Receipt } from 'lucide-react';

export default function LiquidacionesPage() {
  return (
    <>
      <PageHeader
        title="Liquidación de Sueldo"
        description="Generación y gestión de liquidaciones"
        icon={Receipt}
      />
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <p className="text-gray-600">Módulo de liquidaciones en construcción...</p>
      </div>
    </>
  );
}
