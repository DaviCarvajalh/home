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

// GET - Obtener un finiquito
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
      `SELECT f.*, e.nombre, e.apellido, e.rut, e.departamento, e.cargo, e.fecha_ingreso
       FROM finiquitos f
       JOIN empleados e ON f.empleado_id = e.id
       WHERE f.id = $1 AND f.empresa_id = $2`,
      [id, session.empresaId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Finiquito no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ finiquito: result.rows[0] });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

// PUT - Actualizar finiquito
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

    if (estado) {
      const result = await pool.query(
        `UPDATE finiquitos SET estado = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2 AND empresa_id = $3
         RETURNING *`,
        [estado, id, session.empresaId]
      );

      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Finiquito no encontrado' }, { status: 404 });
      }

      return NextResponse.json({ finiquito: result.rows[0] });
    }

    return NextResponse.json({ error: 'Datos no válidos' }, { status: 400 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

// DELETE - Eliminar finiquito
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

    // Solo permitir eliminar borradores
    const result = await pool.query(
      `DELETE FROM finiquitos WHERE id = $1 AND empresa_id = $2 AND estado = 'borrador' RETURNING *`,
      [id, session.empresaId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Finiquito no encontrado o no se puede eliminar' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Finiquito eliminado' });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
