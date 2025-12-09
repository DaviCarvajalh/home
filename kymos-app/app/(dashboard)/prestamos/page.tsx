'use client';

import { useState, useEffect } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import { Wallet, Plus, X, Loader2, User } from 'lucide-react';

interface Prestamo {
  id: number;
  nombre: string;
  apellido: string;
  rut: string;
  monto_total: number;
  cuotas_totales: number;
  cuotas_pagadas: number;
  monto_cuota: number;
  saldo_pendiente: number;
  fecha_inicio: string;
  motivo: string;
  estado: string;
}

interface Empleado {
  id: number;
  nombre: string;
  apellido: string;
  rut: string;
}

export default function PrestamosPage() {
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState('todos');

  const [empleadoId, setEmpleadoId] = useState('');
  const [montoTotal, setMontoTotal] = useState('');
  const [cuotasTotales, setCuotasTotales] = useState('12');
  const [fechaInicio, setFechaInicio] = useState('');
  const [motivo, setMotivo] = useState('');

  useEffect(() => {
    fetchPrestamos();
    fetchEmpleados();
  }, [filtroEstado]);

  const fetchPrestamos = async () => {
    try {
      const url = filtroEstado === 'todos' ? '/api/prestamos' : `/api/prestamos?estado=${filtroEstado}`;
      const res = await fetch(url);
      const data = await res.json();
      setPrestamos(data.prestamos || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmpleados = async () => {
    try {
      const res = await fetch('/api/empleados');
      const data = await res.json();
      setEmpleados(data.empleados || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/prestamos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empleado_id: parseInt(empleadoId),
          monto_total: parseFloat(montoTotal),
          cuotas_totales: parseInt(cuotasTotales),
          fecha_inicio: fechaInicio,
          motivo,
        }),
      });

      if (res.ok) {
        setShowModal(false);
        setEmpleadoId('');
        setMontoTotal('');
        setCuotasTotales('12');
        setFechaInicio('');
        setMotivo('');
        fetchPrestamos();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const formatMoney = (value: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value || 0);
  const formatDate = (date: string) => new Date(date).toLocaleDateString('es-CL');

  const getEstadoBadge = (estado: string) => {
    const estilos: Record<string, string> = {
      activo: 'bg-blue-100 text-blue-700',
      pagado: 'bg-green-100 text-green-700',
      cancelado: 'bg-gray-100 text-gray-700',
    };
    return estilos[estado] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;
  }

  return (
    <>
      <PageHeader title="Préstamos" description="Gestión de préstamos a trabajadores" icon={Wallet} />

      <div className="flex flex-wrap gap-4 mb-6">
        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg">
          <option value="todos">Todos</option>
          <option value="activo">Activos</option>
          <option value="pagado">Pagados</option>
          <option value="cancelado">Cancelados</option>
        </select>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ml-auto">
          <Plus className="w-4 h-4" /> Nuevo Préstamo
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Empleado</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Monto Total</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Cuotas</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Cuota Mensual</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Saldo</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Inicio</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {prestamos.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">No hay préstamos registrados</td></tr>
            ) : (
              prestamos.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{p.nombre} {p.apellido}</p>
                        <p className="text-xs text-gray-500">{p.rut}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-medium">{formatMoney(p.monto_total)}</td>
                  <td className="px-4 py-3 text-sm text-center">{p.cuotas_pagadas}/{p.cuotas_totales}</td>
                  <td className="px-4 py-3 text-sm text-right">{formatMoney(p.monto_cuota)}</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-red-600">{formatMoney(p.saldo_pendiente)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatDate(p.fecha_inicio)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEstadoBadge(p.estado)}`}>
                      {p.estado.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Nuevo Préstamo</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Empleado</label>
                <select value={empleadoId} onChange={(e) => setEmpleadoId(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required>
                  <option value="">Seleccionar</option>
                  {empleados.map((emp) => <option key={emp.id} value={emp.id}>{emp.nombre} {emp.apellido}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monto Total</label>
                  <input type="number" value={montoTotal} onChange={(e) => setMontoTotal(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="500000" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cuotas</label>
                  <input type="number" value={cuotasTotales} onChange={(e) => setCuotasTotales(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" min="1" max="48" required />
                </div>
              </div>
              {montoTotal && cuotasTotales && (
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <span className="text-blue-700 font-semibold">{formatMoney(Math.ceil(parseFloat(montoTotal) / parseInt(cuotasTotales)))}</span>
                  <span className="text-blue-600 text-sm ml-1">por cuota</span>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
                <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Motivo</label>
                <textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={2} />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancelar</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Crear Préstamo</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
