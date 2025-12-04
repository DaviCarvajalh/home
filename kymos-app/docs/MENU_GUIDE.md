# Guía del Menú Lateral - KyMOS

## Estructura de archivos

```
kymos-app/
├── config/
│   └── menu.ts              # Configuración del menú
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx      # Componente del sidebar
│   │   └── DashboardLayout.tsx  # Layout principal
│   └── ui/
│       └── PageHeader.tsx   # Header reutilizable para páginas
└── app/
    └── (dashboard)/         # Grupo de rutas con sidebar
        ├── layout.tsx       # Layout que incluye el sidebar
        ├── dashboard/
        ├── ayuda/
        ├── empresas/
        ├── trabajadores/
        └── ...
```

## Cómo agregar un nuevo módulo al menú

### Paso 1: Agregar al archivo de configuración

Edita `config/menu.ts`:

```typescript
import { NuevoIcono } from 'lucide-react';

// Agregar al array menuItems:
{
  id: 'nuevo-modulo',
  label: 'Nuevo Módulo',
  path: '/nuevo-modulo',
  icon: NuevoIcono,
  requiredRole: ['admin'], // Opcional: roles permitidos
  subItems: [              // Opcional: submenús
    { id: 'sub1', label: 'Submenú 1', path: '/nuevo-modulo/sub1' },
    { id: 'sub2', label: 'Submenú 2', path: '/nuevo-modulo/sub2' },
  ],
}
```

### Paso 2: Crear la página

Crea el archivo `app/(dashboard)/nuevo-modulo/page.tsx`:

```typescript
import PageHeader from '@/components/ui/PageHeader';
import { NuevoIcono } from 'lucide-react';

export default function NuevoModuloPage() {
  return (
    <>
      <PageHeader
        title="Nuevo Módulo"
        description="Descripción del módulo"
        icon={NuevoIcono}
      />
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* Contenido del módulo */}
      </div>
    </>
  );
}
```

### Paso 3: Crear subpáginas (si aplica)

Para cada submenú, crea `app/(dashboard)/nuevo-modulo/sub1/page.tsx`

## Íconos disponibles

Usamos [Lucide Icons](https://lucide.dev/icons/). Algunos ejemplos:

- `HelpCircle` - Ayuda
- `Building2` - Empresas
- `UserCircle` - Usuarios/Trabajadores
- `FileText` - Documentos/Contratos
- `PiggyBank` - Finanzas/AFP
- `CalendarX` - Ausencias
- `Palmtree` - Vacaciones
- `Wallet` - Préstamos
- `Receipt` - Liquidaciones
- `Upload` - Carga masiva
- `FileX` - Finiquitos
- `BarChart3` - Reportes

## Permisos por rol

El campo `requiredRole` permite restringir módulos:

```typescript
{
  id: 'admin-only',
  label: 'Solo Admin',
  path: '/admin',
  icon: Settings,
  requiredRole: ['admin'],
}
```

## Personalización del Sidebar

### Colores

Los colores principales están en `Sidebar.tsx`:

- **Fondo**: `from-gray-900 via-gray-800 to-gray-900`
- **Activo**: `bg-emerald-600`
- **Hover**: `hover:bg-gray-700/50`
- **Texto**: `text-gray-300` / `text-white`

### Logo

Modifica en `config/menu.ts`:

```typescript
export const APP_VERSION = 'v1.0.1';
export const APP_NAME = 'KyMOS';
```

## Responsive

El sidebar:
- **Desktop**: Visible, colapsable con botón
- **Mobile**: Oculto por defecto, se abre con botón hamburguesa
