'use client';

import { useState, useEffect } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import { CalendarX, Plus, X, Loader2, User } from 'lucide-react';

interface Ausencia {
  id: number;
  nombre: string;
  apellido: string;
  rut: string;
  departamento: string;
  tipo: string;
  fecha_inicio: string;
  fecha_fin: string;
  dias: number;
  motivo: string;
  estado: string;
}

interface Empleado {
  id: number;
  nombre: string;
  apellido: string;
  rut: string;
}

const tiposAusencia = [
  { value: 'licencia_medica', label: 'Licencia Médica' },
  { value: 'permiso', label: 'Permiso' },
  { value: 'falta', label: 'Falta' },
  { value: 'otro', label: 'Otro' },
];

export default function AusenciasPage() {
  const [ausencias, setAusencias] = useState<Ausencia[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState('todos');

  const [empleadoId, setEmpleadoId] = useState('');
  const [tipo, setTipo] = useState('licencia_medica');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [motivo, setMotivo] = useState('');

  useEffect(() => {
    fetchAusencias();
    fetchEmpleados();
  }, [filtroTipo]);

  const fetchAusencias = async () => {
    try {
      const url = filtroTipo === 'todos' ? '/api/ausencias' : `/api/ausencias?tipo=${filtroTipo}`;
      const res = await fetch(url);
      const data = await res.json();
      setAusencias(data.ausencias || []);
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

  const calcularDias = () => {
    if (!fechaInicio || !fechaFin) return 0;
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    return Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/ausencias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empleado_id: parseInt(empleadoId),
          tipo,
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          dias: calcularDias(),
          motivo,
        }),
      });

      if (res.ok) {
        setShowModal(false);
        setEmpleadoId('');
        setTipo('licencia_medica');
        setFechaInicio('');
        setFechaFin('');
        setMotivo('');
        fetchAusencias();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString('es-CL');

  const getTipoLabel = (t: string) => tiposAusencia.find(x => x.value === t)?.label || t;

  const getTipoBadge = (t: string) => {
    const estilos: Record<string, string> = {
      licencia_medica: 'bg-red-100 text-red-700',
      permiso: 'bg-blue-100 text-blue-700',
      falta: 'bg-yellow-100 text-yellow-700',
      otro: 'bg-gray-100 text-gray-700',
    };
    return estilos[t] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;
  }

  return (
    <>
      <PageHeader title="Días Ausentes" description="Control de ausencias y licencias" icon={CalendarX} />

      <div className="flex flex-wrap gap-4 mb-6">
        <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg">
          <option value="todos">Todos los tipos</option>
          {tiposAusencia.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ml-auto">
          <Plus className="w-4 h-4" /> Registrar Ausencia
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Empleado</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Tipo</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Desde</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Hasta</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Días</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Motivo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {ausencias.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No hay ausencias registradas</td></tr>
            ) : (
              ausencias.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{a.nombre} {a.apellido}</p>
                        <p className="text-xs text-gray-500">{a.rut}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTipoBadge(a.tipo)}`}>
                      {getTipoLabel(a.tipo)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatDate(a.fecha_inicio)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatDate(a.fecha_fin)}</td>
                  <td className="px-4 py-3 text-center font-semibold">{a.dias}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{a.motivo || '-'}</td>
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
              <h3 className="font-semibold text-gray-900">Registrar Ausencia</h3>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  {tiposAusencia.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
                  <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
                  <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
                </div>
              </div>
              {fechaInicio && fechaFin && (
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <span className="text-blue-700 font-semibold">{calcularDias()} días</span>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Motivo</label>
                <textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={2} />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancelar</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Registrar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
