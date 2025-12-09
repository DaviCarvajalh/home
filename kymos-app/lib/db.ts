import { Pool } from 'pg';

// Conexión a PostgreSQL
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:admin123@localhost:5432/kymos';

export const pool = new Pool({
  connectionString,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Función helper para queries
export async function query(text: string, params?: unknown[]) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('Query ejecutada', { text: text.substring(0, 50), duration, rows: res.rowCount });
  return res;
}

// Función para obtener un cliente del pool (para transacciones)
export async function getClient() {
  const client = await pool.connect();
  return client;
}
