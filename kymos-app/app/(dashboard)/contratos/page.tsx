'use client';

import { useState, useEffect } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import { FileText, Plus, X, Loader2, User, Calendar, AlertTriangle } from 'lucide-react';

interface Contrato {
  id: number;
  empleado_id: number;
  nombre: string;
  apellido: string;
  rut: string;
  tipo_contrato: string;
  fecha_inicio: string;
  fecha_termino: string | null;
  jornada: string;
  sueldo_base: number;
  estado: string;
}

interface Empleado {
  id: number;
  nombre: string;
  apellido: string;
  rut: string;
}

const tiposContrato = [
  { value: 'indefinido', label: 'Indefinido' },
  { value: 'plazo_fijo', label: 'Plazo Fijo' },
  { value: 'obra_faena', label: 'Por Obra o Faena' },
  { value: 'honorarios', label: 'Honorarios' },
];

const tiposJornada = [
  { value: 'completa', label: 'Jornada Completa' },
  { value: 'parcial', label: 'Jornada Parcial' },
  { value: 'articulo_22', label: 'Artículo 22' },
];

export default function ContratosPage() {
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState('todos');

  // Form
  const [empleadoId, setEmpleadoId] = useState('');
  const [tipoContrato, setTipoContrato] = useState('indefinido');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaTermino, setFechaTermino] = useState('');
  const [jornada, setJornada] = useState('completa');
  const [sueldoBase, setSueldoBase] = useState('');

  useEffect(() => {
    fetchContratos();
    fetchEmpleados();
  }, [filtroEstado]);

  const fetchContratos = async () => {
    try {
      const url = filtroEstado === 'todos' ? '/api/contratos' : `/api/contratos?estado=${filtroEstado}`;
      const res = await fetch(url);
      const data = await res.json();
      setContratos(data.contratos || []);
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
      const res = await fetch('/api/contratos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empleado_id: parseInt(empleadoId),
          tipo_contrato: tipoContrato,
          fecha_inicio: fechaInicio,
          fecha_termino: fechaTermino || null,
          jornada,
          sueldo_base: parseFloat(sueldoBase),
        }),
      });

      if (res.ok) {
        setShowModal(false);
        resetForm();
        fetchContratos();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const resetForm = () => {
    setEmpleadoId('');
    setTipoContrato('indefinido');
    setFechaInicio('');
    setFechaTermino('');
    setJornada('completa');
    setSueldoBase('');
  };

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-CL');
  };

  const formatMoney = (value: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value || 0);
  };

  const getEstadoBadge = (estado: string) => {
    const estilos: Record<string, string> = {
      vigente: 'bg-green-100 text-green-700',
      por_vencer: 'bg-yellow-100 text-yellow-700',
      terminado: 'bg-gray-100 text-gray-700',
    };
    return estilos[estado] || 'bg-gray-100 text-gray-700';
  };

  const getTipoLabel = (tipo: string) => {
    return tiposContrato.find(t => t.value === tipo)?.label || tipo;
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
        title="Contratos"
        description="Gestión de contratos laborales"
        icon={FileText}
      />

      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="todos">Todos</option>
          <option value="vigente">Vigentes</option>
          <option value="por_vencer">Por Vencer</option>
          <option value="terminado">Terminados</option>
        </select>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ml-auto"
        >
          <Plus className="w-4 h-4" />
          Nuevo Contrato
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Empleado</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Tipo</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Inicio</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Término</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Jornada</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Sueldo Base</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {contratos.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No hay contratos registrados
                </td>
              </tr>
            ) : (
              contratos.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{c.nombre} {c.apellido}</p>
                        <p className="text-xs text-gray-500">{c.rut}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{getTipoLabel(c.tipo_contrato)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatDate(c.fecha_inicio)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {c.fecha_termino ? (
                      <span className="flex items-center gap-1">
                        {formatDate(c.fecha_termino)}
                        {c.estado === 'por_vencer' && <AlertTriangle className="w-3 h-3 text-yellow-500" />}
                      </span>
                    ) : (
                      <span className="text-gray-400">Indefinido</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{c.jornada}</td>
                  <td className="px-4 py-3 text-sm text-right font-medium">{formatMoney(c.sueldo_base)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEstadoBadge(c.estado)}`}>
                      {c.estado.toUpperCase().replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Nuevo Contrato</h3>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Seleccionar</option>
                  {empleados.map((emp) => (
                    <option key={emp.id} value={emp.id}>{emp.nombre} {emp.apellido}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Contrato</label>
                  <select
                    value={tipoContrato}
                    onChange={(e) => setTipoContrato(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    {tiposContrato.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jornada</label>
                  <select
                    value={jornada}
                    onChange={(e) => setJornada(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    {tiposJornada.map((j) => (
                      <option key={j.value} value={j.value}>{j.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
                  <input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Término</label>
                  <input
                    type="date"
                    value={fechaTermino}
                    onChange={(e) => setFechaTermino(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sueldo Base</label>
                <input
                  type="number"
                  value={sueldoBase}
                  onChange={(e) => setSueldoBase(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="500000"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Crear Contrato
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
