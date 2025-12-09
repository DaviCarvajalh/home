'use client';

import { useState, useEffect } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import { Calendar, Plus, X, Loader2, Lock, Unlock, Trash2 } from 'lucide-react';

interface Periodo {
  id: number;
  mes: number;
  anio: number;
  estado: string;
  fecha_apertura: string;
  fecha_cierre: string | null;
}

const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export default function PeriodosPage() {
  const [periodos, setPeriodos] = useState<Periodo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [procesando, setProcesando] = useState<number | null>(null);

  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [anio, setAnio] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchPeriodos();
  }, []);

  const fetchPeriodos = async () => {
    try {
      const res = await fetch('/api/periodos');
      const data = await res.json();
      setPeriodos(data.periodos || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/periodos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mes, anio }),
      });

      if (res.ok) {
        setShowModal(false);
        fetchPeriodos();
      } else {
        const data = await res.json();
        alert(data.error || 'Error al crear período');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const cambiarEstado = async (id: number, nuevoEstado: string) => {
    setProcesando(id);
    try {
      const res = await fetch(`/api/periodos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (res.ok) {
        fetchPeriodos();
      } else {
        const data = await res.json();
        alert(data.error || 'Error al cambiar estado');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setProcesando(null);
    }
  };

  const eliminarPeriodo = async (id: number) => {
    if (!confirm('¿Está seguro de eliminar este período?')) return;
    
    setProcesando(id);
    try {
      const res = await fetch(`/api/periodos/${id}`, { method: 'DELETE' });

      if (res.ok) {
        fetchPeriodos();
      } else {
        const data = await res.json();
        alert(data.error || 'Error al eliminar período');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setProcesando(null);
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const periodoActual = periodos.find(p => p.estado === 'abierto');

  if (loading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;
  }

  return (
    <>
      <PageHeader title="Gestión de Períodos" description="Abrir y cerrar períodos mensuales" icon={Calendar} />

      {/* Período Actual */}
      {periodoActual && (
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Período Actual Abierto</p>
              <p className="text-2xl font-bold">{meses[periodoActual.mes - 1]} {periodoActual.anio}</p>
              <p className="text-green-100 text-sm mt-1">Abierto el {formatDate(periodoActual.fecha_apertura)}</p>
            </div>
            <button
              onClick={() => cambiarEstado(periodoActual.id, 'cerrado')}
              disabled={procesando === periodoActual.id}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              {procesando === periodoActual.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              Cerrar Período
            </button>
          </div>
        </div>
      )}

      {!periodoActual && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="font-semibold text-yellow-800">No hay período abierto</p>
              <p className="text-sm text-yellow-700">Debe abrir un período para poder generar liquidaciones</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end mb-6">
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" /> Nuevo Período
        </button>
      </div>

      {/* Historial de Períodos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Historial de Períodos</h3>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Período</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Fecha Apertura</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Fecha Cierre</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {periodos.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No hay períodos registrados</td></tr>
            ) : (
              periodos.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">{meses[p.mes - 1]} {p.anio}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${
                      p.estado === 'abierto' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {p.estado === 'abierto' ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                      {p.estado.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatDate(p.fecha_apertura)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatDate(p.fecha_cierre)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {p.estado === 'cerrado' && (
                        <button
                          onClick={() => cambiarEstado(p.id, 'abierto')}
                          disabled={procesando === p.id || !!periodoActual}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-50"
                          title={periodoActual ? 'Ya hay un período abierto' : 'Reabrir período'}
                        >
                          {procesando === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Unlock className="w-4 h-4" />}
                        </button>
                      )}
                      {p.estado === 'abierto' && (
                        <button
                          onClick={() => cambiarEstado(p.id, 'cerrado')}
                          disabled={procesando === p.id}
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg disabled:opacity-50"
                          title="Cerrar período"
                        >
                          {procesando === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                        </button>
                      )}
                      <button
                        onClick={() => eliminarPeriodo(p.id)}
                        disabled={procesando === p.id}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                        title="Eliminar período"
                      >
                        {procesando === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Nuevo Período */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Abrir Nuevo Período</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCrear} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mes</label>
                  <select value={mes} onChange={(e) => setMes(parseInt(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    {meses.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
                  <select value={anio} onChange={(e) => setAnio(parseInt(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    {[2024, 2025, 2026].map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-700 text-sm">
                  Al abrir un período, podrá generar liquidaciones para <strong>{meses[mes - 1]} {anio}</strong>.
                </p>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancelar</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Abrir Período</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
