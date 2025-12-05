import {
  HelpCircle,
  Building2,
  UserCircle,
  FileText,
  PiggyBank,
  CalendarX,
  Palmtree,
  Wallet,
  Receipt,
  Upload,
  FileX,
  BarChart3,
  LucideIcon,
} from 'lucide-react';

/**
 * Configuración del menú lateral de KyMOS
 * 
 * Para agregar un nuevo módulo:
 * 1. Importa el ícono de lucide-react
 * 2. Agrega un nuevo objeto MenuItem al array
 * 3. Crea la página correspondiente en /app/[ruta]/page.tsx
 */

export interface SubMenuItem {
  id: string;
  label: string;
  path: string;
  requiredRole?: string[];
}

export interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
  requiredRole?: string[];
  subItems?: SubMenuItem[];
}

export const menuItems: MenuItem[] = [
  {
    id: 'ayuda',
    label: 'Ayuda',
    path: '/ayuda',
    icon: HelpCircle,
  },
  {
    id: 'empresas',
    label: 'Empresas y sucursales',
    path: '/empresas',
    icon: Building2,
    subItems: [
      { id: 'empresas-lista', label: 'Lista de empresas', path: '/empresas' },
      { id: 'sucursales', label: 'Sucursales', path: '/empresas/sucursales' },
    ],
  },
  {
    id: 'trabajadores',
    label: 'Ficha trabajador',
    path: '/trabajadores',
    icon: UserCircle,
    subItems: [
      { id: 'trabajadores-lista', label: 'Lista de trabajadores', path: '/trabajadores' },
      { id: 'trabajadores-nuevo', label: 'Nuevo trabajador', path: '/trabajadores/nuevo' },
    ],
  },
  {
    id: 'contratos',
    label: 'Contratos',
    path: '/contratos',
    icon: FileText,
  },
  {
    id: 'afp',
    label: 'AFPs y ahorro',
    path: '/afp',
    icon: PiggyBank,
    subItems: [
      { id: 'afp-lista', label: 'AFPs', path: '/afp' },
      { id: 'afp-ahorro', label: 'Ahorro previsional', path: '/afp/ahorro' },
    ],
  },
  {
    id: 'ausencias',
    label: 'Días ausentes',
    path: '/ausencias',
    icon: CalendarX,
  },
  {
    id: 'vacaciones',
    label: 'Vacaciones',
    path: '/vacaciones',
    icon: Palmtree,
  },
  {
    id: 'prestamos',
    label: 'Préstamos',
    path: '/prestamos',
    icon: Wallet,
  },
  {
    id: 'liquidaciones',
    label: 'Liquidación de sueldo',
    path: '/liquidaciones',
    icon: Receipt,
  },
  {
    id: 'carga-masiva',
    label: 'Carga masiva',
    path: '/carga-masiva',
    icon: Upload,
    requiredRole: ['admin', 'rrhh'],
  },
  {
    id: 'finiquitos',
    label: 'Finiquitos',
    path: '/finiquitos',
    icon: FileX,
  },
  {
    id: 'reportes',
    label: 'Reportes',
    path: '/reportes',
    icon: BarChart3,
    subItems: [
      { id: 'reportes-nomina', label: 'Nómina', path: '/reportes/nomina' },
      { id: 'reportes-asistencia', label: 'Asistencia', path: '/reportes/asistencia' },
      { id: 'reportes-costos', label: 'Costos laborales', path: '/reportes/costos' },
    ],
  },
];

export const APP_SUBTITLE = 'Recursos Humanos';
export const APP_NAME = 'KyMOS';
export const APP_DEVELOPER = 'ETL Technology';
