'use client';

import { useState, useEffect } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import { Palmtree, Plus, Check, X, Loader2, Calendar, User } from 'lucide-react';

interface Vacacion {
  id: number;
  empleado_id: number;
  nombre: string;
  apellido: string;
  rut: string;
  departamento: string;
  cargo: string;
  fecha_inicio: string;
  fecha_fin: string;
  dias_solicitados: number;
  estado: string;
  comentario: string;
  created_at: string;
}

interface Empleado {
  id: number;
  nombre: string;
  apellido: string;
  rut: string;
}

export default function VacacionesPage() {
  const [vacaciones, setVacaciones] = useState<Vacacion[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  
  // Form state
  const [empleadoId, setEmpleadoId] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [comentario, setComentario] = useState('');

  useEffect(() => {
    fetchVacaciones();
    fetchEmpleados();
  }, [filtroEstado]);

  const fetchVacaciones = async () => {
    try {
      const url = filtroEstado === 'todos' 
        ? '/api/vacaciones' 
        : `/api/vacaciones?estado=${filtroEstado}`;
      const res = await fetch(url);
      const data = await res.json();
      setVacaciones(data.vacaciones || []);
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
    const diff = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dias = calcularDias();
    if (dias <= 0) {
      alert('Las fechas no son válidas');
      return;
    }

    try {
      const res = await fetch('/api/vacaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empleado_id: parseInt(empleadoId),
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          dias_solicitados: dias,
          comentario,
        }),
      });

      if (res.ok) {
        setShowModal(false);
        resetForm();
        fetchVacaciones();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const cambiarEstado = async (id: number, estado: string) => {
    try {
      const res = await fetch(`/api/vacaciones/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado }),
      });

      if (res.ok) {
        fetchVacaciones();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const resetForm = () => {
    setEmpleadoId('');
    setFechaInicio('');
    setFechaFin('');
    setComentario('');
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-CL');
  };

  const getEstadoBadge = (estado: string) => {
    const estilos: Record<string, string> = {
      pendiente: 'bg-yellow-100 text-yellow-700',
      aprobada: 'bg-green-100 text-green-700',
      rechazada: 'bg-red-100 text-red-700',
    };
    return estilos[estado] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Vacaciones"
        description="Gestión de vacaciones del personal"
        icon={Palmtree}
      />

      {/* Filtros y acciones */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="todos">Todos los estados</option>
          <option value="pendiente">Pendientes</option>
          <option value="aprobada">Aprobadas</option>
          <option value="rechazada">Rechazadas</option>
        </select>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ml-auto"
        >
          <Plus className="w-4 h-4" />
          Nueva Solicitud
        </button>
      </div>

      {/* Tabla de vacaciones */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Empleado</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Departamento</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Fecha Inicio</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Fecha Fin</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Días</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Estado</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {vacaciones.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No hay solicitudes de vacaciones
                </td>
              </tr>
            ) : (
              vacaciones.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{v.nombre} {v.apellido}</p>
                        <p className="text-xs text-gray-500">{v.rut}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{v.departamento || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatDate(v.fecha_inicio)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatDate(v.fecha_fin)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-semibold text-gray-900">{v.dias_solicitados}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEstadoBadge(v.estado)}`}>
                      {v.estado.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {v.estado === 'pendiente' && (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => cambiarEstado(v.id, 'aprobada')}
                          className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                          title="Aprobar"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => cambiarEstado(v.id, 'rechazada')}
                          className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                          title="Rechazar"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Nueva Solicitud */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <h3 className="font-semibold text-gray-900">Nueva Solicitud de Vacaciones</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Empleado</label>
                <select
                  value={empleadoId}
                  onChange={(e) => setEmpleadoId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleccionar empleado</option>
                  {empleados.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.nombre} {emp.apellido} - {emp.rut}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
                  <input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
                  <input
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {fechaInicio && fechaFin && (
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <span className="text-blue-700 font-semibold">{calcularDias()} días</span>
                  <span className="text-blue-600 text-sm ml-1">solicitados</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comentario (opcional)</label>
                <textarea
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Motivo o comentarios adicionales..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Crear Solicitud
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
