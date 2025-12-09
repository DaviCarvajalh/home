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

// GET - Listar vacaciones
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.empresaId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const estado = searchParams.get('estado');
    const empleadoId = searchParams.get('empleado_id');

    let query = `
      SELECT 
        v.*,
        e.nombre,
        e.apellido,
        e.rut,
        e.departamento,
        e.cargo
      FROM vacaciones v
      JOIN empleados e ON v.empleado_id = e.id
      WHERE v.empresa_id = $1
    `;
    const params: (string | number)[] = [session.empresaId];
    let paramIndex = 2;

    if (estado && estado !== 'todos') {
      query += ` AND v.estado = $${paramIndex}`;
      params.push(estado);
      paramIndex++;
    }

    if (empleadoId) {
      query += ` AND v.empleado_id = $${paramIndex}`;
      params.push(parseInt(empleadoId));
      paramIndex++;
    }

    query += ' ORDER BY v.fecha_inicio DESC';

    const result = await pool.query(query, params);

    return NextResponse.json({ vacaciones: result.rows });
  } catch (error) {
    console.error('Error al obtener vacaciones:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

// POST - Crear solicitud de vacaciones
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.empresaId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { empleado_id, fecha_inicio, fecha_fin, dias_solicitados, comentario } = body;

    if (!empleado_id || !fecha_inicio || !fecha_fin || !dias_solicitados) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO vacaciones (empresa_id, empleado_id, fecha_inicio, fecha_fin, dias_solicitados, comentario, estado)
       VALUES ($1, $2, $3, $4, $5, $6, 'pendiente')
       RETURNING *`,
      [session.empresaId, empleado_id, fecha_inicio, fecha_fin, dias_solicitados, comentario || null]
    );

    return NextResponse.json({ vacacion: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Error al crear vacación:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
