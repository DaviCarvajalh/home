'use client';

import { useState, useEffect } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import { Receipt, FileText, Check, X, Loader2, Users } from 'lucide-react';
import Link from 'next/link';

interface Liquidacion {
  id: number;
  empleado_id: number;
  nombre: string;
  apellido: string;
  rut: string;
  cargo: string;
  departamento: string;
  periodo_mes: number;
  periodo_anio: number;
  total_haberes: number;
  total_descuentos: number;
  sueldo_liquido: number;
  estado: string;
}

const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const formatMoney = (value: number) => {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
};

const estadoColors: Record<string, string> = {
  borrador: 'bg-gray-100 text-gray-700',
  emitida: 'bg-blue-100 text-blue-700',
  pagada: 'bg-green-100 text-green-700',
  anulada: 'bg-red-100 text-red-700',
};

export default function LiquidacionesPage() {
  const [liquidaciones, setLiquidaciones] = useState<Liquidacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [generando, setGenerando] = useState(false);
  const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth() + 1);
  const [anioSeleccionado, setAnioSeleccionado] = useState(new Date().getFullYear());

  const fetchLiquidaciones = async () => {
    try {
      const res = await fetch(`/api/liquidaciones?mes=${mesSeleccionado}&anio=${anioSeleccionado}`);
      const data = await res.json();
      setLiquidaciones(data.liquidaciones || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiquidaciones();
  }, [mesSeleccionado, anioSeleccionado]);

  const generarMasivo = async () => {
    if (!confirm(`¿Generar liquidaciones para todos los empleados de ${meses[mesSeleccionado - 1]} ${anioSeleccionado}?`)) {
      return;
    }

    setGenerando(true);
    try {
      const res = await fetch('/api/liquidaciones/generar-masivo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mes: mesSeleccionado, anio: anioSeleccionado }),
      });
      const data = await res.json();
      
      if (data.success) {
        alert(`✅ ${data.resumen.generadas} liquidaciones generadas\n⏭️ ${data.resumen.omitidas} omitidas (ya existían)`);
        fetchLiquidaciones();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al generar liquidaciones');
    } finally {
      setGenerando(false);
    }
  };

  const cambiarEstado = async (id: number, nuevoEstado: string) => {
    try {
      const res = await fetch(`/api/liquidaciones/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      
      if (res.ok) {
        fetchLiquidaciones();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const eliminar = async (id: number) => {
    if (!confirm('¿Eliminar esta liquidación?')) return;
    
    try {
      const res = await fetch(`/api/liquidaciones/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchLiquidaciones();
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const totales = liquidaciones.reduce(
    (acc, l) => ({

      haberes: acc.haberes + parseFloat(String(l.total_haberes)),
      descuentos: acc.descuentos + parseFloat(String(l.total_descuentos)),
      liquido: acc.liquido + parseFloat(String(l.sueldo_liquido)),
    }),
    { haberes: 0, descuentos: 0, liquido: 0 }
  );

  return (
    <>
      <PageHeader
        title="Liquidaciones"
        description="Generación y gestión de liquidaciones"
        icon={Receipt}
      />

      {/* Filtros y acciones */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mes</label>
              <select
                value={mesSeleccionado}
                onChange={(e) => setMesSeleccionado(parseInt(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                {meses.map((mes, i) => (
                  <option key={i} value={i + 1}>{mes}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
              <select
                value={anioSeleccionado}
                onChange={(e) => setAnioSeleccionado(parseInt(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                {[2023, 2024, 2025, 2026].map((anio) => (
                  <option key={anio} value={anio}>{anio}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={generarMasivo}
              disabled={generando}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {generando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Users className="w-4 h-4" />}
              Generar Masivo
            </button>
          </div>
        </div>
      </div>

      {/* Resumen */}
      {liquidaciones.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Total Liquidaciones</p>
            <p className="text-2xl font-bold text-gray-900">{liquidaciones.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Total Haberes</p>
            <p className="text-2xl font-bold text-green-600">{formatMoney(totales.haberes)}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Total Descuentos</p>
            <p className="text-2xl font-bold text-red-600">{formatMoney(totales.descuentos)}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Total Líquido</p>
            <p className="text-2xl font-bold text-blue-600">{formatMoney(totales.liquido)}</p>
          </div>
        </div>
      )}

      {/* Tabla de liquidaciones */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : liquidaciones.length === 0 ? (
          <div className="text-center py-12">
            <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No hay liquidaciones para este período</p>
            <button
              onClick={generarMasivo}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Generar liquidaciones
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Empleado</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Cargo</th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-gray-700">Haberes</th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-gray-700">Descuentos</th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-gray-700">Líquido</th>
                  <th className="text-center px-4 py-3 text-sm font-medium text-gray-700">Estado</th>
                  <th className="text-center px-4 py-3 text-sm font-medium text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {liquidaciones.map((liq) => (
                  <tr key={liq.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{liq.nombre} {liq.apellido}</p>
                        <p className="text-sm text-gray-500">{liq.rut}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{liq.cargo || '-'}</td>
                    <td className="px-4 py-3 text-right text-sm text-green-600 font-medium">
                      {formatMoney(parseFloat(String(liq.total_haberes)))}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-red-600 font-medium">
                      {formatMoney(parseFloat(String(liq.total_descuentos)))}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-blue-600 font-bold">
                      {formatMoney(parseFloat(String(liq.sueldo_liquido)))}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${estadoColors[liq.estado]}`}>
                        {liq.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <Link
                          href={`/liquidaciones/${liq.id}`}
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                          title="Ver detalle"
                        >
                          <FileText className="w-4 h-4" />
                        </Link>
                        {liq.estado === 'borrador' && (
                          <>
                            <button
                              onClick={() => cambiarEstado(liq.id, 'emitida')}
                              className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded"
                              title="Emitir"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => eliminar(liq.id)}
                              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                              title="Eliminar"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {liq.estado === 'emitida' && (
                          <button
                            onClick={() => cambiarEstado(liq.id, 'pagada')}
                            className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded"
                            title="Marcar como pagada"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
