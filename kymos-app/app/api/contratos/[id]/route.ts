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

// GET - Obtener un contrato
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
      `SELECT c.*, e.nombre, e.apellido, e.rut, e.departamento, e.cargo
       FROM contratos c
       JOIN empleados e ON c.empleado_id = e.id
       WHERE c.id = $1 AND c.empresa_id = $2`,
      [id, session.empresaId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Contrato no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ contrato: result.rows[0] });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

// PUT - Actualizar contrato
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
    const { tipo_contrato, fecha_termino, jornada, horas_semanales, sueldo_base, estado, motivo_termino } = body;

    const result = await pool.query(
      `UPDATE contratos SET 
        tipo_contrato = COALESCE($1, tipo_contrato),
        fecha_termino = COALESCE($2, fecha_termino),
        jornada = COALESCE($3, jornada),
        horas_semanales = COALESCE($4, horas_semanales),
        sueldo_base = COALESCE($5, sueldo_base),
        estado = COALESCE($6, estado),
        motivo_termino = COALESCE($7, motivo_termino),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $8 AND empresa_id = $9
       RETURNING *`,
      [tipo_contrato, fecha_termino, jornada, horas_semanales, sueldo_base, estado, motivo_termino, id, session.empresaId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Contrato no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ contrato: result.rows[0] });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

// DELETE - Eliminar contrato
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
      `DELETE FROM contratos WHERE id = $1 AND empresa_id = $2 RETURNING *`,
      [id, session.empresaId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Contrato no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Contrato eliminado' });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
