-- ========================================
-- AGREGAR COLUMNA codigo_empleado A LA TABLA empleados
-- Ejecutar en la base de datos de la empresa (ej: ignisterra_db)
-- ========================================

USE ignisterra_db;
GO

-- Verificar si la columna ya existe
IF NOT EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'empleados' AND COLUMN_NAME = 'codigo_empleado'
)
BEGIN
    ALTER TABLE empleados 
    ADD codigo_empleado VARCHAR(20) NULL;
    
    PRINT '✓ Columna codigo_empleado agregada correctamente';
END
ELSE
BEGIN
    PRINT '→ La columna codigo_empleado ya existe';
END
GO

-- Verificar la estructura de la tabla
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'empleados'
ORDER BY ORDINAL_POSITION;
GO
