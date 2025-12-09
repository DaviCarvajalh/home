'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  FileText,
  Truck,
  Warehouse,
  Calculator,
  Building2,
  Briefcase,
  Clock,
  LogOut,
  ChevronRight
} from 'lucide-react';

interface User {
  nombre: string;
  email: string;
  empresa: string;
  rol: string;
}

interface Modulo {
  id: string;
  nombre: string;
  descripcion: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  href: string;
  disponible: boolean;
}

const modulos: Modulo[] = [
  {
    id: 'rrhh',
    nombre: 'Recursos Humanos',
    descripcion: 'Gestión de personal, liquidaciones, vacaciones y más',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 hover:bg-blue-200',
    href: '/dashboard',
    disponible: true,
  },
  {
    id: 'inventario',
    nombre: 'Inventario',
    descripcion: 'Control de stock, productos y bodegas',
    icon: Package,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100 hover:bg-emerald-200',
    href: '/inventario',
    disponible: false,
  },
  {
    id: 'ventas',
    nombre: 'Ventas',
    descripcion: 'Facturación, cotizaciones y clientes',
    icon: ShoppingCart,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 hover:bg-purple-200',
    href: '/ventas',
    disponible: false,
  },
  {
    id: 'compras',
    nombre: 'Compras',
    descripcion: 'Órdenes de compra y proveedores',
    icon: Truck,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100 hover:bg-orange-200',
    href: '/compras',
    disponible: false,
  },
  {
    id: 'contabilidad',
    nombre: 'Contabilidad',
    descripcion: 'Libro mayor, balances y reportes financieros',
    icon: Calculator,
    color: 'text-red-600',
    bgColor: 'bg-red-100 hover:bg-red-200',
    href: '/contabilidad',
    disponible: false,
  },
  {
    id: 'produccion',
    nombre: 'Producción',
    descripcion: 'Órdenes de trabajo y control de procesos',
    icon: Warehouse,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100 hover:bg-amber-200',
    href: '/produccion',
    disponible: false,
  },
  {
    id: 'proyectos',
    nombre: 'Proyectos',
    descripcion: 'Gestión de proyectos y tareas',
    icon: Briefcase,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100 hover:bg-indigo-200',
    href: '/proyectos',
    disponible: false,
  },
  {
    id: 'reportes',
    nombre: 'Reportes BI',
    descripcion: 'Dashboards y análisis de datos',
    icon: BarChart3,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100 hover:bg-cyan-200',
    href: '/reportes-bi',
    disponible: false,
  },
  {
    id: 'documentos',
    nombre: 'Documentos',
    descripcion: 'Gestión documental y archivos',
    icon: FileText,
    color: 'text-slate-600',
    bgColor: 'bg-slate-100 hover:bg-slate-200',
    href: '/documentos',
    disponible: false,
  },
  {
    id: 'activos',
    nombre: 'Activos Fijos',
    descripcion: 'Control de activos y depreciación',
    icon: Building2,
    color: 'text-teal-600',
    bgColor: 'bg-teal-100 hover:bg-teal-200',
    href: '/activos',
    disponible: false,
  },
  {
    id: 'asistencia',
    nombre: 'Control Horario',
    descripcion: 'Marcaje y control de asistencia',
    icon: Clock,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100 hover:bg-pink-200',
    href: '/control-horario',
    disponible: false,
  },
  {
    id: 'configuracion',
    nombre: 'Configuración',
    descripcion: 'Ajustes del sistema y usuarios',
    icon: Settings,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100 hover:bg-gray-200',
    href: '/configuracion',
    disponible: false,
  },
];

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch('/api/auth/session');
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
        } else {
          router.push('/');
        }
      } catch {
        router.push('/');
      } finally {
        setLoading(false);
      }
    };
    fetchSession();

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  const handleModuloClick = (modulo: Modulo) => {
    if (modulo.disponible) {
      router.push(modulo.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">K</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">KyMOS</h1>
                <p className="text-blue-200 text-sm">Enterprise Resource Planning</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right hidden md:block">
                <p className="text-white font-medium">{user?.nombre}</p>
                <p className="text-blue-200 text-sm">{user?.empresa}</p>
              </div>
              <div className="text-right hidden lg:block">
                <p className="text-white text-lg font-mono">
                  {currentTime.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-blue-200 text-sm">
                  {currentTime.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-2">
            Bienvenido, {user?.nombre?.split(' ')[0]}
          </h2>
          <p className="text-blue-200">Selecciona un módulo para comenzar</p>
        </div>

        {/* Módulos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {modulos.map((modulo) => {
            const Icon = modulo.icon;
            return (
              <button
                key={modulo.id}
                onClick={() => handleModuloClick(modulo)}
                disabled={!modulo.disponible}
                className={`group relative p-6 rounded-2xl transition-all duration-300 ${
                  modulo.disponible 
                    ? `${modulo.bgColor} cursor-pointer transform hover:scale-105 hover:shadow-xl` 
                    : 'bg-gray-800/50 cursor-not-allowed opacity-60'
                }`}
              >
                {!modulo.disponible && (
                  <span className="absolute top-3 right-3 text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
                    Próximamente
                  </span>
                )}
                
                <div className={`w-16 h-16 rounded-xl ${modulo.disponible ? modulo.bgColor : 'bg-gray-700'} flex items-center justify-center mb-4 mx-auto transition-transform group-hover:scale-110`}>
                  <Icon className={`w-8 h-8 ${modulo.disponible ? modulo.color : 'text-gray-400'}`} />
                </div>
                
                <h3 className={`font-semibold text-center mb-1 ${modulo.disponible ? 'text-gray-900' : 'text-gray-400'}`}>
                  {modulo.nombre}
                </h3>
                <p className={`text-xs text-center ${modulo.disponible ? 'text-gray-600' : 'text-gray-500'}`}>
                  {modulo.descripcion}
                </p>

                {modulo.disponible && (
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className={`w-5 h-5 ${modulo.color}`} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center">
          <p className="text-blue-300/60 text-sm">
            KyMOS ERP v1.0 • Desarrollado por ETL Technology
          </p>
        </div>
      </main>
    </div>
  );
}
