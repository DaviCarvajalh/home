'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PageHeader from '@/components/ui/PageHeader';
import { 
  UserCircle, ArrowLeft, Edit, Trash2, Mail, Phone, Calendar, Building2, 
  Briefcase, CreditCard, MapPin, Globe, Heart, Users, DollarSign, Shield,
  Clock, FileText, Loader2, CheckCircle, XCircle
} from 'lucide-react';

interface Empleado {
  id: number;
  codigo_empleado: string;
  rut: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fecha_nacimiento: string;
  fecha_ingreso: string;
  departamento: string;
  cargo: string;
  salario: number;
  activo: boolean;
  created_at: string;
}

export default function VerTrabajadorPage() {
  const router = useRouter();
  const params = useParams();
  const [empleado, setEmpleado] = useState<Empleado | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchEmpleado();
    }
  }, [params.id]);

  const fetchEmpleado = async () => {
    try {
      const res = await fetch(`/api/empleados/${params.id}`);
      const data = await res.json();
      if (res.ok) {
        setEmpleado(data.empleado);
      } else {
        setError(data.error || 'Error al cargar el empleado');
      }
    } catch (err) {
      setError('Error al cargar el empleado');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!empleado) return;
    if (!confirm(`¿Estás seguro de eliminar a ${empleado.nombre} ${empleado.apellido}?`)) return;
    
    try {
      const res = await fetch(`/api/empleados/${params.id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/trabajadores');
      } else {
        alert('Error al eliminar el trabajador');
      }
    } catch (err) {
      alert('Error al eliminar el trabajador');
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('es-CL');
  };

  const formatMoney = (amount: number) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 size={40} className="animate-spin text-emerald-600" />
      </div>
    );
  }

  if (error || !empleado) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
        <XCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
        <p className="text-red-600">{error || 'Empleado no encontrado'}</p>
        <button
          onClick={() => router.push('/trabajadores')}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Volver a la lista
        </button>
      </div>
    );
  }

  const InfoItem = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
    <div className="flex items-start gap-2 md:gap-3 py-2 md:py-3 border-b border-gray-100 last:border-0">
      <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
        <Icon size={16} className="text-gray-500" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="text-sm md:text-base text-gray-800 font-medium truncate">{value || '-'}</p>
      </div>
    </div>
  );

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 md:mb-6">
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => router.push('/trabajadores')}
            className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-lg md:text-2xl font-bold text-gray-800">Ficha del Trabajador</h1>
            <p className="text-xs md:text-base text-gray-500 hidden sm:block">Información detallada</p>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-8 sm:ml-0">
          <button
            onClick={() => router.push(`/trabajadores/${params.id}/editar`)}
            className="px-3 py-1.5 md:px-4 md:py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1.5"
          >
            <Edit size={16} />
            <span className="hidden sm:inline">Editar</span>
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-1.5 md:px-4 md:py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-1.5"
          >
            <Trash2 size={16} />
            <span className="hidden sm:inline">Eliminar</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Columna izquierda - Foto y datos básicos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="text-center mb-4 md:mb-6">
            <div className="w-20 h-20 md:w-32 md:h-32 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
              <span className="text-white font-bold text-2xl md:text-4xl">
                {empleado.nombre?.[0]}{empleado.apellido?.[0]}
              </span>
            </div>
            <h2 className="text-lg md:text-xl font-bold text-gray-800">{empleado.nombre} {empleado.apellido}</h2>
            <p className="text-sm text-gray-500">{empleado.cargo || 'Sin cargo'}</p>
            <span className={`inline-flex items-center gap-1 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium mt-2 ${
              empleado.activo 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {empleado.activo ? <CheckCircle size={12} /> : <XCircle size={12} />}
              {empleado.activo ? 'Activo' : 'Inactivo'}
            </span>
          </div>

          <div className="space-y-1">
            <InfoItem icon={CreditCard} label="Código Empleado" value={empleado.codigo_empleado} />
            <InfoItem icon={CreditCard} label="RUT" value={empleado.rut} />
            <InfoItem icon={Mail} label="Email" value={empleado.email} />
            <InfoItem icon={Phone} label="Teléfono" value={empleado.telefono} />
          </div>
        </div>

        {/* Columna central - Información laboral */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 flex items-center gap-2">
            <Briefcase size={18} className="text-emerald-600" />
            Información Laboral
          </h3>
          <div className="space-y-1">
            <InfoItem icon={Building2} label="Departamento" value={empleado.departamento} />
            <InfoItem icon={Briefcase} label="Cargo" value={empleado.cargo} />
            <InfoItem icon={Calendar} label="Fecha de Ingreso" value={formatDate(empleado.fecha_ingreso)} />
            <InfoItem icon={DollarSign} label="Salario" value={formatMoney(empleado.salario)} />
          </div>
        </div>

        {/* Columna derecha - Información personal */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 md:col-span-2 lg:col-span-1">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 flex items-center gap-2">
            <Users size={18} className="text-emerald-600" />
            Información Personal
          </h3>
          <div className="space-y-1">
            <InfoItem icon={Calendar} label="Fecha de Nacimiento" value={formatDate(empleado.fecha_nacimiento)} />
            <InfoItem icon={Clock} label="Fecha de Registro" value={formatDate(empleado.created_at)} />
          </div>
        </div>
      </div>
    </>
  );
}
