-- Ejecutar en SSMS para crear un usuario de prueba
USE ignisterra_db;
GO

INSERT INTO usuarios (email, password_hash, nombre, rol)
VALUES ('admin@ignisterra.cl', 'admin123', 'Administrador', 'admin');

SELECT * FROM usuarios;
