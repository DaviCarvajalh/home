'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/ui/PageHeader';
import { 
  UserCircle, Save, X, User, Mail, Phone, Calendar, Building2, Briefcase,
  DollarSign, CreditCard, AlertCircle, CheckCircle, Loader2, MapPin, Users,
  FileText, Clock, Shield, Heart, Banknote, Upload, Globe, Home, UserCog, Camera,
} from 'lucide-react';

interface CargaFamiliar {
  id: number;
  nombre: string;
  rut: string;
  parentesco: string;
  fechaNacimiento: string;
}

export default function NuevoTrabajadorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cargasFamiliares, setCargasFamiliares] = useState<CargaFamiliar[]>([]);
  
  const [formData, setFormData] = useState({
    // Personal
    codigoEmpleado: '', nombres: '', apellidos: '', rut: '', nacionalidad: 'Chilena',
    fechaNacimiento: '', sexo: '', estadoCivil: '', direccion: '', comuna: '', ciudad: '',
    telefono: '', email: '', contactoEmergenciaNombre: '', contactoEmergenciaTelefono: '',
    contactoEmergenciaRelacion: '',
    // Laboral
    fechaIngreso: new Date().toISOString().split('T')[0], fechaTermino: '', tipoContrato: '',
    jornada: '', horario: '', modalidad: '', departamento: '', subdepartamento: '',
    cargo: '', centroCosto: '', supervisor: '',
    // Renta
    sueldoBase: '', tipoSueldo: 'mensual', asignacionColacion: '', asignacionMovilizacion: '',
    asignacionZona: '', asignacionResponsabilidad: '', bonos: '', formaPago: 'transferencia',
    banco: '', tipoCuenta: '', numeroCuenta: '',
    // Previsión
    afp: '', salud: '', planIsapre: '', tramoAsignacionFamiliar: '',
    // Asistencia
    turno: '', horarioAsistencia: '', calendario: '',
    // Sistema
    crearUsuario: false, emailUsuario: '', rolUsuario: 'empleado',
  });

  // Opciones
  const opciones = {
    nacionalidades: ['Chilena','Argentina','Peruana','Boliviana','Colombiana','Venezolana','Haitiana','Otra'],
    sexos: [{ v: 'M', l: 'Masculino' }, { v: 'F', l: 'Femenino' }],
    estadosCiviles: [{ v: 'soltero', l: 'Soltero/a' }, { v: 'casado', l: 'Casado/a' }, { v: 'divorciado', l: 'Divorciado/a' }, { v: 'viudo', l: 'Viudo/a' }, { v: 'conviviente', l: 'Conviviente Civil' }],
    tiposContrato: [{ v: 'indefinido', l: 'Indefinido' }, { v: 'plazo_fijo', l: 'Plazo Fijo' }, { v: 'obra_faena', l: 'Por Obra o Faena' }, { v: 'honorarios', l: 'Honorarios' }, { v: 'practicas', l: 'Práctica Profesional' }],
    jornadas: [{ v: 'completa', l: 'Jornada Completa (45 hrs)' }, { v: 'parcial', l: 'Jornada Parcial' }, { v: 'art22', l: 'Art. 22 (Sin límite)' }, { v: 'turnos', l: 'Sistema de Turnos' }],
    modalidades: [{ v: 'presencial', l: 'Presencial' }, { v: 'remoto', l: 'Teletrabajo' }, { v: 'hibrido', l: 'Híbrido' }],
    departamentos: ['Administración','Recursos Humanos','Producción','Ventas','Logística','Finanzas','Tecnología','Operaciones','Control de Calidad','Mantención'],
    cargos: ['Gerente','Subgerente','Jefe de Área','Supervisor','Analista','Asistente','Operador','Técnico','Auxiliar','Ejecutivo'],
    tiposSueldo: [{ v: 'mensual', l: 'Mensual' }, { v: 'diario', l: 'Diario' }, { v: 'hora', l: 'Por Hora' }],
    formasPago: [{ v: 'transferencia', l: 'Transferencia Bancaria' }, { v: 'cheque', l: 'Cheque' }, { v: 'efectivo', l: 'Efectivo' }],
    bancos: ['Banco Estado','Banco de Chile','Santander','BCI','Scotiabank','Itaú','Banco Security','BICE','Banco Falabella','Banco Ripley'],
    tiposCuenta: [{ v: 'corriente', l: 'Cuenta Corriente' }, { v: 'vista', l: 'Cuenta Vista / RUT' }, { v: 'ahorro', l: 'Cuenta de Ahorro' }],
    afps: ['AFP Capital','AFP Cuprum','AFP Habitat','AFP Modelo','AFP PlanVital','AFP ProVida','AFP Uno'],
    salud: [{ v: 'fonasa', l: 'FONASA' }, { v: 'isapre_banmedica', l: 'Isapre Banmédica' }, { v: 'isapre_colmena', l: 'Isapre Colmena' }, { v: 'isapre_consalud', l: 'Isapre Consalud' }, { v: 'isapre_cruzblanca', l: 'Isapre Cruz Blanca' }, { v: 'isapre_vidatres', l: 'Isapre Vida Tres' }],
    tramos: [{ v: 'A', l: 'Tramo A' }, { v: 'B', l: 'Tramo B' }, { v: 'C', l: 'Tramo C' }, { v: 'D', l: 'Tramo D' }],
    turnos: [{ v: 'administrativo', l: 'Administrativo (L-V 9:00-18:00)' }, { v: 'manana', l: 'Turno Mañana' }, { v: 'tarde', l: 'Turno Tarde' }, { v: 'noche', l: 'Turno Noche' }, { v: '4x4', l: 'Sistema 4x4' }],
    roles: [{ v: 'empleado', l: 'Empleado' }, { v: 'supervisor', l: 'Supervisor' }, { v: 'jefe', l: 'Jefe de Área' }, { v: 'rrhh', l: 'RRHH' }, { v: 'admin', l: 'Administrador' }],
    parentescos: ['Hijo/a','Cónyuge','Padre','Madre'],
  };

  const formatRut = (value: string) => {
    let rut = value.replace(/[^0-9kK]/g, '').toUpperCase();
    if (rut.length > 1) {
      const dv = rut.slice(-1);
      let cuerpo = rut.slice(0, -1);
      cuerpo = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      rut = `${cuerpo}-${dv}`;
    }
    return rut;
  };

  const formatMoney = (value: string) => {
    const num = value.replace(/[^0-9]/g, '');
    return num ? new Intl.NumberFormat('es-CL').format(parseInt(num)) : '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else if (name === 'rut') {
      setFormData(prev => ({ ...prev, rut: formatRut(value) }));
    } else if (['sueldoBase', 'asignacionColacion', 'asignacionMovilizacion', 'asignacionZona', 'asignacionResponsabilidad', 'bonos'].includes(name)) {
      setFormData(prev => ({ ...prev, [name]: value.replace(/[^0-9]/g, '') }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const agregarCarga = () => setCargasFamiliares(prev => [...prev, { id: Date.now(), nombre: '', rut: '', parentesco: '', fechaNacimiento: '' }]);
  const eliminarCarga = (id: number) => setCargasFamiliares(prev => prev.filter(c => c.id !== id));
  const actualizarCarga = (id: number, field: string, value: string) => {
    setCargasFamiliares(prev => prev.map(c => c.id === id ? { ...c, [field]: field === 'rut' ? formatRut(value) : value } : c));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (!formData.rut || !formData.nombres || !formData.apellidos || !formData.fechaIngreso) {
      setError('Por favor completa los campos obligatorios');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/empleados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, cargasFamiliares, sueldoBase: formData.sueldoBase ? parseInt(formData.sueldoBase) : null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al crear el trabajador');
      setSuccess(true);
      setTimeout(() => router.push('/trabajadores'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { name: 'Personal', icon: User },
    { name: 'Laboral', icon: Briefcase },
    { name: 'Renta', icon: Banknote },
    { name: 'Previsión', icon: Shield },
    { name: 'Cargas', icon: Users },
    { name: 'Documentos', icon: FileText },
    { name: 'Asistencia', icon: Clock },
    { name: 'Sistema', icon: UserCog },
  ];

  const Input = ({ label, name, value, type = 'text', placeholder = '', required = false, icon: Icon, className = '' }: any) => (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
      <div className="relative">
        {Icon && <Icon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />}
        <input type={type} name={name} value={value} onChange={handleChange} placeholder={placeholder}
          className={`w-full py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${Icon ? 'pl-10 pr-4' : 'px-4'}`} />
      </div>
    </div>
  );

  const Select = ({ label, name, value, options, required = false, icon: Icon, className = '' }: any) => (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
      <div className="relative">
        {Icon && <Icon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />}
        <select name={name} value={value} onChange={handleChange}
          className={`w-full py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none bg-white ${Icon ? 'pl-10 pr-4' : 'px-4'}`}>
          <option value="">Seleccionar...</option>
          {options.map((opt: any) => typeof opt === 'string' 
            ? <option key={opt} value={opt}>{opt}</option>
            : <option key={opt.v} value={opt.v}>{opt.l}</option>
          )}
        </select>
      </div>
    </div>
  );

  if (success) {
    return (
      <>
        <PageHeader title="Nuevo Trabajador" description="Crear ficha de nuevo trabajador" icon={UserCircle} />
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} className="text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Trabajador creado!</h2>
          <p className="text-gray-600">El trabajador ha sido registrado exitosamente.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Nuevo Trabajador" description="Crear ficha completa de nuevo trabajador" icon={UserCircle} />
      
      <form onSubmit={handleSubmit}>
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 overflow-hidden">
          <div className="flex overflow-x-auto">
            {tabs.map((tab, i) => (
              <button key={tab.name} type="button" onClick={() => setActiveTab(i)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === i ? 'border-emerald-500 text-emerald-600 bg-emerald-50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}>
                <tab.icon size={18} />{tab.name}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {error && (
            <div className="mx-6 mt-6 flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <AlertCircle size={20} /><span>{error}</span>
            </div>
          )}

          {/* Tab 0: Personal */}
          {activeTab === 0 && (
            <div className="p-6 space-y-6">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div onClick={() => fileInputRef.current?.click()}
                    className="w-32 h-32 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 overflow-hidden">
                    {fotoPreview ? <img src={fotoPreview} alt="Foto" className="w-full h-full object-cover" /> : <><Camera size={32} className="text-gray-400 mb-2" /><span className="text-xs text-gray-500">Subir foto</span></>}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFotoChange} className="hidden" />
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input label="Código Empleado" name="codigoEmpleado" value={formData.codigoEmpleado} placeholder="EMP-001" icon={CreditCard} />
                  <Input label="RUT" name="rut" value={formData.rut} placeholder="12.345.678-9" required icon={CreditCard} />
                  <Select label="Nacionalidad" name="nacionalidad" value={formData.nacionalidad} options={opciones.nacionalidades} icon={Globe} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Nombres" name="nombres" value={formData.nombres} placeholder="Juan Carlos" required icon={User} />
                <Input label="Apellidos" name="apellidos" value={formData.apellidos} placeholder="Pérez González" required icon={User} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input label="Fecha Nacimiento" name="fechaNacimiento" value={formData.fechaNacimiento} type="date" icon={Calendar} />
                <Select label="Sexo" name="sexo" value={formData.sexo} options={opciones.sexos} icon={User} />
                <Select label="Estado Civil" name="estadoCivil" value={formData.estadoCivil} options={opciones.estadosCiviles} icon={Heart} />
                <Input label="Teléfono" name="telefono" value={formData.telefono} placeholder="+56 9 1234 5678" icon={Phone} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input label="Dirección" name="direccion" value={formData.direccion} placeholder="Av. Principal 123" icon={MapPin} className="md:col-span-2" />
                <Input label="Comuna" name="comuna" value={formData.comuna} placeholder="Santiago" icon={Home} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Ciudad" name="ciudad" value={formData.ciudad} placeholder="Santiago" icon={Building2} />
                <Input label="Email Personal" name="email" value={formData.email} type="email" placeholder="juan@email.com" icon={Mail} />
              </div>
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2"><Phone size={16} className="text-red-500" />Contacto de Emergencia</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input label="Nombre" name="contactoEmergenciaNombre" value={formData.contactoEmergenciaNombre} placeholder="María Pérez" icon={User} />
                  <Input label="Teléfono" name="contactoEmergenciaTelefono" value={formData.contactoEmergenciaTelefono} placeholder="+56 9 8765 4321" icon={Phone} />
                  <Input label="Relación" name="contactoEmergenciaRelacion" value={formData.contactoEmergenciaRelacion} placeholder="Esposa, Madre, etc." icon={Users} />
                </div>
              </div>
            </div>
          )}

          {/* Tab 1: Laboral */}
          {activeTab === 1 && (
            <div className="p-6 space-y-6">
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
                <Input label="Subdepartamento" name="subdepartamento" value={formData.subdepartamento} placeholder="Opcional" icon={Building2} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select label="Cargo" name="cargo" value={formData.cargo} options={opciones.cargos} icon={Briefcase} />
                <Input label="Centro de Costo" name="centroCosto" value={formData.centroCosto} placeholder="CC-001" icon={DollarSign} />
                <Input label="Supervisor" name="supervisor" value={formData.supervisor} placeholder="Nombre del supervisor" icon={User} />
              </div>
            </div>
          )}

          {/* Tab 2: Renta */}
          {activeTab === 2 && (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sueldo Base (CLP)</label>
                  <div className="relative">
                    <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" name="sueldoBase" value={formatMoney(formData.sueldoBase)} onChange={handleChange} placeholder="500.000"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" />
                  </div>
                </div>
                <Select label="Tipo Sueldo" name="tipoSueldo" value={formData.tipoSueldo} options={opciones.tiposSueldo} icon={Banknote} />
                <Select label="Forma de Pago" name="formaPago" value={formData.formaPago} options={opciones.formasPago} icon={CreditCard} />
              </div>
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Asignaciones</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Colación</label>
                    <input type="text" name="asignacionColacion" value={formatMoney(formData.asignacionColacion)} onChange={handleChange} placeholder="0" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Movilización</label>
                    <input type="text" name="asignacionMovilizacion" value={formatMoney(formData.asignacionMovilizacion)} onChange={handleChange} placeholder="0" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Zona</label>
                    <input type="text" name="asignacionZona" value={formatMoney(formData.asignacionZona)} onChange={handleChange} placeholder="0" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Responsabilidad</label>
                    <input type="text" name="asignacionResponsabilidad" value={formatMoney(formData.asignacionResponsabilidad)} onChange={handleChange} placeholder="0" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" /></div>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Datos Bancarios</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select label="Banco" name="banco" value={formData.banco} options={opciones.bancos} icon={Building2} />
                  <Select label="Tipo Cuenta" name="tipoCuenta" value={formData.tipoCuenta} options={opciones.tiposCuenta} icon={CreditCard} />
                  <Input label="Número Cuenta" name="numeroCuenta" value={formData.numeroCuenta} placeholder="123456789" icon={CreditCard} />
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Previsión */}
          {activeTab === 3 && (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select label="AFP" name="afp" value={formData.afp} options={opciones.afps} icon={Shield} />
                <Select label="Sistema de Salud" name="salud" value={formData.salud} options={opciones.salud} icon={Heart} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Plan Isapre (UF)" name="planIsapre" value={formData.planIsapre} placeholder="Ej: 4.5 UF" icon={FileText} />
                <Select label="Tramo Asignación Familiar" name="tramoAsignacionFamiliar" value={formData.tramoAsignacionFamiliar} options={opciones.tramos} icon={Users} />
              </div>
            </div>
          )}

          {/* Tab 4: Cargas Familiares */}
          {activeTab === 4 && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm font-semibold text-gray-700">Cargas Familiares</h4>
                <button type="button" onClick={agregarCarga} className="px-3 py-1.5 text-sm font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">+ Agregar Carga</button>
              </div>
              {cargasFamiliares.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Users size={48} className="mx-auto mb-3 text-gray-300" />
                  <p>No hay cargas familiares registradas</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cargasFamiliares.map((carga, i) => (
                    <div key={carga.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-gray-700">Carga #{i + 1}</span>
                        <button type="button" onClick={() => eliminarCarga(carga.id)} className="text-red-500 hover:text-red-700"><X size={18} /></button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input type="text" value={carga.nombre} onChange={(e) => actualizarCarga(carga.id, 'nombre', e.target.value)} placeholder="Nombre completo" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" />
                        <input type="text" value={carga.rut} onChange={(e) => actualizarCarga(carga.id, 'rut', e.target.value)} placeholder="RUT" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" />
                        <select value={carga.parentesco} onChange={(e) => actualizarCarga(carga.id, 'parentesco', e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white">
                          <option value="">Parentesco...</option>
                          {opciones.parentescos.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <input type="date" value={carga.fechaNacimiento} onChange={(e) => actualizarCarga(carga.id, 'fechaNacimiento', e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 5: Documentos */}
          {activeTab === 5 && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['Contrato PDF', 'Anexos Contrato', 'Certificado Antecedentes', 'Currículum', 'Certificado AFP', 'Certificado Salud'].map(doc => (
                  <div key={doc} className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-emerald-400 hover:bg-emerald-50 transition-colors cursor-pointer">
                    <Upload size={24} className="mx-auto mb-2 text-gray-400" />
                    <p className="text-sm font-medium text-gray-700">{doc}</p>
                    <p className="text-xs text-gray-500 mt-1">Clic para subir</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 6: Asistencia */}
          {activeTab === 6 && (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select label="Turno" name="turno" value={formData.turno} options={opciones.turnos} icon={Clock} />
                <Input label="Horario Específico" name="horarioAsistencia" value={formData.horarioAsistencia} placeholder="09:00 - 18:00" icon={Clock} />
                <Input label="Calendario" name="calendario" value={formData.calendario} placeholder="Estándar" icon={Calendar} />
              </div>
            </div>
          )}

          {/* Tab 7: Sistema */}
          {activeTab === 7 && (
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <input type="checkbox" name="crearUsuario" checked={formData.crearUsuario} onChange={handleChange} className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500" />
                <div>
                  <p className="font-medium text-gray-800">Crear usuario de sistema</p>
                  <p className="text-sm text-gray-500">Permite al trabajador acceder al sistema KyMOS</p>
                </div>
              </div>
              {formData.crearUsuario && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Email de acceso" name="emailUsuario" value={formData.emailUsuario || formData.email} type="email" placeholder="usuario@empresa.cl" icon={Mail} />
                  <Select label="Rol en el sistema" name="rolUsuario" value={formData.rolUsuario} options={opciones.roles} icon={Shield} />
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500"><span className="text-red-500">*</span> Campos obligatorios</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => router.back()} className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <X size={18} />Cancelar
              </button>
              <button type="submit" disabled={loading} className="px-6 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 flex items-center gap-2 disabled:opacity-50">
                {loading ? <><Loader2 size={18} className="animate-spin" />Guardando...</> : <><Save size={18} />Guardar Trabajador</>}
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
