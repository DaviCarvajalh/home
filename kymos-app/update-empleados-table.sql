-- ========================================
-- ACTUALIZAR TABLA empleados CON TODOS LOS CAMPOS DEL FORMULARIO
-- Ejecutar en la base de datos de la empresa (ej: ignisterra_db)
-- ========================================

USE ignisterra_db;
GO

-- ========================================
-- DATOS PERSONALES
-- ========================================
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'empleados' AND COLUMN_NAME = 'nacionalidad')
    ALTER TABLE empleados ADD nacionalidad VARCHAR(50) NULL;

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'empleados' AND COLUMN_NAME = 'sexo')
    ALTER TABLE empleados ADD sexo CHAR(1) NULL;

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'empleados' AND COLUMN_NAME = 'estado_civil')
    ALTER TABLE empleados ADD estado_civil VARCHAR(20) NULL;

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'empleados' AND COLUMN_NAME = 'cantidad_hijos')
    ALTER TABLE empleados ADD cantidad_hijos INT DEFAULT 0;

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'empleados' AND COLUMN_NAME = 'direccion')
    ALTER TABLE empleados ADD direccion VARCHAR(255) NULL;

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'empleados' AND COLUMN_NAME = 'comuna')
    ALTER TABLE empleados ADD comuna VARCHAR(100) NULL;

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'empleados' AND COLUMN_NAME = 'ciudad')
    ALTER TABLE empleados ADD ciudad VARCHAR(100) NULL;

-- Contacto de emergencia
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'empleados' AND COLUMN_NAME = 'contacto_emergencia_nombre')
    ALTER TABLE empleados ADD contacto_emergencia_nombre VARCHAR(100) NULL;

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'empleados' AND COLUMN_NAME = 'contacto_emergencia_telefono')
    ALTER TABLE empleados ADD contacto_emergencia_telefono VARCHAR(20) NULL;

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'empleados' AND COLUMN_NAME = 'contacto_emergencia_relacion')
    ALTER TABLE empleados ADD contacto_emergencia_relacion VARCHAR(50) NULL;

-- ========================================
-- DATOS LABORALES
-- ========================================
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'empleados' AND COLUMN_NAME = 'fecha_termino')
    ALTER TABLE empleados ADD fecha_termino DATE NULL;

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'empleados' AND COLUMN_NAME = 'tipo_contrato')
    ALTER TABLE empleados ADD tipo_contrato VARCHAR(30) NULL;

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'empleados' AND COLUMN_NAME = 'jornada')
    ALTER TABLE empleados ADD jornada VARCHAR(30) NULL;

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'empleados' AND COLUMN_NAME = 'horario')
    ALTER TABLE empleados ADD horario VARCHAR(50) NULL;

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'empleados' AND COLUMN_NAME = 'modalidad')
    ALTER TABLE empleados ADD modalidad VARCHAR(20) NULL;

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'empleados' AND COLUMN_NAME = 'subdepartamento')
    ALTER TABLE empleados ADD subdepartamento VARCHAR(100) NULL;

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'empleados' AND COLUMN_NAME = 'centro_costo')
    ALTER TABLE empleados ADD centro_costo VARCHAR(50) NULL;

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'empleados' AND COLUMN_NAME = 'supervisor')
    ALTER TABLE empleados ADD supervisor VARCHAR(100) NULL;

-- ========================================
-- DATOS DE RENTA
-- ========================================
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'empleados' AND COLUMN_NAME = 'tipo_sueldo')
    ALTER TABLE empleados ADD tipo_sueldo VARCHAR(20) NULL;

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'empleados' AND COLUMN_NAME = 'asignacion_colacion')
    ALTER TABLE empleados ADD asignacion_colacion DECIMAL(12,2) NULL;

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'empleados' AND COLUMN_NAME = 'asignacion_movilizacion')
    ALTER TABLE empleados ADD asignacion_movilizacion DECIMAL(12,2) NULL;

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'empleados' AND COLUMN_NAME = 'asignacion_zona')
    ALTER TABLE empleados ADD asignacion_zona DECIMAL(12,2) NULL;

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'empleados' AND COLUMN_NAME = 'asignacion_responsabilidad')
    ALTER TABLE empleados ADD asignacion_responsabilidad DECIMAL(12,2) NULL;

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'empleados' AND COLUMN_NAME = 'bonos')
    ALTER TABLE empleados ADD bonos DECIMAL(12,2) NULL;

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'empleados' AND COLUMN_NAME = 'forma_pago')
    ALTER TABLE empleados ADD forma_pago VARCHAR(20) NULL;

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'empleados' AND COLUMN_NAME = 'banco')
    ALTER TABLE empleados ADD banco VARCHAR(50) NULL;

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'empleados' AND COLUMN_NAME = 'tipo_cuenta')
    ALTER TABLE empleados ADD tipo_cuenta VARCHAR(20) NULL;

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'empleados' AND COLUMN_NAME = 'numero_cuenta')
    ALTER TABLE empleados ADD numero_cuenta VARCHAR(30) NULL;

-- ========================================
-- DATOS DE PREVISIÓN
-- ========================================
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'empleados' AND COLUMN_NAME = 'afp')
    ALTER TABLE empleados ADD afp VARCHAR(50) NULL;

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'empleados' AND COLUMN_NAME = 'salud')
    ALTER TABLE empleados ADD salud VARCHAR(50) NULL;

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'empleados' AND COLUMN_NAME = 'plan_isapre')
    ALTER TABLE empleados ADD plan_isapre VARCHAR(20) NULL;

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'empleados' AND COLUMN_NAME = 'tramo_asignacion_familiar')
    ALTER TABLE empleados ADD tramo_asignacion_familiar CHAR(1) NULL;

-- ========================================
-- DATOS DE ASISTENCIA
-- ========================================
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'empleados' AND COLUMN_NAME = 'turno')
    ALTER TABLE empleados ADD turno VARCHAR(30) NULL;

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'empleados' AND COLUMN_NAME = 'horario_asistencia')
    ALTER TABLE empleados ADD horario_asistencia VARCHAR(50) NULL;

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'empleados' AND COLUMN_NAME = 'calendario')
    ALTER TABLE empleados ADD calendario VARCHAR(50) NULL;

-- ========================================
-- FOTO
-- ========================================
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'empleados' AND COLUMN_NAME = 'foto_url')
    ALTER TABLE empleados ADD foto_url VARCHAR(500) NULL;

GO

PRINT '✓ Tabla empleados actualizada correctamente';
GO

-- Verificar estructura final
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'empleados'
ORDER BY ORDINAL_POSITION;
GO
