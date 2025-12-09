import PageHeader from '@/components/ui/PageHeader';
import { PiggyBank } from 'lucide-react';
import Link from 'next/link';

const afps = [
  { nombre: 'Capital', porcentaje: 11.44, comision: 1.44 },
  { nombre: 'Cuprum', porcentaje: 11.44, comision: 1.44 },
  { nombre: 'Habitat', porcentaje: 11.27, comision: 1.27 },
  { nombre: 'Modelo', porcentaje: 10.58, comision: 0.58 },
  { nombre: 'Planvital', porcentaje: 11.16, comision: 1.16 },
  { nombre: 'Provida', porcentaje: 11.45, comision: 1.45 },
  { nombre: 'Uno', porcentaje: 10.69, comision: 0.69 },
];

export default function AfpPage() {
  return (
    <>
      <PageHeader
        title="AFPs y Ahorro"
        description="Gestión de AFPs y ahorro previsional"
        icon={PiggyBank}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista de AFPs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">AFPs Vigentes</h3>
            <p className="text-sm text-gray-500">Tasas actualizadas 2025</p>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">AFP</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600">Cotización</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600">Comisión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {afps.map((afp) => (
                <tr key={afp.nombre} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-900">{afp.nombre}</td>
                  <td className="px-6 py-3 text-right text-gray-600">{afp.porcentaje}%</td>
                  <td className="px-6 py-3 text-right text-gray-600">{afp.comision}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Accesos rápidos */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Ahorro Previsional Voluntario</h3>
            <p className="text-sm text-gray-600 mb-4">
              Gestiona el APV de los trabajadores, incluyendo aportes del empleador y del trabajador.
            </p>
            <Link href="/afp/ahorro" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
              <PiggyBank className="w-4 h-4" />
              Ir a Ahorro Previsional
            </Link>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-sm p-6 text-white">
            <h3 className="font-semibold mb-2">Cotización Obligatoria</h3>
            <p className="text-emerald-100 text-sm mb-4">
              La cotización obligatoria es del 10% del sueldo imponible, más la comisión de la AFP.
            </p>
            <div className="bg-white/20 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-emerald-100">Tope Imponible 2025</span>
                <span className="font-bold text-lg">$2.429.552</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
