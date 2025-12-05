'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PageHeader from '@/components/ui/PageHeader';
import { 
  UserCircle, Save, X, User, Mail, Phone, Calendar, Building2, Briefcase,
  DollarSign, CreditCard, AlertCircle, CheckCircle, Loader2, ArrowLeft,
  MapPin, Globe, Heart, Users, FileText, Clock, Shield, Banknote, UserCog, Home
} from 'lucide-react';

// Componentes fuera del componente principal
const FormInput = ({ label, name, value, onChange, type = 'text', placeholder = '', required = false, icon: Icon, className = '', disabled = false }: any) => (
  <div className={className}>
    <label htmlFor={`input-${name}`} className="block text-sm font-medium text-gray-700 mb-1 select-none">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {Icon && <Icon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />}
      <input 
        type={type} 
        id={`input-${name}`} 
        name={name} 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${Icon ? 'pl-10 pr-4' : 'px-4'} ${disabled ? 'bg-gray-100 text-gray-500' : ''}`} 
      />
    </div>
  </div>
);

const FormSelect = ({ label, name, value, onChange, options, required = false, icon: Icon, className = '' }: any) => (
  <div className={className}>
    <label htmlFor={`select-${name}`} className="block text-sm font-medium text-gray-700 mb-1 select-none">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {Icon && <Icon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />}
      <select 
        id={`select-${name}`} 
        name={name} 
        value={value} 
        onChange={onChange}
        className={`w-full py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none bg-white ${Icon ? 'pl-10 pr-4' : 'px-4'}`}
      >
        <option value="">Seleccionar...</option>
        {options.map((opt: any) => typeof opt === 'string' 
          ? <option key={opt} value={opt}>{opt}</option>
          : <option key={opt.v} value={opt.v}>{opt.l}</option>
        )}
      </select>
    </div>
  </div>
);

export default function EditarTrabajadorPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    // Personal
    codigoEmpleado: '', nombres: '', apellidos: '', rut: '', nacionalidad: '',
    fechaNacimiento: '', sexo: '', estadoCivil: '', cantidadHijos: '0', direccion: '', comuna: '', ciudad: '',
    telefono: '', email: '', contactoEmergenciaNombre: '', contactoEmergenciaTelefono: '', contactoEmergenciaRelacion: '',
    // Laboral
    fechaIngreso: '', fechaTermino: '', tipoContrato: '', jornada: '', horario: '', modalidad: '',
    departamento: '', subdepartamento: '', cargo: '', centroCosto: '', supervisor: '',
    // Renta
    sueldoBase: '', tipoSueldo: '', asignacionColacion: '', asignacionMovilizacion: '',
    asignacionZona: '', asignacionResponsabilidad: '', bonos: '', formaPago: '',
    banco: '', tipoCuenta: '', numeroCuenta: '',
    // Previsión
    afp: '', salud: '', planIsapre: '', tramoAsignacionFamiliar: '',
    // Asistencia
    turno: '', horarioAsistencia: '', calendario: '',
    // Estado
    activo: true,
  });

  const opciones = {
    nacionalidades: ['Chilena','Argentina','Peruana','Boliviana','Colombiana','Venezolana','Haitiana','Otra'],
    sexos: [{ v: 'M', l: 'Masculino' }, { v: 'F', l: 'Femenino' }],
    estadosCiviles: [{ v: 'soltero', l: 'Soltero/a' }, { v: 'casado', l: 'Casado/a' }, { v: 'divorciado', l: 'Divorciado/a' }, { v: 'viudo', l: 'Viudo/a' }, { v: 'conviviente', l: 'Conviviente Civil' }],
    tiposContrato: [{ v: 'indefinido', l: 'Indefinido' }, { v: 'plazo_fijo', l: 'Plazo Fijo' }, { v: 'obra_faena', l: 'Por Obra o Faena' }, { v: 'honorarios', l: 'Honorarios' }],
    jornadas: [{ v: 'completa', l: 'Jornada Completa (45 hrs)' }, { v: 'parcial', l: 'Jornada Parcial' }, { v: 'art22', l: 'Art. 22 (Sin límite)' }, { v: 'turnos', l: 'Sistema de Turnos' }],
    modalidades: [{ v: 'presencial', l: 'Presencial' }, { v: 'remoto', l: 'Teletrabajo' }, { v: 'hibrido', l: 'Híbrido' }],
    departamentos: ['Administración','Recursos Humanos','Producción','Ventas','Logística','Finanzas','Tecnología','Operaciones'],
    cargos: ['Gerente','Subgerente','Jefe de Área','Supervisor','Analista','Asistente','Operador','Técnico','Auxiliar'],
    tiposSueldo: [{ v: 'mensual', l: 'Mensual' }, { v: 'diario', l: 'Diario' }, { v: 'hora', l: 'Por Hora' }],
    formasPago: [{ v: 'transferencia', l: 'Transferencia Bancaria' }, { v: 'cheque', l: 'Cheque' }, { v: 'efectivo', l: 'Efectivo' }],
    bancos: ['Banco Estado','Banco de Chile','Santander','BCI','Scotiabank','Itaú','Banco Security','BICE'],
    tiposCuenta: [{ v: 'corriente', l: 'Cuenta Corriente' }, { v: 'vista', l: 'Cuenta Vista / RUT' }, { v: 'ahorro', l: 'Cuenta de Ahorro' }],
    afps: ['AFP Capital','AFP Cuprum','AFP Habitat','AFP Modelo','AFP PlanVital','AFP ProVida','AFP Uno'],
    salud: [{ v: 'fonasa', l: 'FONASA' }, { v: 'isapre_banmedica', l: 'Isapre Banmédica' }, { v: 'isapre_colmena', l: 'Isapre Colmena' }, { v: 'isapre_consalud', l: 'Isapre Consalud' }, { v: 'isapre_cruzblanca', l: 'Isapre Cruz Blanca' }],
    tramos: [{ v: 'A', l: 'Tramo A' }, { v: 'B', l: 'Tramo B' }, { v: 'C', l: 'Tramo C' }, { v: 'D', l: 'Tramo D' }],
    turnos: [{ v: 'administrativo', l: 'Administrativo (L-V 9:00-18:00)' }, { v: 'manana', l: 'Turno Mañana' }, { v: 'tarde', l: 'Turno Tarde' }, { v: 'noche', l: 'Turno Noche' }],
  };

  const tabs = [
    { name: 'Personal', icon: User },
    { name: 'Laboral', icon: Briefcase },
    { name: 'Renta', icon: Banknote },
    { name: 'Previsión', icon: Shield },
    { name: 'Asistencia', icon: Clock },
  ];

  useEffect(() => {
    if (params.id) {
      fetchEmpleado();
    }
  }, [params.id]);

  const fetchEmpleado = async () => {
    try {
      const res = await fetch(`/api/empleados/${params.id}`);
      const data = await res.json();
      if (res.ok && data.empleado) {
        const emp = data.empleado;
        setFormData({
          // Personal
          codigoEmpleado: emp.codigo_empleado || '',
          rut: emp.rut || '',
          nombres: emp.nombre || '',
          apellidos: emp.apellido || '',
          nacionalidad: emp.nacionalidad || '',
          fechaNacimiento: emp.fecha_nacimiento ? emp.fecha_nacimiento.split('T')[0] : '',
          sexo: emp.sexo || '',
          estadoCivil: emp.estado_civil || '',
          cantidadHijos: emp.cantidad_hijos?.toString() || '0',
          direccion: emp.direccion || '',
          comuna: emp.comuna || '',
          ciudad: emp.ciudad || '',
          telefono: emp.telefono || '',
          email: emp.email || '',
          contactoEmergenciaNombre: emp.contacto_emergencia_nombre || '',
          contactoEmergenciaTelefono: emp.contacto_emergencia_telefono || '',
          contactoEmergenciaRelacion: emp.contacto_emergencia_relacion || '',
          // Laboral
          fechaIngreso: emp.fecha_ingreso ? emp.fecha_ingreso.split('T')[0] : '',
          fechaTermino: emp.fecha_termino ? emp.fecha_termino.split('T')[0] : '',
          tipoContrato: emp.tipo_contrato || '',
          jornada: emp.jornada || '',
          horario: emp.horario || '',
          modalidad: emp.modalidad || '',
          departamento: emp.departamento || '',
          subdepartamento: emp.subdepartamento || '',
          cargo: emp.cargo || '',
          centroCosto: emp.centro_costo || '',
          supervisor: emp.supervisor || '',
          // Renta
          sueldoBase: emp.salario?.toString() || '',
          tipoSueldo: emp.tipo_sueldo || '',
          asignacionColacion: emp.asignacion_colacion?.toString() || '',
          asignacionMovilizacion: emp.asignacion_movilizacion?.toString() || '',
          asignacionZona: emp.asignacion_zona?.toString() || '',
          asignacionResponsabilidad: emp.asignacion_responsabilidad?.toString() || '',
          bonos: emp.bonos?.toString() || '',
          formaPago: emp.forma_pago || '',
          banco: emp.banco || '',
          tipoCuenta: emp.tipo_cuenta || '',
          numeroCuenta: emp.numero_cuenta || '',
          // Previsión
          afp: emp.afp || '',
          salud: emp.salud || '',
          planIsapre: emp.plan_isapre || '',
          tramoAsignacionFamiliar: emp.tramo_asignacion_familiar || '',
          // Asistencia
          turno: emp.turno || '',
          horarioAsistencia: emp.horario_asistencia || '',
          calendario: emp.calendario || '',
          // Estado
          activo: emp.activo,
        });
      } else {
        setError(data.error || 'Error al cargar el empleado');
      }
    } catch (err) {
      setError('Error al cargar el empleado');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  }, []);

  const Input = useMemo(() => (props: any) => <FormInput {...props} onChange={handleChange} />, [handleChange]);
  const Select = useMemo(() => (props: any) => <FormSelect {...props} onChange={handleChange} />, [handleChange]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    if (!formData.rut || !formData.nombres || !formData.apellidos || !formData.fechaIngreso) {
      setError('Por favor completa los campos obligatorios');
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(`/api/empleados/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al actualizar');
      setSuccess(true);
      setTimeout(() => router.push(`/trabajadores/${params.id}`), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 size={40} className="animate-spin text-emerald-600" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={40} className="text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Cambios guardados!</h2>
        <p className="text-gray-600">Redirigiendo a la ficha del trabajador...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2 md:gap-4 mb-4 md:mb-6">
        <button
          onClick={() => router.push(`/trabajadores/${params.id}`)}
          className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-gray-800">Editar Trabajador</h1>
          <p className="text-xs md:text-base text-gray-500 hidden sm:block">Modificar información</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {error && (
            <div className="m-2 md:m-4 p-3 md:p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Tabs */}
          <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide">
            {tabs.map((tab, idx) => (
              <button key={tab.name} type="button" onClick={() => setActiveTab(idx)}
                className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === idx ? 'border-emerald-500 text-emerald-600 bg-emerald-50/50' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}>
                <tab.icon size={16} /><span className="hidden sm:inline">{tab.name}</span>
              </button>
            ))}
          </div>

          {/* Tab Personal */}
          {activeTab === 0 && (
            <div className="p-3 md:p-6 space-y-3 md:space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input label="Código Empleado" name="codigoEmpleado" value={formData.codigoEmpleado} icon={CreditCard} disabled />
                <Input label="RUT" name="rut" value={formData.rut} required icon={CreditCard} />
                <Select label="Nacionalidad" name="nacionalidad" value={formData.nacionalidad} options={opciones.nacionalidades} icon={Globe} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Nombres" name="nombres" value={formData.nombres} required icon={User} />
                <Input label="Apellidos" name="apellidos" value={formData.apellidos} required icon={User} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input label="Fecha Nacimiento" name="fechaNacimiento" value={formData.fechaNacimiento} type="date" icon={Calendar} />
                <Select label="Sexo" name="sexo" value={formData.sexo} options={opciones.sexos} icon={User} />
                <Select label="Estado Civil" name="estadoCivil" value={formData.estadoCivil} options={opciones.estadosCiviles} icon={Heart} />
                <Input label="Cantidad de Hijos" name="cantidadHijos" value={formData.cantidadHijos} type="number" icon={Users} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input label="Teléfono" name="telefono" value={formData.telefono} icon={Phone} />
                <Input label="Dirección" name="direccion" value={formData.direccion} icon={MapPin} className="md:col-span-2" />
                <Input label="Comuna" name="comuna" value={formData.comuna} icon={Home} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Ciudad" name="ciudad" value={formData.ciudad} icon={Building2} />
                <Input label="Email" name="email" value={formData.email} type="email" icon={Mail} />
              </div>
              <div className="pt-4 border-t">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Contacto de Emergencia</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input label="Nombre" name="contactoEmergenciaNombre" value={formData.contactoEmergenciaNombre} icon={User} />
                  <Input label="Teléfono" name="contactoEmergenciaTelefono" value={formData.contactoEmergenciaTelefono} icon={Phone} />
                  <Input label="Relación" name="contactoEmergenciaRelacion" value={formData.contactoEmergenciaRelacion} icon={Users} />
                </div>
              </div>
            </div>
          )}

          {/* Tab Laboral */}
          {activeTab === 1 && (
            <div className="p-3 md:p-6 space-y-3 md:space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input label="Fecha Ingreso" name="fechaIngreso" value={formData.fechaIngreso} type="date" required icon={Calendar} />
                <Input label="Fecha Término" name="fechaTermino" value={formData.fechaTermino} type="date" icon={Calendar} />
                <Select label="Tipo Contrato" name="tipoContrato" value={formData.tipoContrato} options={opciones.tiposContrato} icon={FileText} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select label="Jornada" name="jornada" value={formData.jornada} options={opciones.jornadas} icon={Clock} />
                <Input label="Horario" name="horario" value={formData.horario} placeholder="09:00 - 18:00" icon={Clock} />
                <Select label="Modalidad" name="modalidad" value={formData.modalidad} options={opciones.modalidades} icon={Building2} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select label="Departamento" name="departamento" value={formData.departamento} options={opciones.departamentos} icon={Building2} />
                <Select label="Cargo" name="cargo" value={formData.cargo} options={opciones.cargos} icon={Briefcase} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input label="Subdepartamento" name="subdepartamento" value={formData.subdepartamento} icon={Building2} />
                <Input label="Centro de Costo" name="centroCosto" value={formData.centroCosto} icon={DollarSign} />
                <Input label="Supervisor" name="supervisor" value={formData.supervisor} icon={User} />
              </div>
              <div className="flex items-center gap-3 pt-4">
                <input type="checkbox" id="activo" checked={formData.activo} onChange={(e) => setFormData(prev => ({ ...prev, activo: e.target.checked }))} className="w-5 h-5 text-emerald-600 rounded" />
                <label htmlFor="activo" className="text-sm font-medium text-gray-700">Empleado Activo</label>
              </div>
            </div>
          )}

          {/* Tab Renta */}
          {activeTab === 2 && (
            <div className="p-3 md:p-6 space-y-3 md:space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input label="Sueldo Base (CLP)" name="sueldoBase" value={formData.sueldoBase} type="number" icon={DollarSign} />
                <Select label="Tipo Sueldo" name="tipoSueldo" value={formData.tipoSueldo} options={opciones.tiposSueldo} icon={Banknote} />
                <Select label="Forma de Pago" name="formaPago" value={formData.formaPago} options={opciones.formasPago} icon={CreditCard} />
              </div>
              <h4 className="text-sm font-semibold text-gray-700">Asignaciones</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input label="Colación" name="asignacionColacion" value={formData.asignacionColacion} type="number" />
                <Input label="Movilización" name="asignacionMovilizacion" value={formData.asignacionMovilizacion} type="number" />
                <Input label="Zona" name="asignacionZona" value={formData.asignacionZona} type="number" />
                <Input label="Responsabilidad" name="asignacionResponsabilidad" value={formData.asignacionResponsabilidad} type="number" />
              </div>
              <h4 className="text-sm font-semibold text-gray-700">Datos Bancarios</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select label="Banco" name="banco" value={formData.banco} options={opciones.bancos} icon={Building2} />
                <Select label="Tipo Cuenta" name="tipoCuenta" value={formData.tipoCuenta} options={opciones.tiposCuenta} icon={CreditCard} />
                <Input label="Número Cuenta" name="numeroCuenta" value={formData.numeroCuenta} icon={CreditCard} />
              </div>
            </div>
          )}

          {/* Tab Previsión */}
          {activeTab === 3 && (
            <div className="p-3 md:p-6 space-y-3 md:space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select label="AFP" name="afp" value={formData.afp} options={opciones.afps} icon={Shield} />
                <Select label="Sistema de Salud" name="salud" value={formData.salud} options={opciones.salud} icon={Heart} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Plan Isapre (UF)" name="planIsapre" value={formData.planIsapre} icon={Banknote} />
                <Select label="Tramo Asignación Familiar" name="tramoAsignacionFamiliar" value={formData.tramoAsignacionFamiliar} options={opciones.tramos} icon={Users} />
              </div>
            </div>
          )}

          {/* Tab Asistencia */}
          {activeTab === 4 && (
            <div className="p-3 md:p-6 space-y-3 md:space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select label="Turno" name="turno" value={formData.turno} options={opciones.turnos} icon={Clock} />
                <Input label="Horario Específico" name="horarioAsistencia" value={formData.horarioAsistencia} icon={Clock} />
                <Input label="Calendario" name="calendario" value={formData.calendario} icon={Calendar} />
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="px-3 md:px-6 py-3 md:py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between gap-2">
            <span className="text-xs md:text-sm text-red-500 hidden sm:block">* Campos obligatorios</span>
            <div className="flex gap-2 md:gap-3">
              <button type="button" onClick={() => router.push(`/trabajadores/${params.id}`)}
                className="flex-1 sm:flex-none px-4 md:px-6 py-2 md:py-2.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 flex items-center justify-center gap-1.5">
                <X size={16} /><span className="hidden sm:inline">Cancelar</span>
              </button>
              <button type="submit" disabled={saving}
                className="flex-1 sm:flex-none px-4 md:px-6 py-2 md:py-2.5 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-1.5">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {saving ? 'Guardando...' : <span className="hidden sm:inline">Guardar</span>}
                <span className="sm:hidden">{saving ? '' : 'Guardar'}</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
