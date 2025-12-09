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

// GET - Obtener una vacación
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.empresaId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;

    const result = await pool.query(
      `SELECT v.*, e.nombre, e.apellido, e.rut, e.departamento, e.cargo
       FROM vacaciones v
       JOIN empleados e ON v.empleado_id = e.id
       WHERE v.id = $1 AND v.empresa_id = $2`,
      [id, session.empresaId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Vacación no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ vacacion: result.rows[0] });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

// PUT - Actualizar estado de vacación (aprobar/rechazar)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.empresaId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { estado, comentario } = body;

    if (!estado) {
      return NextResponse.json({ error: 'Estado requerido' }, { status: 400 });
    }

    const result = await pool.query(
      `UPDATE vacaciones 
       SET estado = $1, comentario = COALESCE($2, comentario), aprobado_por = $3
       WHERE id = $4 AND empresa_id = $5
       RETURNING *`,
      [estado, comentario, session.userId, id, session.empresaId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Vacación no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ vacacion: result.rows[0] });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

// DELETE - Eliminar solicitud de vacación
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.empresaId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;

    const result = await pool.query(
      `DELETE FROM vacaciones WHERE id = $1 AND empresa_id = $2 RETURNING *`,
      [id, session.empresaId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Vacación no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Vacación eliminada' });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
