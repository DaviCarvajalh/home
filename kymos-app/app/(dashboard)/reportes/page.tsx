import PageHeader from '@/components/ui/PageHeader';
import { BarChart3, Users, Clock, DollarSign, FileText, Download } from 'lucide-react';
import Link from 'next/link';

const reportes = [
  {
    id: 'nomina',
    titulo: 'Reporte de Nómina',
    descripcion: 'Lista completa de empleados con sus datos laborales y salariales',
    icon: Users,
    color: 'bg-blue-100 text-blue-600',
    href: '/reportes/nomina',
  },
  {
    id: 'asistencia',
    titulo: 'Reporte de Asistencia',
    descripcion: 'Control de asistencia, horas trabajadas y ausencias',
    icon: Clock,
    color: 'bg-green-100 text-green-600',
    href: '/reportes/asistencia',
  },
  {
    id: 'costos',
    titulo: 'Costos Laborales',
    descripcion: 'Análisis de costos por departamento, cargo y período',
    icon: DollarSign,
    color: 'bg-purple-100 text-purple-600',
    href: '/reportes/costos',
  },
  {
    id: 'liquidaciones',
    titulo: 'Libro de Remuneraciones',
    descripcion: 'Resumen mensual de liquidaciones para contabilidad',
    icon: FileText,
    color: 'bg-orange-100 text-orange-600',
    href: '/liquidaciones',
  },
];

export default function ReportesPage() {
  return (
    <>
      <PageHeader
        title="Reportes"
        description="Generación de reportes y estadísticas"
        icon={BarChart3}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportes.map((reporte) => (
          <Link
            key={reporte.id}
            href={reporte.href}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${reporte.color}`}>
                <reporte.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {reporte.titulo}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{reporte.descripcion}</p>
              </div>
              <Download className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 text-white">
        <h3 className="font-semibold mb-2">Exportación de Datos</h3>
        <p className="text-gray-300 text-sm mb-4">
          Todos los reportes pueden exportarse en formato Excel o PDF para su uso en otras aplicaciones.
        </p>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors">
            Exportar a Excel
          </button>
          <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors">
            Exportar a PDF
          </button>
        </div>
      </div>
    </>
  );
}
