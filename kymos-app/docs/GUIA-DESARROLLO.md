# Guía de Desarrollo - KyMOS

## Patrones y Buenas Prácticas

### Formularios React - Evitar pérdida de focus en inputs

Al crear formularios con componentes Input/Select reutilizables, **NUNCA** definir componentes dentro del componente principal. Se recrean en cada render y causan pérdida de focus.

#### ❌ Incorrecto

```tsx
export default function MiFormulario() {
  const [formData, setFormData] = useState({...});
  
  // ❌ Este componente se recrea en cada render
  const Input = ({ label, name, value }) => (
    <input name={name} value={value} onChange={handleChange} />
  );
  
  return <Input label="Nombre" name="nombre" value={formData.nombre} />;
}
```

#### ✅ Correcto

```tsx
// 1. Definir componentes FUERA del componente principal
const FormInput = ({ label, name, value, onChange, type = 'text', placeholder = '', required = false, icon: Icon, className = '' }: any) => (
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
        className={`w-full py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 ${Icon ? 'pl-10 pr-4' : 'px-4'}`} 
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
        className={`w-full py-2.5 border border-gray-300 rounded-lg appearance-none bg-white ${Icon ? 'pl-10 pr-4' : 'px-4'}`}
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

// 2. Componente principal
export default function MiFormulario() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    // ...
  });

  // 3. Memorizar handleChange con useCallback
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  // 4. Crear wrappers memorizados con useMemo
  const Input = useMemo(() => (props: any) => <FormInput {...props} onChange={handleChange} />, [handleChange]);
  const Select = useMemo(() => (props: any) => <FormSelect {...props} onChange={handleChange} />, [handleChange]);

  return (
    <form>
      <Input label="Nombre" name="nombre" value={formData.nombre} required icon={User} />
      <Input label="Email" name="email" value={formData.email} type="email" icon={Mail} />
      <Select label="Departamento" name="departamento" value={formData.departamento} options={departamentos} />
    </form>
  );
}
```

#### Alternativa Simple

Para formularios pequeños, usar setters directos inline:

```tsx
const [nombre, setNombre] = useState('');
const [email, setEmail] = useState('');

<input value={nombre} onChange={(e) => setNombre(e.target.value)} />
<input value={email} onChange={(e) => setEmail(e.target.value)} />
```

---

## Estructura del Proyecto

```
kymos-app/
├── app/
│   ├── (dashboard)/          # Páginas del dashboard (con layout)
│   │   ├── trabajadores/
│   │   │   ├── page.tsx      # Lista de trabajadores
│   │   │   └── nuevo/
│   │   │       └── page.tsx  # Formulario nuevo trabajador
│   │   └── ...
│   ├── api/                  # API Routes
│   │   └── empleados/
│   │       ├── route.ts      # GET/POST empleados
│   │       └── next-codigo/
│   │           └── route.ts  # Obtener siguiente código
│   └── globals.css           # Estilos globales + dark mode
├── components/
│   ├── layout/
│   │   ├── Header.tsx        # Header con menú usuario
│   │   └── Sidebar.tsx       # Menú lateral
│   └── ui/
│       └── PageHeader.tsx    # Header de páginas
├── lib/
│   └── db.ts                 # Conexión a SQL Server
└── docs/
    └── GUIA-DESARROLLO.md    # Esta guía
```

---

## Conexión a Base de Datos

### SQL Server (actual)

```typescript
// lib/db.ts
import sql from 'mssql/msnodesqlv8';

export async function getCompanyConnection(dbName: string): Promise<sql.ConnectionPool> {
  const connectionString = `Driver={ODBC Driver 17 for SQL Server};Server=${server};Database=${dbName};Trusted_Connection=yes;`;
  return await sql.connect({ connectionString });
}
```

### Uso en API Routes

```typescript
// app/api/empleados/route.ts
import { getCompanyConnection } from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const session = JSON.parse(cookieStore.get('session')?.value || '{}');
  const pool = await getCompanyConnection(session.dbName);
  
  const result = await pool.request().query('SELECT * FROM empleados');
  await pool.close();
  
  return NextResponse.json({ empleados: result.recordset });
}
```

---

## Estilos y Temas

### Dark Mode

El dark mode se activa agregando la clase `dark` al elemento `<html>`:

```typescript
// Activar
document.documentElement.classList.add('dark');
localStorage.setItem('darkMode', 'true');

// Desactivar
document.documentElement.classList.remove('dark');
localStorage.setItem('darkMode', 'false');
```

### Colores principales

- **Primario:** `emerald-500`, `emerald-600`, `emerald-700`
- **Fondo:** `gray-50`, `gray-100`
- **Texto:** `gray-800`, `gray-600`, `gray-500`
- **Bordes:** `gray-200`, `gray-300`
- **Error:** `red-500`, `red-100`
- **Éxito:** `emerald-500`, `emerald-100`

---

## Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build producción
npm run build

# Iniciar producción
npm start

# Linting
npm run lint
```

---

## Despliegue

### Desarrollo local
```
http://localhost:3000
```

### Acceso por red
```
http://[IP-LOCAL]:3000
```

### Producción (PM2)
```bash
npm run build
pm2 start npm --name "kymos" -- start
pm2 save
```
