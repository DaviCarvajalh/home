-- ========================================
-- LIMPIAR TODO Y CREAR DESDE CERO
-- ========================================

-- Eliminar base de datos ignisterra si existe
IF EXISTS (SELECT name FROM sys.databases WHERE name = 'ignisterra_db')
BEGIN
    ALTER DATABASE ignisterra_db SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE ignisterra_db;
END
GO

-- Eliminar base de datos kymos_master si existe
IF EXISTS (SELECT name FROM sys.databases WHERE name = 'kymos_master')
BEGIN
    ALTER DATABASE kymos_master SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE kymos_master;
END
GO

-- ========================================
-- CREAR KYMOS_MASTER
-- ========================================
CREATE DATABASE kymos_master;
GO

USE kymos_master;
GO

CREATE TABLE empresas (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    rut VARCHAR(20) UNIQUE NOT NULL,
    db_name VARCHAR(100) UNIQUE NOT NULL,
    activo BIT DEFAULT 1,
    created_at DATETIME DEFAULT GETDATE()
);

CREATE TABLE admins (
    id INT IDENTITY(1,1) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    created_at DATETIME DEFAULT GETDATE()
);

-- Registrar Ignisterra como empresa
INSERT INTO empresas (nombre, rut, db_name) 
VALUES ('IGNISTERRA S.A.', '96.603.290-1', 'ignisterra_db');

PRINT '✓ kymos_master creada correctamente';
GO

-- ========================================
-- CREAR IGNISTERRA_DB
-- ========================================
CREATE DATABASE ignisterra_db;
GO

USE ignisterra_db;
GO

CREATE TABLE usuarios (
    id INT IDENTITY(1,1) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    rol VARCHAR(50) DEFAULT 'empleado',
    activo BIT DEFAULT 1,
    created_at DATETIME DEFAULT GETDATE()
);

CREATE TABLE empleados (
    id INT IDENTITY(1,1) PRIMARY KEY,
    usuario_id INT FOREIGN KEY REFERENCES usuarios(id),
    rut VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    telefono VARCHAR(20),
    fecha_nacimiento DATE,
    fecha_ingreso DATE NOT NULL,
    departamento VARCHAR(100),
    cargo VARCHAR(100),
    salario DECIMAL(12,2),
    activo BIT DEFAULT 1,
    created_at DATETIME DEFAULT GETDATE()
);

CREATE TABLE vacaciones (
    id INT IDENTITY(1,1) PRIMARY KEY,
    empleado_id INT FOREIGN KEY REFERENCES empleados(id),
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    dias_solicitados INT NOT NULL,
    estado VARCHAR(20) DEFAULT 'pendiente',
    aprobado_por INT FOREIGN KEY REFERENCES usuarios(id),
    comentario TEXT,
    created_at DATETIME DEFAULT GETDATE()
);

CREATE TABLE asistencia (
    id INT IDENTITY(1,1) PRIMARY KEY,
    empleado_id INT FOREIGN KEY REFERENCES empleados(id),
    fecha DATE NOT NULL,
    hora_entrada TIME,
    hora_salida TIME,
    estado VARCHAR(20) DEFAULT 'presente',
    observacion TEXT,
    created_at DATETIME DEFAULT GETDATE()
);

PRINT '✓ ignisterra_db creada correctamente';
GO

-- ========================================
-- VERIFICAR
-- ========================================
USE kymos_master;
SELECT 'EMPRESAS REGISTRADAS:' AS Info;
SELECT * FROM empresas;
GO
