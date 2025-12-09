import PageHeader from '@/components/ui/PageHeader';
import { DollarSign, Download, TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';

const costosPorDepartamento = [
  { departamento: 'Operaciones', empleados: 45, costoTotal: 85000000, porcentaje: 42 },
  { departamento: 'Administración', empleados: 12, costoTotal: 28000000, porcentaje: 14 },
  { departamento: 'Ventas', empleados: 18, costoTotal: 35000000, porcentaje: 17 },
  { departamento: 'TI', empleados: 8, costoTotal: 22000000, porcentaje: 11 },
  { departamento: 'RRHH', empleados: 5, costoTotal: 12000000, porcentaje: 6 },
  { departamento: 'Otros', empleados: 10, costoTotal: 20000000, porcentaje: 10 },
];

export default function ReporteCostosPage() {
  const formatMoney = (value: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
  const totalCosto = costosPorDepartamento.reduce((acc, d) => acc + d.costoTotal, 0);

  return (
    <>
      <PageHeader title="Costos Laborales" description="Análisis de costos por departamento" icon={DollarSign} />

      <div className="flex justify-between items-center mb-6">
        <Link href="/reportes" className="text-blue-600 hover:underline text-sm">← Volver a Reportes</Link>
        <div className="flex gap-2">
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option>Diciembre 2025</option>
            <option>Noviembre 2025</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Download className="w-4 h-4" /> Exportar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Costo Total Mensual</p>
          <p className="text-2xl font-bold text-gray-900">{formatMoney(totalCosto)}</p>
          <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
            <TrendingDown className="w-4 h-4" /> -2.3% vs mes anterior
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Costo Promedio por Empleado</p>
          <p className="text-2xl font-bold text-gray-900">{formatMoney(totalCosto / 98)}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Total Empleados</p>
          <p className="text-2xl font-bold text-gray-900">98</p>
          <div className="flex items-center gap-1 mt-2 text-blue-600 text-sm">
            <TrendingUp className="w-4 h-4" /> +3 nuevos este mes
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Costos por Departamento</h3>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Departamento</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600">Empleados</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600">Costo Total</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600">% del Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {costosPorDepartamento.map((d) => (
              <tr key={d.departamento} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{d.departamento}</td>
                <td className="px-6 py-4 text-center text-gray-600">{d.empleados}</td>
                <td className="px-6 py-4 text-right font-medium">{formatMoney(d.costoTotal)}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${d.porcentaje}%` }}></div>
                    </div>
                    <span className="text-sm text-gray-600 w-10">{d.porcentaje}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50 border-t border-gray-200">
            <tr>
              <td className="px-6 py-4 font-semibold text-gray-900">Total</td>
              <td className="px-6 py-4 text-center font-semibold">98</td>
              <td className="px-6 py-4 text-right font-bold text-gray-900">{formatMoney(totalCosto)}</td>
              <td className="px-6 py-4 text-right font-semibold">100%</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
}
