import { NextResponse } from 'next/server';
import { query } from '@/lib/db-postgres';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    
    if (!sessionCookie) {
      return NextResponse.json({ codigo: '1000' });
    }

    const session = JSON.parse(sessionCookie.value);
    
    // Obtener el máximo código de empleado actual
    const result = await query(
      `SELECT COALESCE(MAX(CAST(codigo_empleado AS INTEGER)), 999) as max_codigo
       FROM empleados
       WHERE empresa_id = $1 AND codigo_empleado ~ '^[0-9]+$'`,
      [session.empresaId]
    );
    
    const maxCodigo = result.rows[0]?.max_codigo || 999;
    const nextCodigo = Math.max(maxCodigo + 1, 1000).toString();
    
    return NextResponse.json({ codigo: nextCodigo });
  } catch (error) {
    console.error('Error al obtener siguiente código:', error);
    // Si hay error, devolver 1000 como código inicial
    return NextResponse.json({ codigo: '1000' });
  }
}
