import PageHeader from '@/components/ui/PageHeader';
import { FileText } from 'lucide-react';

export default function ContratosPage() {
  return (
    <>
      <PageHeader
        title="Contratos"
        description="Gestión de contratos laborales"
        icon={FileText}
      />
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <p className="text-gray-600">Módulo de contratos en construcción...</p>
      </div>
    </>
  );
}
