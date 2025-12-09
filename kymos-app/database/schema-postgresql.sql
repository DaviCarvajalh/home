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
    empresa_id INTEGER REFERENCES empresas(id),
    empleado_id INTEGER REFERENCES empleados(id) ON DELETE CASCADE,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    dias_solicitados INTEGER NOT NULL,
    estado VARCHAR(20) DEFAULT 'pendiente', -- pendiente, aprobada, rechazada
    aprobado_por INTEGER REFERENCES usuarios(id),
    comentario TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vacaciones_empresa ON vacaciones(empresa_id);

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

-- ========================================
-- TABLA: liquidaciones
-- ========================================
CREATE TABLE IF NOT EXISTS liquidaciones (
    id SERIAL PRIMARY KEY,
    empresa_id INTEGER REFERENCES empresas(id),
    empleado_id INTEGER REFERENCES empleados(id) ON DELETE CASCADE,
    
    -- Período
    periodo_mes INTEGER NOT NULL,
    periodo_anio INTEGER NOT NULL,
    fecha_emision DATE DEFAULT CURRENT_DATE,
    
    -- Haberes
    sueldo_base DECIMAL(12,2) DEFAULT 0,
    gratificacion DECIMAL(12,2) DEFAULT 0,
    horas_extras DECIMAL(12,2) DEFAULT 0,
    comisiones DECIMAL(12,2) DEFAULT 0,
    bonos DECIMAL(12,2) DEFAULT 0,
    asignacion_colacion DECIMAL(12,2) DEFAULT 0,
    asignacion_movilizacion DECIMAL(12,2) DEFAULT 0,
    asignacion_familiar DECIMAL(12,2) DEFAULT 0,
    otros_haberes DECIMAL(12,2) DEFAULT 0,
    total_haberes DECIMAL(12,2) DEFAULT 0,
    
    -- Descuentos legales
    afp_monto DECIMAL(12,2) DEFAULT 0,
    afp_porcentaje DECIMAL(5,2) DEFAULT 0,
    salud_monto DECIMAL(12,2) DEFAULT 0,
    salud_porcentaje DECIMAL(5,2) DEFAULT 0,
    seguro_cesantia DECIMAL(12,2) DEFAULT 0,
    impuesto_unico DECIMAL(12,2) DEFAULT 0,
    total_descuentos_legales DECIMAL(12,2) DEFAULT 0,
    
    -- Otros descuentos
    anticipos DECIMAL(12,2) DEFAULT 0,
    prestamos DECIMAL(12,2) DEFAULT 0,
    otros_descuentos DECIMAL(12,2) DEFAULT 0,
    total_otros_descuentos DECIMAL(12,2) DEFAULT 0,
    
    -- Totales
    total_descuentos DECIMAL(12,2) DEFAULT 0,
    sueldo_liquido DECIMAL(12,2) DEFAULT 0,
    
    -- Estado
    estado VARCHAR(20) DEFAULT 'borrador',
    
    -- Metadatos
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Índice único
    UNIQUE(empleado_id, periodo_mes, periodo_anio)
);

CREATE INDEX IF NOT EXISTS idx_liquidaciones_empresa ON liquidaciones(empresa_id);
CREATE INDEX IF NOT EXISTS idx_liquidaciones_empleado ON liquidaciones(empleado_id);
CREATE INDEX IF NOT EXISTS idx_liquidaciones_periodo ON liquidaciones(periodo_anio, periodo_mes);

CREATE TRIGGER update_liquidaciones_updated_at
    BEFORE UPDATE ON liquidaciones
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE liquidaciones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for now" ON liquidaciones FOR ALL USING (true);

-- ========================================
-- TABLA: contratos
-- ========================================
CREATE TABLE IF NOT EXISTS contratos (
    id SERIAL PRIMARY KEY,
    empresa_id INTEGER REFERENCES empresas(id),
    empleado_id INTEGER REFERENCES empleados(id) ON DELETE CASCADE,
    
    tipo_contrato VARCHAR(50) NOT NULL, -- indefinido, plazo_fijo, obra_faena, honorarios
    fecha_inicio DATE NOT NULL,
    fecha_termino DATE,
    
    -- Condiciones
    jornada VARCHAR(30), -- completa, parcial, articulo_22
    horas_semanales INTEGER DEFAULT 45,
    sueldo_base DECIMAL(12,2),
    
    -- Documentos
    documento_url VARCHAR(500),
    
    -- Estado
    estado VARCHAR(20) DEFAULT 'vigente', -- vigente, terminado, por_vencer
    motivo_termino VARCHAR(100),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_contratos_empresa ON contratos(empresa_id);
CREATE INDEX IF NOT EXISTS idx_contratos_empleado ON contratos(empleado_id);
CREATE INDEX IF NOT EXISTS idx_contratos_estado ON contratos(estado);

-- ========================================
-- TABLA: ausencias
-- ========================================
CREATE TABLE IF NOT EXISTS ausencias (
    id SERIAL PRIMARY KEY,
    empresa_id INTEGER REFERENCES empresas(id),
    empleado_id INTEGER REFERENCES empleados(id) ON DELETE CASCADE,
    
    tipo VARCHAR(50) NOT NULL, -- licencia_medica, permiso, falta, otro
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    dias INTEGER NOT NULL,
    
    motivo TEXT,
    documento_url VARCHAR(500),
    
    estado VARCHAR(20) DEFAULT 'pendiente', -- pendiente, aprobada, rechazada
    aprobado_por INTEGER REFERENCES usuarios(id),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ausencias_empresa ON ausencias(empresa_id);
CREATE INDEX IF NOT EXISTS idx_ausencias_empleado ON ausencias(empleado_id);

-- ========================================
-- TABLA: prestamos
-- ========================================
CREATE TABLE IF NOT EXISTS prestamos (
    id SERIAL PRIMARY KEY,
    empresa_id INTEGER REFERENCES empresas(id),
    empleado_id INTEGER REFERENCES empleados(id) ON DELETE CASCADE,
    
    monto_total DECIMAL(12,2) NOT NULL,
    cuotas_totales INTEGER NOT NULL,
    cuotas_pagadas INTEGER DEFAULT 0,
    monto_cuota DECIMAL(12,2) NOT NULL,
    saldo_pendiente DECIMAL(12,2),
    
    fecha_inicio DATE NOT NULL,
    motivo TEXT,
    
    estado VARCHAR(20) DEFAULT 'activo', -- activo, pagado, cancelado
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_prestamos_empresa ON prestamos(empresa_id);
CREATE INDEX IF NOT EXISTS idx_prestamos_empleado ON prestamos(empleado_id);

-- ========================================
-- TABLA: finiquitos
-- ========================================
CREATE TABLE IF NOT EXISTS finiquitos (
    id SERIAL PRIMARY KEY,
    empresa_id INTEGER REFERENCES empresas(id),
    empleado_id INTEGER REFERENCES empleados(id),
    
    fecha_termino DATE NOT NULL,
    causal VARCHAR(100) NOT NULL,
    
    -- Montos
    sueldo_proporcional DECIMAL(12,2) DEFAULT 0,
    vacaciones_proporcionales DECIMAL(12,2) DEFAULT 0,
    indemnizacion_anos DECIMAL(12,2) DEFAULT 0,
    indemnizacion_aviso DECIMAL(12,2) DEFAULT 0,
    otros_haberes DECIMAL(12,2) DEFAULT 0,
    total_haberes DECIMAL(12,2) DEFAULT 0,
    
    descuentos DECIMAL(12,2) DEFAULT 0,
    total_liquido DECIMAL(12,2) DEFAULT 0,
    
    estado VARCHAR(20) DEFAULT 'borrador', -- borrador, emitido, firmado
    documento_url VARCHAR(500),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_finiquitos_empresa ON finiquitos(empresa_id);
CREATE INDEX IF NOT EXISTS idx_finiquitos_empleado ON finiquitos(empleado_id);

-- ========================================
-- TABLA: sucursales
-- ========================================
CREATE TABLE IF NOT EXISTS sucursales (
    id SERIAL PRIMARY KEY,
    empresa_id INTEGER REFERENCES empresas(id),
    
    nombre VARCHAR(200) NOT NULL,
    direccion VARCHAR(255),
    ciudad VARCHAR(100),
    telefono VARCHAR(20),
    email VARCHAR(255),
    
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sucursales_empresa ON sucursales(empresa_id);

-- ========================================
-- TABLA: periodos (gestión de períodos mensuales)
-- ========================================
CREATE TABLE IF NOT EXISTS periodos (
    id SERIAL PRIMARY KEY,
    empresa_id INTEGER REFERENCES empresas(id),
    mes INTEGER NOT NULL CHECK (mes >= 1 AND mes <= 12),
    anio INTEGER NOT NULL CHECK (anio >= 2020 AND anio <= 2100),
    estado VARCHAR(20) DEFAULT 'abierto' CHECK (estado IN ('abierto', 'cerrado')),
    fecha_apertura TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_cierre TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(empresa_id, mes, anio)
);

CREATE INDEX IF NOT EXISTS idx_periodos_empresa ON periodos(empresa_id);
CREATE INDEX IF NOT EXISTS idx_periodos_estado ON periodos(empresa_id, estado);
