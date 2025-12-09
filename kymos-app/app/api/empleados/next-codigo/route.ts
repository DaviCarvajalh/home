import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { cookies } from 'next/headers';

async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');
  if (!sessionCookie) return null;
  try {
    return JSON.parse(sessionCookie.value);
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.empresaId) {
      return NextResponse.json({ codigo: '1000' });
    }

    // Obtener el máximo código de empleado actual
    const result = await pool.query(`
      SELECT COALESCE(MAX(CAST(codigo_empleado AS INTEGER)), 999) as max_codigo
      FROM empleados
      WHERE empresa_id = $1 AND codigo_empleado ~ '^[0-9]+$'
    `, [session.empresaId]);
    
    const maxCodigo = result.rows[0]?.max_codigo || 999;
    const nextCodigo = Math.max(maxCodigo + 1, 1000).toString();
    
    return NextResponse.json({ codigo: nextCodigo });
  } catch (error) {
    console.error('Error al obtener siguiente código:', error);
    return NextResponse.json({ codigo: '1000' });
  }
}
