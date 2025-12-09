import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { pool } from '@/lib/db';

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

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.empresaId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const estado = searchParams.get('estado');

    let query = `
      SELECT f.*, e.nombre, e.apellido, e.rut, e.departamento, e.cargo
      FROM finiquitos f
      JOIN empleados e ON f.empleado_id = e.id
      WHERE f.empresa_id = $1
    `;
    const params: (string | number)[] = [session.empresaId];

    if (estado && estado !== 'todos') {
      query += ` AND f.estado = $2`;
      params.push(estado);
    }

    query += ' ORDER BY f.fecha_termino DESC';

    const result = await pool.query(query, params);
    return NextResponse.json({ finiquitos: result.rows });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.empresaId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      empleado_id, fecha_termino, causal,
      sueldo_proporcional, vacaciones_proporcionales, 
      indemnizacion_anos, indemnizacion_aviso, otros_haberes, descuentos 
    } = body;

    const total_haberes = (sueldo_proporcional || 0) + (vacaciones_proporcionales || 0) + 
                          (indemnizacion_anos || 0) + (indemnizacion_aviso || 0) + (otros_haberes || 0);
    const total_liquido = total_haberes - (descuentos || 0);

    const result = await pool.query(
      `INSERT INTO finiquitos (empresa_id, empleado_id, fecha_termino, causal, 
        sueldo_proporcional, vacaciones_proporcionales, indemnizacion_anos, 
        indemnizacion_aviso, otros_haberes, total_haberes, descuentos, total_liquido)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [session.empresaId, empleado_id, fecha_termino, causal,
       sueldo_proporcional || 0, vacaciones_proporcionales || 0, indemnizacion_anos || 0,
       indemnizacion_aviso || 0, otros_haberes || 0, total_haberes, descuentos || 0, total_liquido]
    );

    return NextResponse.json({ finiquito: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
