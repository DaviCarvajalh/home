import PageHeader from '@/components/ui/PageHeader';
import { PiggyBank, TrendingUp, Users, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default function AhorroPage() {
  return (
    <>
      <PageHeader
        title="Ahorro Previsional Voluntario"
        description="Gestión de APV y APVC"
        icon={PiggyBank}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Trabajadores con APV</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Aporte Mensual Total</p>
              <p className="text-2xl font-bold text-gray-900">$2.450.000</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Aporte Empleador</p>
              <p className="text-2xl font-bold text-gray-900">$980.000</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Trabajadores con APV</h3>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
            Agregar APV
          </button>
        </div>
        <div className="p-6 text-center text-gray-500">
          <PiggyBank className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p>No hay registros de APV configurados</p>
          <p className="text-sm mt-2">Configura el ahorro previsional voluntario para tus trabajadores</p>
        </div>
      </div>

      <div className="mt-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
        <h3 className="font-semibold mb-2">Beneficios del APV</h3>
        <ul className="text-emerald-100 text-sm space-y-2">
          <li>• Beneficio tributario para el trabajador (Régimen A o B)</li>
          <li>• Bonificación fiscal del 15% en Régimen A</li>
          <li>• Aporte del empleador deducible de impuestos</li>
          <li>• Mejora la pensión futura del trabajador</li>
        </ul>
      </div>

      <div className="mt-4">
        <Link href="/afp" className="text-blue-600 hover:underline text-sm">
          ← Volver a AFPs
        </Link>
      </div>
    </>
  );
}
