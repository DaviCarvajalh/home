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

// GET - Obtener una ausencia
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
      `SELECT a.*, e.nombre, e.apellido, e.rut, e.departamento
       FROM ausencias a
       JOIN empleados e ON a.empleado_id = e.id
       WHERE a.id = $1 AND a.empresa_id = $2`,
      [id, session.empresaId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Ausencia no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ ausencia: result.rows[0] });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

// PUT - Actualizar estado de ausencia (aprobar/rechazar)
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
    const { estado } = body;

    if (!estado) {
      return NextResponse.json({ error: 'Estado requerido' }, { status: 400 });
    }

    const result = await pool.query(
      `UPDATE ausencias 
       SET estado = $1, aprobado_por = $2
       WHERE id = $3 AND empresa_id = $4
       RETURNING *`,
      [estado, session.userId, id, session.empresaId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Ausencia no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ ausencia: result.rows[0] });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

// DELETE - Eliminar ausencia
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
      `DELETE FROM ausencias WHERE id = $1 AND empresa_id = $2 RETURNING *`,
      [id, session.empresaId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Ausencia no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Ausencia eliminada' });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
