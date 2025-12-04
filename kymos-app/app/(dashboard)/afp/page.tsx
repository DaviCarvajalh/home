import PageHeader from '@/components/ui/PageHeader';
import { PiggyBank } from 'lucide-react';

export default function AfpPage() {
  return (
    <>
      <PageHeader
        title="AFPs y Ahorro"
        description="Gestión de AFPs y ahorro previsional"
        icon={PiggyBank}
      />
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <p className="text-gray-600">Módulo de AFPs en construcción...</p>
      </div>
    </>
  );
}
