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

// GET - Listar contratos
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.empresaId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const estado = searchParams.get('estado');

    let query = `
      SELECT 
        c.*,
        e.nombre,
        e.apellido,
        e.rut,
        e.departamento,
        e.cargo
      FROM contratos c
      JOIN empleados e ON c.empleado_id = e.id
      WHERE c.empresa_id = $1
    `;
    const params: (string | number)[] = [session.empresaId];

    if (estado && estado !== 'todos') {
      query += ` AND c.estado = $2`;
      params.push(estado);
    }

    query += ' ORDER BY c.fecha_inicio DESC';

    const result = await pool.query(query, params);

    return NextResponse.json({ contratos: result.rows });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

// POST - Crear contrato
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.empresaId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { empleado_id, tipo_contrato, fecha_inicio, fecha_termino, jornada, horas_semanales, sueldo_base } = body;

    const result = await pool.query(
      `INSERT INTO contratos (empresa_id, empleado_id, tipo_contrato, fecha_inicio, fecha_termino, jornada, horas_semanales, sueldo_base)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [session.empresaId, empleado_id, tipo_contrato, fecha_inicio, fecha_termino || null, jornada, horas_semanales || 45, sueldo_base]
    );

    return NextResponse.json({ contrato: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
