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
      SELECT p.*, e.nombre, e.apellido, e.rut, e.departamento
      FROM prestamos p
      JOIN empleados e ON p.empleado_id = e.id
      WHERE p.empresa_id = $1
    `;
    const params: (string | number)[] = [session.empresaId];

    if (estado && estado !== 'todos') {
      query += ` AND p.estado = $2`;
      params.push(estado);
    }

    query += ' ORDER BY p.created_at DESC';

    const result = await pool.query(query, params);
    return NextResponse.json({ prestamos: result.rows });
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
    const { empleado_id, monto_total, cuotas_totales, fecha_inicio, motivo } = body;

    const monto_cuota = Math.ceil(monto_total / cuotas_totales);

    const result = await pool.query(
      `INSERT INTO prestamos (empresa_id, empleado_id, monto_total, cuotas_totales, monto_cuota, saldo_pendiente, fecha_inicio, motivo)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [session.empresaId, empleado_id, monto_total, cuotas_totales, monto_cuota, monto_total, fecha_inicio, motivo]
    );

    return NextResponse.json({ prestamo: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
