'use client';

import { useState, useEffect } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import { FileX, Plus, X, Loader2, User } from 'lucide-react';

interface Finiquito {
  id: number;
  nombre: string;
  apellido: string;
  rut: string;
  cargo: string;
  fecha_termino: string;
  causal: string;
  total_liquido: number;
  estado: string;
}

interface Empleado {
  id: number;
  nombre: string;
  apellido: string;
  rut: string;
}

const causales = [
  'Renuncia voluntaria',
  'Mutuo acuerdo',
  'Necesidades de la empresa',
  'Vencimiento del plazo',
  'Conclusión del trabajo',
  'Caso fortuito',
  'Despido por falta grave',
];

export default function FiniquitosPage() {
  const [finiquitos, setFiniquitos] = useState<Finiquito[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [empleadoId, setEmpleadoId] = useState('');
  const [fechaTermino, setFechaTermino] = useState('');
  const [causal, setCausal] = useState(causales[0]);
  const [sueldoProporcional, setSueldoProporcional] = useState('');
  const [vacaciones, setVacaciones] = useState('');
  const [indemnizacion, setIndemnizacion] = useState('');

  useEffect(() => {
    fetchFiniquitos();
    fetchEmpleados();
  }, []);

  const fetchFiniquitos = async () => {
    try {
      const res = await fetch('/api/finiquitos');
      const data = await res.json();
      setFiniquitos(data.finiquitos || []);
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
      const res = await fetch('/api/finiquitos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empleado_id: parseInt(empleadoId),
          fecha_termino: fechaTermino,
          causal,
          sueldo_proporcional: parseFloat(sueldoProporcional) || 0,
          vacaciones_proporcionales: parseFloat(vacaciones) || 0,
          indemnizacion_anos: parseFloat(indemnizacion) || 0,
        }),
      });

      if (res.ok) {
        setShowModal(false);
        setEmpleadoId('');
        setFechaTermino('');
        setCausal(causales[0]);
        setSueldoProporcional('');
        setVacaciones('');
        setIndemnizacion('');
        fetchFiniquitos();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const formatMoney = (value: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value || 0);
  const formatDate = (date: string) => new Date(date).toLocaleDateString('es-CL');

  const getEstadoBadge = (estado: string) => {
    const estilos: Record<string, string> = {
      borrador: 'bg-gray-100 text-gray-700',
      emitido: 'bg-blue-100 text-blue-700',
      firmado: 'bg-green-100 text-green-700',
    };
    return estilos[estado] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;
  }

  return (
    <>
      <PageHeader title="Finiquitos" description="Gestión de finiquitos laborales" icon={FileX} />

      <div className="flex justify-end mb-6">
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" /> Nuevo Finiquito
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Empleado</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Fecha Término</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Causal</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Total Líquido</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {finiquitos.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No hay finiquitos registrados</td></tr>
            ) : (
              finiquitos.map((f) => (
                <tr key={f.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{f.nombre} {f.apellido}</p>
                        <p className="text-xs text-gray-500">{f.rut}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatDate(f.fecha_termino)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{f.causal}</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold">{formatMoney(f.total_liquido)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEstadoBadge(f.estado)}`}>
                      {f.estado.toUpperCase()}
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Nuevo Finiquito</h3>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Término</label>
                  <input type="date" value={fechaTermino} onChange={(e) => setFechaTermino(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Causal</label>
                  <select value={causal} onChange={(e) => setCausal(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    {causales.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sueldo Prop.</label>
                  <input type="number" value={sueldoProporcional} onChange={(e) => setSueldoProporcional(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vacaciones</label>
                  <input type="number" value={vacaciones} onChange={(e) => setVacaciones(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Indemnización</label>
                  <input type="number" value={indemnizacion} onChange={(e) => setIndemnizacion(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="0" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancelar</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Crear Finiquito</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
