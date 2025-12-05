import { Pool, QueryResult } from 'pg';

// Configuración de conexión
const connectionString = process.env.DATABASE_URL || '';

// Pool de conexiones
let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }
  return pool;
}

// Función helper para queries
export async function query<T = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
  const pool = getPool();
  const start = Date.now();
  const result = await pool.query<T>(text, params);
  const duration = Date.now() - start;
  
  if (process.env.NODE_ENV === 'development') {
    console.log('Query ejecutada:', { text: text.substring(0, 100), duration, rows: result.rowCount });
  }
  
  return result;
}

// Función para obtener un cliente (para transacciones)
export async function getClient() {
  const pool = getPool();
  const client = await pool.connect();
  return client;
}

// Función para transacciones
export async function transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// Helper para obtener empresa por ID o schema
export async function getEmpresaId(identifier: string | number): Promise<number | null> {
  const result = await query(
    'SELECT id FROM empresas WHERE id = $1 OR db_schema = $1 OR rut = $1',
    [identifier]
  );
  return result.rows[0]?.id || null;
}

// Cerrar pool (para cleanup)
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

export default { query, getClient, transaction, getEmpresaId, closePool };
