'use client';

import { useState, useEffect } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import { Users, Download, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Empleado {
  id: number;
  nombre: string;
  apellido: string;
  rut: string;
  departamento: string;
  cargo: string;
  salario: number;
  fecha_ingreso: string;
}

export default function ReporteNominaPage() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const fetchEmpleados = async () => {
    try {
      const res = await fetch('/api/empleados');
      const data = await res.json();
      setEmpleados(data.empleados || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (value: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value || 0);
  const formatDate = (date: string) => date ? new Date(date).toLocaleDateString('es-CL') : '-';

  if (loading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;
  }

  return (
    <>
      <PageHeader title="Reporte de Nómina" description="Lista completa de empleados" icon={Users} />

      <div className="flex justify-between items-center mb-6">
        <Link href="/reportes" className="text-blue-600 hover:underline text-sm">← Volver a Reportes</Link>
        <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          <Download className="w-4 h-4" /> Exportar Excel
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Nombre</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">RUT</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Departamento</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Cargo</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Salario</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Ingreso</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {empleados.map((emp) => (
              <tr key={emp.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{emp.nombre} {emp.apellido}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{emp.rut}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{emp.departamento || '-'}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{emp.cargo || '-'}</td>
                <td className="px-4 py-3 text-sm text-right font-medium">{formatMoney(emp.salario)}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{formatDate(emp.fecha_ingreso)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-500">Total: {empleados.length} empleados</div>
    </>
  );
}
