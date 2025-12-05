import { NextResponse } from 'next/server';
import { getCompanyConnection } from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    
    if (!sessionCookie) {
      return NextResponse.json({ codigo: '1000' });
    }

    const session = JSON.parse(sessionCookie.value);
    const pool = await getCompanyConnection(session.dbName);
    
    // Obtener el máximo código de empleado actual
    const result = await pool.request().query(`
      SELECT ISNULL(MAX(CAST(codigo_empleado AS INT)), 999) as max_codigo
      FROM empleados
      WHERE ISNUMERIC(codigo_empleado) = 1
    `);
    
    await pool.close();
    
    const maxCodigo = result.recordset[0]?.max_codigo || 999;
    const nextCodigo = Math.max(maxCodigo + 1, 1000).toString();
    
    return NextResponse.json({ codigo: nextCodigo });
  } catch (error) {
    console.error('Error al obtener siguiente código:', error);
    // Si hay error, devolver 1000 como código inicial
    return NextResponse.json({ codigo: '1000' });
  }
}
