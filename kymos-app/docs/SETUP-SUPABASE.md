# Configuración de Supabase para KyMOS

## 1. Crear cuenta en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta gratuita (puedes usar GitHub)
3. Crea un nuevo proyecto:
   - **Nombre:** kymos-production (o el que prefieras)
   - **Password:** Genera una contraseña segura (¡guárdala!)
   - **Región:** South America (São Paulo) - más cercano a Chile

## 2. Obtener credenciales

Una vez creado el proyecto, ve a **Settings > Database**:

1. **Connection String (URI):**
   - Copia el string de conexión
   - Reemplaza `[YOUR-PASSWORD]` con la contraseña que creaste
   - Ejemplo: `postgresql://postgres:TuPassword@db.xxxxx.supabase.co:5432/postgres`

2. Ve a **Settings > API** para obtener:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

## 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
DATABASE_URL=postgresql://postgres:TuPassword@db.xxxxx.supabase.co:5432/postgres
NEXTAUTH_SECRET=genera-un-string-random-de-32-caracteres
NEXTAUTH_URL=http://localhost:3000
```

## 4. Crear las tablas

1. Ve a **SQL Editor** en Supabase
2. Copia el contenido de `database/schema-postgresql.sql`
3. Ejecuta el script

## 5. Migrar datos existentes (opcional)

Si tienes datos en SQL Server que quieres migrar:

```sql
-- Exportar de SQL Server a CSV
-- Luego importar en Supabase via Table Editor > Import
```

## 6. Verificar conexión

```bash
npm run dev
```

Visita `http://localhost:3000/api/test-db` para verificar la conexión.

---

## Comandos útiles

```bash
# Desarrollo local
npm run dev

# Build para producción
npm run build

# Deploy a Vercel
vercel deploy
```

## Estructura de la base de datos

```
├── empresas          # Multi-tenant: cada empresa tiene su registro
├── usuarios          # Usuarios del sistema (login)
├── empleados         # Trabajadores de cada empresa
├── vacaciones        # Solicitudes de vacaciones
├── asistencia        # Registro de asistencia
└── cargas_familiares # Cargas familiares de empleados
```

## Row Level Security (RLS)

Supabase usa RLS para seguridad a nivel de fila. Actualmente está configurado para permitir todo durante desarrollo. Para producción, configura políticas como:

```sql
-- Solo ver empleados de tu empresa
CREATE POLICY "Users can only see their company employees"
ON empleados
FOR SELECT
USING (empresa_id = current_setting('app.current_empresa_id')::int);
```

## Soporte

- [Documentación Supabase](https://supabase.com/docs)
- [Documentación Next.js](https://nextjs.org/docs)
