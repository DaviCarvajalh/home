import type { Metadata } from "next";
import Link from "next/link";
import {
  Users2, ShoppingCart, Truck, Package,
  Calculator, Settings, Factory, Briefcase,
  BarChart2, FileText, Building2, Clock,
} from "lucide-react";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Home" };

const MODULES = [
  {
    id: "rrhh",
    label: "Recursos Humanos",
    desc: "Gestión de personal, liquidaciones, bonos y más",
    icon: Users2,
    href: "/rrhh",
    bg: "bg-blue-50",
    iconColor: "text-blue-500",
    active: false,
  },
  {
    id: "ventas",
    label: "Ventas",
    desc: "Facturación, cotizaciones y clientes",
    icon: ShoppingCart,
    href: "/ventas",
    bg: "bg-pink-50",
    iconColor: "text-pink-500",
    active: false,
  },
  {
    id: "compras",
    label: "Compras",
    desc: "Órdenes de compra y proveedores",
    icon: Truck,
    href: "/compras",
    bg: "bg-teal-50",
    iconColor: "text-teal-500",
    active: false,
  },
  {
    id: "inventario",
    label: "Inventario",
    desc: "Control de stock, productos y bodegas",
    icon: Package,
    href: "/inventario",
    bg: "bg-orange-50",
    iconColor: "text-orange-500",
    active: false,
  },
  {
    id: "contabilidad",
    label: "Contabilidad",
    desc: "Libro mayor, balances y reportes financieros",
    icon: Calculator,
    href: "/contabilidad",
    bg: "bg-red-50",
    iconColor: "text-red-500",
    active: false,
  },
  {
    id: "configuracion",
    label: "Configuración",
    desc: "Usuarios, roles, empresa y parámetros",
    icon: Settings,
    href: "/configuracion",
    bg: "bg-indigo-50",
    iconColor: "text-indigo-500",
    active: false,
  },
  {
    id: "produccion",
    label: "Producción",
    desc: "Órdenes de trabajo y control de procesos",
    icon: Factory,
    href: "/produccion",
    bg: "",
    iconColor: "",
    active: false,
  },
  {
    id: "proyectos",
    label: "Proyectos",
    desc: "Gestión de proyectos y horas",
    icon: Briefcase,
    href: "/proyectos",
    bg: "",
    iconColor: "",
    active: false,
  },
  {
    id: "reportes",
    label: "Reportes BI",
    desc: "Dashboarding y análisis de datos",
    icon: BarChart2,
    href: "/reportes",
    bg: "",
    iconColor: "",
    active: false,
  },
  {
    id: "documentos",
    label: "Documentos",
    desc: "Gestión documental y archivos",
    icon: FileText,
    href: "/documentos",
    bg: "",
    iconColor: "",
    active: false,
  },
  {
    id: "activos",
    label: "Activos Fijos",
    desc: "Control de activos y depreciación",
    icon: Building2,
    href: "/activos",
    bg: "",
    iconColor: "",
    active: false,
  },
  {
    id: "horario",
    label: "Control Horario",
    desc: "Manejo y control de asistencia",
    icon: Clock,
    href: "/horario",
    bg: "",
    iconColor: "",
    active: false,
  },
];

export default async function DashboardPage() {
  const session = await getSession();
  const firstName = session?.name?.split(" ")[0] ?? "Usuario";

  return (
    <div className="flex-1 flex flex-col items-center justify-start px-6 py-12">

      {/* Welcome */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white">
          Bienvenido, {firstName}
        </h1>
        <p className="text-white/40 text-sm mt-1.5">
          Selecciona un módulo para comenzar
        </p>
      </div>

      {/* Module grid */}
      <div className="w-full max-w-5xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {MODULES.map(({ id, label, desc, icon: Icon, href, bg, iconColor, active }) =>
          active ? (
            <Link
              key={id}
              href={href}
              className={`relative flex flex-col items-center text-center gap-3 p-6 rounded-2xl ${bg} hover:brightness-95 active:scale-[0.98] transition-all shadow-sm`}
            >
              <div className="w-12 h-12 flex items-center justify-center">
                <Icon size={30} className={iconColor} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-gray-800 font-semibold text-sm">{label}</p>
                <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </Link>
          ) : (
            <div
              key={id}
              className="relative flex flex-col items-center text-center gap-3 p-6 rounded-2xl bg-[#1a2040] cursor-not-allowed select-none"
            >
              <span className="absolute top-2.5 right-2.5 text-[9px] font-semibold text-white/30 bg-white/5 px-1.5 py-0.5 rounded">
                Próximamente
              </span>
              <div className="w-12 h-12 flex items-center justify-center">
                <Icon size={30} className="text-white/20" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-white/30 font-semibold text-sm">{label}</p>
                <p className="text-white/15 text-xs mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
