import PageHeader from '@/components/ui/PageHeader';
import { Upload } from 'lucide-react';

export default function CargaMasivaPage() {
  return (
    <>
      <PageHeader
        title="Carga Masiva"
        description="Importación masiva de datos"
        icon={Upload}
      />
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <p className="text-gray-600">Módulo de carga masiva en construcción...</p>
      </div>
    </>
  );
}
