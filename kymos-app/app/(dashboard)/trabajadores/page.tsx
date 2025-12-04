'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/ui/PageHeader';
import { 
  UserCircle, Search, Filter, Plus, Download, Upload, MoreVertical,
  Eye, Edit, Trash2, Mail, Phone, Building2, Briefcase, Calendar,
  ChevronLeft, ChevronRight, X, Users, CheckCircle, XCircle, Loader2
} from 'lucide-react';

interface Empleado {
  id: number;
  codigo_empleado: string;
  rut: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  departamento: string;
  cargo: string;
  fecha_ingreso: string;
  activo: boolean;
}

export default function TrabajadoresPage() {
  const router = useRouter();
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmpleados, setSelectedEmpleados] = useState<number[]>([]);
  const itemsPerPage = 10;

  // Filtros
  const [filters, setFilters] = useState({
    departamento: '',
    cargo: '',
    estado: '',
    tipoContrato: '',
    fechaDesde: '',
    fechaHasta: '',
  });

  const departamentos = ['Administración', 'Recursos Humanos', 'Producción', 'Ventas', 'Logística', 'Finanzas', 'Tecnología', 'Operaciones'];
  const cargos = ['Gerente', 'Jefe de Área', 'Supervisor', 'Analista', 'Asistente', 'Operador', 'Técnico', 'Auxiliar'];
  const estados = [{ v: '1', l: 'Activo' }, { v: '0', l: 'Inactivo' }];
  const tiposContrato = ['Indefinido', 'Plazo Fijo', 'Por Obra', 'Honorarios'];

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const fetchEmpleados = async () => {
    try {
      const res = await fetch('/api/empleados');
      const data = await res.json();
      if (data.empleados) {
        setEmpleados(data.empleados);
      }
    } catch (error) {
      console.error('Error al cargar empleados:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar empleados
  const filteredEmpleados = empleados.filter(emp => {
    const matchSearch = searchTerm === '' || 
      emp.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.rut?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.codigo_empleado?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchDepartamento = filters.departamento === '' || emp.departamento === filters.departamento;
    const matchCargo = filters.cargo === '' || emp.cargo === filters.cargo;
    const matchEstado = filters.estado === '' || (filters.estado === '1' ? emp.activo : !emp.activo);

    return matchSearch && matchDepartamento && matchCargo && matchEstado;
  });

  // Paginación
  const totalPages = Math.ceil(filteredEmpleados.length / itemsPerPage);
  const paginatedEmpleados = filteredEmpleados.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const clearFilters = () => {
    setFilters({ departamento: '', cargo: '', estado: '', tipoContrato: '', fechaDesde: '', fechaHasta: '' });
    setSearchTerm('');
  };

  const activeFiltersCount = Object.values(filters).filter(v => v !== '').length;

  const toggleSelectAll = () => {
    if (selectedEmpleados.length === paginatedEmpleados.length) {
      setSelectedEmpleados([]);
    } else {
      setSelectedEmpleados(paginatedEmpleados.map(e => e.id));
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedEmpleados(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('es-CL');
  };

  return (
    <>
      <PageHeader
        title="Lista de Trabajadores"
        description="Gestión de fichas de trabajadores"
        icon={UserCircle}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre, RUT, código o email..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Botones */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2.5 border rounded-lg flex items-center gap-2 transition-colors ${
                  showFilters || activeFiltersCount > 0
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Filter size={18} />
                Filtros
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <button className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <Download size={18} />
                <span className="hidden sm:inline">Exportar</span>
              </button>

              <button
                onClick={() => router.push('/trabajadores/nuevo')}
                className="px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Nuevo Trabajador</span>
              </button>
            </div>
          </div>

          {/* Panel de Filtros */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-700">Filtros avanzados</h4>
                {activeFiltersCount > 0 && (
                  <button onClick={clearFilters} className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                    <X size={14} /> Limpiar filtros
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Departamento</label>
                  <select
                    value={filters.departamento}
                    onChange={(e) => setFilters(prev => ({ ...prev, departamento: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="">Todos</option>
                    {departamentos.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Cargo</label>
                  <select
                    value={filters.cargo}
                    onChange={(e) => setFilters(prev => ({ ...prev, cargo: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="">Todos</option>
                    {cargos.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Estado</label>
                  <select
                    value={filters.estado}
                    onChange={(e) => setFilters(prev => ({ ...prev, estado: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="">Todos</option>
                    {estados.map(e => <option key={e.v} value={e.v}>{e.l}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Tipo Contrato</label>
                  <select
                    value={filters.tipoContrato}
                    onChange={(e) => setFilters(prev => ({ ...prev, tipoContrato: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="">Todos</option>
                    {tiposContrato.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Ingreso desde</label>
                  <input
                    type="date"
                    value={filters.fechaDesde}
                    onChange={(e) => setFilters(prev => ({ ...prev, fechaDesde: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Ingreso hasta</label>
                  <input
                    type="date"
                    value={filters.fechaHasta}
                    onChange={(e) => setFilters(prev => ({ ...prev, fechaHasta: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Estadísticas rápidas */}
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-gray-400" />
            <span className="text-gray-600">Total: <strong>{empleados.length}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-500" />
            <span className="text-gray-600">Activos: <strong>{empleados.filter(e => e.activo).length}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle size={16} className="text-red-400" />
            <span className="text-gray-600">Inactivos: <strong>{empleados.filter(e => !e.activo).length}</strong></span>
          </div>
          {filteredEmpleados.length !== empleados.length && (
            <div className="flex items-center gap-2 text-emerald-600">
              <Filter size={16} />
              <span>Mostrando: <strong>{filteredEmpleados.length}</strong></span>
            </div>
          )}
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={32} className="animate-spin text-emerald-500" />
            </div>
          ) : paginatedEmpleados.length === 0 ? (
            <div className="text-center py-12">
              <Users size={48} className="mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500">No se encontraron trabajadores</p>
              {(searchTerm || activeFiltersCount > 0) && (
                <button onClick={clearFilters} className="mt-2 text-emerald-600 hover:text-emerald-700 text-sm">
                  Limpiar filtros
                </button>
              )}
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedEmpleados.length === paginatedEmpleados.length && paginatedEmpleados.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Trabajador</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">RUT</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Departamento</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cargo</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ingreso</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedEmpleados.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedEmpleados.includes(emp.id)}
                        onChange={() => toggleSelect(emp.id)}
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {emp.nombre?.[0]}{emp.apellido?.[0]}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{emp.nombre} {emp.apellido}</p>
                          <p className="text-xs text-gray-500">{emp.email || 'Sin email'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{emp.rut}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                        <Building2 size={14} className="text-gray-400" />
                        {emp.departamento || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                        <Briefcase size={14} className="text-gray-400" />
                        {emp.cargo || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{formatDate(emp.fecha_ingreso)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        emp.activo 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {emp.activo ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        {emp.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Ver ficha">
                          <Eye size={18} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                          <Edit size={18} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredEmpleados.length)} de {filteredEmpleados.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === pageNum
                        ? 'bg-emerald-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
