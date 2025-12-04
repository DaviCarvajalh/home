import PageHeader from '@/components/ui/PageHeader';
import { PiggyBank } from 'lucide-react';

export default function AhorroPage() {
  return (
    <>
      <PageHeader
        title="Ahorro Previsional"
        description="Gestión de ahorro previsional voluntario"
        icon={PiggyBank}
      />
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <p className="text-gray-600">Módulo de ahorro previsional en construcción...</p>
      </div>
    </>
  );
}
