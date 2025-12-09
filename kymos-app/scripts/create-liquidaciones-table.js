const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:admin123@localhost:5432/kymos'
});

async function createTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS liquidaciones (
        id SERIAL PRIMARY KEY,
        empresa_id INTEGER,
        empleado_id INTEGER,
        periodo_mes INTEGER NOT NULL,
        periodo_anio INTEGER NOT NULL,
        fecha_emision DATE DEFAULT CURRENT_DATE,
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
        afp_monto DECIMAL(12,2) DEFAULT 0,
        afp_porcentaje DECIMAL(5,2) DEFAULT 0,
        salud_monto DECIMAL(12,2) DEFAULT 0,
        salud_porcentaje DECIMAL(5,2) DEFAULT 0,
        seguro_cesantia DECIMAL(12,2) DEFAULT 0,
        impuesto_unico DECIMAL(12,2) DEFAULT 0,
        total_descuentos_legales DECIMAL(12,2) DEFAULT 0,
        anticipos DECIMAL(12,2) DEFAULT 0,
        prestamos DECIMAL(12,2) DEFAULT 0,
        otros_descuentos DECIMAL(12,2) DEFAULT 0,
        total_otros_descuentos DECIMAL(12,2) DEFAULT 0,
        total_descuentos DECIMAL(12,2) DEFAULT 0,
        sueldo_liquido DECIMAL(12,2) DEFAULT 0,
        estado VARCHAR(20) DEFAULT 'borrador',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(empleado_id, periodo_mes, periodo_anio)
      )
    `);
    console.log('✅ Tabla liquidaciones creada correctamente');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

createTable();
