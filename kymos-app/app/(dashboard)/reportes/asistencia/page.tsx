import PageHeader from '@/components/ui/PageHeader';
import { Clock, Download, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function ReporteAsistenciaPage() {
  const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  
  return (
    <>
      <PageHeader title="Reporte de Asistencia" description="Control de asistencia del personal" icon={Clock} />

      <div className="flex justify-between items-center mb-6">
        <Link href="/reportes" className="text-blue-600 hover:underline text-sm">← Volver a Reportes</Link>
        <div className="flex gap-2">
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option>Diciembre 2025</option>
            <option>Noviembre 2025</option>
            <option>Octubre 2025</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Download className="w-4 h-4" /> Exportar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Días Trabajados</p>
          <p className="text-2xl font-bold text-gray-900">22</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Ausencias</p>
          <p className="text-2xl font-bold text-red-600">3</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Atrasos</p>
          <p className="text-2xl font-bold text-yellow-600">5</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Horas Extra</p>
          <p className="text-2xl font-bold text-blue-600">12</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-5 h-5 text-gray-500" />
          <h3 className="font-semibold text-gray-900">Calendario de Asistencia</h3>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center">
          {diasSemana.map((dia) => (
            <div key={dia} className="text-xs font-semibold text-gray-500 py-2">{dia}</div>
          ))}
          {Array.from({ length: 31 }, (_, i) => (
            <div
              key={i}
              className={`py-2 rounded-lg text-sm ${
                i % 7 === 5 || i % 7 === 6
                  ? 'bg-gray-100 text-gray-400'
                  : i === 10 || i === 15
                  ? 'bg-red-100 text-red-600'
                  : 'bg-green-100 text-green-600'
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-4 text-sm">
          <span className="flex items-center gap-2"><span className="w-3 h-3 bg-green-100 rounded"></span> Presente</span>
          <span className="flex items-center gap-2"><span className="w-3 h-3 bg-red-100 rounded"></span> Ausente</span>
          <span className="flex items-center gap-2"><span className="w-3 h-3 bg-gray-100 rounded"></span> Fin de semana</span>
        </div>
      </div>
    </>
  );
}
