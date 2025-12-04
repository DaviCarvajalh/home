'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        if (!data.user) {
          router.push('/');
        }
      })
      .catch(() => router.push('/'));
  }, [router]);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Resumen general del sistema"
        icon={LayoutDashboard}
      />

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Rotación */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-5xl font-bold text-emerald-500">30%</div>
          <div className="text-gray-500 text-sm mt-2">Rotación de trabajadores</div>
        </div>
        {/* Días sin accidentes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-5xl font-bold text-green-500">132</div>
          <div className="text-gray-500 text-sm mt-2">Días sin accidentes</div>
        </div>
        {/* Dotación */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-5xl font-bold text-blue-500">100%</div>
          <div className="text-gray-500 text-sm mt-2">Dotación activa</div>
        </div>
      </div>

      {/* Info Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {/* Información del mes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-700 border-b pb-2 mb-3">Información del mes</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Trabajadores:</span>
              <span className="font-medium">20</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Activos:</span>
              <span className="font-medium">20</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Inactivos:</span>
              <span className="font-medium">0</span>
            </div>
            <div className="flex justify-between mt-4">
              <span className="text-gray-500">Contratos vigentes:</span>
              <span className="font-medium">10</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Finiquitos:</span>
              <span className="font-medium">0</span>
            </div>
            <div className="flex justify-between mt-4">
              <span className="text-gray-500">Licencias médicas:</span>
              <span className="font-medium">2</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Ausentes:</span>
              <span className="font-medium">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Permisos:</span>
              <span className="font-medium">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Vacaciones activas:</span>
              <span className="font-medium">1</span>
            </div>
          </div>
        </div>

        {/* Liquidaciones */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-700 border-b pb-2 mb-3">Liquidaciones</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Procesadas:</span>
              <span className="font-medium text-green-500">✓ 10 / 10</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Pendientes:</span>
              <span className="font-medium">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Provisorias:</span>
              <span className="font-medium">0</span>
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between">
                <span className="text-gray-500">Líquido a pago:</span>
                <span className="font-medium">$ 14.877.000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Anticipos:</span>
                <span className="font-medium">$ 0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Préstamos:</span>
                <span className="font-medium">$ 4.827.192</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Impuestos:</span>
                <span className="font-medium">$ 402.042</span>
              </div>
              <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                <span>Total a pagar:</span>
                <span className="text-green-600">$ 20.107.314</span>
              </div>
            </div>
          </div>
        </div>

        {/* Factores */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-700 border-b pb-2 mb-3">Factores</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">UF:</span>
              <span className="font-medium">$ 34.600,35</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">UTM:</span>
              <span className="font-medium">$ 60.310</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Sueldo mínimo:</span>
              <span className="font-medium">$ 400.006</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Tope imp.:</span>
              <span className="font-medium">UF 81,6</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Tope imp. AFC:</span>
              <span className="font-medium">UF 122,6</span>
            </div>
          </div>
        </div>

        {/* Uso de datos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-700 border-b pb-2 mb-3">Uso de datos</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Trabajadores:</span>
              <span className="font-medium">20 / 100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Empresas:</span>
              <span className="font-medium">1 / 4</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Usuarios:</span>
              <span className="font-medium">1 / 3</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Últimas contrataciones */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-700 border-b pb-2 mb-3">Últimas contrataciones</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium">KW</span>
              </div>
              <div>
                <div className="font-medium text-sm">Kip Welfair</div>
                <div className="text-xs text-gray-500">Jefe de Marketing</div>
                <div className="text-xs text-gray-400">Fecha de contrato: 01-06-2022</div>
              </div>
            </div>
          </div>
        </div>

        {/* Últimos finiquitos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-700 border-b pb-2 mb-3">Últimos finiquitos</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 font-medium">GP</span>
              </div>
              <div>
                <div className="font-medium text-sm">Gawen Palley</div>
                <div className="text-xs text-gray-500">Jefe de Marketing</div>
                <div className="text-xs text-gray-400">Fecha de término: 31-05-2022</div>
              </div>
            </div>
          </div>
        </div>

        {/* Últimas licencias médicas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:col-span-2">
          <h3 className="font-semibold text-gray-700 border-b pb-2 mb-3">Últimas lic. médicas</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-medium">FH</span>
              </div>
              <div>
                <div className="font-medium text-sm">Felipe Habbin</div>
                <div className="text-xs text-gray-500">Asistente de Logística</div>
                <div className="text-xs text-gray-400">Fecha desde: 01-10-2022</div>
                <div className="text-xs text-gray-400">Tipo: Accidente del trabajo</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
