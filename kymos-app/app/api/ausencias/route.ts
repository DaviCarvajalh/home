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
    const tipo = searchParams.get('tipo');

    let query = `
      SELECT a.*, e.nombre, e.apellido, e.rut, e.departamento
      FROM ausencias a
      JOIN empleados e ON a.empleado_id = e.id
      WHERE a.empresa_id = $1
    `;
    const params: (string | number)[] = [session.empresaId];

    if (tipo && tipo !== 'todos') {
      query += ` AND a.tipo = $2`;
      params.push(tipo);
    }

    query += ' ORDER BY a.fecha_inicio DESC';

    const result = await pool.query(query, params);
    return NextResponse.json({ ausencias: result.rows });
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
    const { empleado_id, tipo, fecha_inicio, fecha_fin, dias, motivo } = body;

    const result = await pool.query(
      `INSERT INTO ausencias (empresa_id, empleado_id, tipo, fecha_inicio, fecha_fin, dias, motivo)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [session.empresaId, empleado_id, tipo, fecha_inicio, fecha_fin, dias, motivo]
    );

    return NextResponse.json({ ausencia: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
