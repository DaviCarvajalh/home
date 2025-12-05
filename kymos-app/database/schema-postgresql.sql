-- ========================================
-- KYMOS - ESQUEMA POSTGRESQL
-- Para usar con Supabase o cualquier PostgreSQL
-- ========================================

-- ========================================
-- TABLA: empresas (multi-tenant)
-- ========================================
CREATE TABLE IF NOT EXISTS empresas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    rut VARCHAR(20) UNIQUE NOT NULL,
    db_schema VARCHAR(100) UNIQUE NOT NULL,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA: usuarios
-- ========================================
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    empresa_id INTEGER REFERENCES empresas(id),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    rol VARCHAR(50) DEFAULT 'empleado',
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA: empleados (completa)
-- ========================================
CREATE TABLE IF NOT EXISTS empleados (
    id SERIAL PRIMARY KEY,
    empresa_id INTEGER REFERENCES empresas(id),
    usuario_id INTEGER REFERENCES usuarios(id),
    codigo_empleado VARCHAR(20),
    
    -- Datos personales
    rut VARCHAR(20) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    telefono VARCHAR(20),
    fecha_nacimiento DATE,
    nacionalidad VARCHAR(50),
    sexo CHAR(1),
    estado_civil VARCHAR(20),
    cantidad_hijos INTEGER DEFAULT 0,
    direccion VARCHAR(255),
    comuna VARCHAR(100),
    ciudad VARCHAR(100),
    foto_url VARCHAR(500),
    
    -- Contacto emergencia
    contacto_emergencia_nombre VARCHAR(100),
    contacto_emergencia_telefono VARCHAR(20),
    contacto_emergencia_relacion VARCHAR(50),
    
    -- Datos laborales
    fecha_ingreso DATE NOT NULL,
    fecha_termino DATE,
    departamento VARCHAR(100),
    subdepartamento VARCHAR(100),
    cargo VARCHAR(100),
    tipo_contrato VARCHAR(30),
    jornada VARCHAR(30),
    horario VARCHAR(50),
    modalidad VARCHAR(20),
    centro_costo VARCHAR(50),
    supervisor VARCHAR(100),
    
    -- Datos de renta
    salario DECIMAL(12,2),
    tipo_sueldo VARCHAR(20),
    asignacion_colacion DECIMAL(12,2),
    asignacion_movilizacion DECIMAL(12,2),
    asignacion_zona DECIMAL(12,2),
    asignacion_responsabilidad DECIMAL(12,2),
    bonos DECIMAL(12,2),
    forma_pago VARCHAR(20),
    banco VARCHAR(50),
    tipo_cuenta VARCHAR(20),
    numero_cuenta VARCHAR(30),
    
    -- Previsión
    afp VARCHAR(50),
    salud VARCHAR(50),
    plan_isapre VARCHAR(20),
    tramo_asignacion_familiar CHAR(1),
    
    -- Asistencia
    turno VARCHAR(30),
    horario_asistencia VARCHAR(50),
    calendario VARCHAR(50),
    
    -- Estado
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Índice único por empresa
    UNIQUE(empresa_id, rut),
    UNIQUE(empresa_id, codigo_empleado)
);

-- ========================================
-- TABLA: vacaciones
-- ========================================
CREATE TABLE IF NOT EXISTS vacaciones (
    id SERIAL PRIMARY KEY,
    empleado_id INTEGER REFERENCES empleados(id) ON DELETE CASCADE,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    dias_solicitados INTEGER NOT NULL,
    estado VARCHAR(20) DEFAULT 'pendiente',
    aprobado_por INTEGER REFERENCES usuarios(id),
    comentario TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA: asistencia
-- ========================================
CREATE TABLE IF NOT EXISTS asistencia (
    id SERIAL PRIMARY KEY,
    empleado_id INTEGER REFERENCES empleados(id) ON DELETE CASCADE,
    fecha DATE NOT NULL,
    hora_entrada TIME,
    hora_salida TIME,
    estado VARCHAR(20) DEFAULT 'presente',
    observacion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA: cargas_familiares
-- ========================================
CREATE TABLE IF NOT EXISTS cargas_familiares (
    id SERIAL PRIMARY KEY,
    empleado_id INTEGER REFERENCES empleados(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    rut VARCHAR(20),
    parentesco VARCHAR(50),
    fecha_nacimiento DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- ÍNDICES para mejor rendimiento
-- ========================================
CREATE INDEX IF NOT EXISTS idx_empleados_empresa ON empleados(empresa_id);
CREATE INDEX IF NOT EXISTS idx_empleados_activo ON empleados(activo);
CREATE INDEX IF NOT EXISTS idx_empleados_departamento ON empleados(departamento);
CREATE INDEX IF NOT EXISTS idx_usuarios_empresa ON usuarios(empresa_id);
CREATE INDEX IF NOT EXISTS idx_vacaciones_empleado ON vacaciones(empleado_id);
CREATE INDEX IF NOT EXISTS idx_asistencia_empleado ON asistencia(empleado_id);
CREATE INDEX IF NOT EXISTS idx_asistencia_fecha ON asistencia(fecha);

-- ========================================
-- FUNCIÓN: actualizar updated_at automáticamente
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_empleados_updated_at
    BEFORE UPDATE ON empleados
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- DATOS INICIALES
-- ========================================
INSERT INTO empresas (nombre, rut, db_schema) 
VALUES ('IGNISTERRA S.A.', '96.603.290-1', 'ignisterra')
ON CONFLICT (rut) DO NOTHING;

-- Usuario admin inicial (password: admin123)
INSERT INTO usuarios (empresa_id, email, password_hash, nombre, rol)
VALUES (
    (SELECT id FROM empresas WHERE rut = '96.603.290-1'),
    'admin@ignisterra.cl',
    '$2b$10$rOvHPxfzO2yPxKxKxKxKxOvHPxfzO2yPxKxKxKxKxOvHPxfzO2yPx',
    'Administrador',
    'admin'
)
ON CONFLICT (email) DO NOTHING;

-- ========================================
-- ROW LEVEL SECURITY (para multi-tenant)
-- ========================================
ALTER TABLE empleados ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE vacaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE asistencia ENABLE ROW LEVEL SECURITY;
ALTER TABLE cargas_familiares ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (ajustar según necesidades)
-- Por ahora permitimos todo para el desarrollo
CREATE POLICY "Allow all for now" ON empleados FOR ALL USING (true);
CREATE POLICY "Allow all for now" ON usuarios FOR ALL USING (true);
CREATE POLICY "Allow all for now" ON vacaciones FOR ALL USING (true);
CREATE POLICY "Allow all for now" ON asistencia FOR ALL USING (true);
CREATE POLICY "Allow all for now" ON cargas_familiares FOR ALL USING (true);
