import PageHeader from '@/components/ui/PageHeader';
import { Wallet } from 'lucide-react';

export default function PrestamosPage() {
  return (
    <>
      <PageHeader
        title="Préstamos"
        description="Gestión de préstamos a trabajadores"
        icon={Wallet}
      />
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <p className="text-gray-600">Módulo de préstamos en construcción...</p>
      </div>
    </>
  );
}
