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

// GET - Obtener un préstamo
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
      `SELECT p.*, e.nombre, e.apellido, e.rut, e.departamento
       FROM prestamos p
       JOIN empleados e ON p.empleado_id = e.id
       WHERE p.id = $1 AND p.empresa_id = $2`,
      [id, session.empresaId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Préstamo no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ prestamo: result.rows[0] });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

// PUT - Actualizar préstamo (pagar cuota, cancelar)
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
    const { accion } = body;

    if (accion === 'pagar_cuota') {
      // Obtener préstamo actual
      const prestamoResult = await pool.query(
        'SELECT * FROM prestamos WHERE id = $1 AND empresa_id = $2',
        [id, session.empresaId]
      );

      if (prestamoResult.rows.length === 0) {
        return NextResponse.json({ error: 'Préstamo no encontrado' }, { status: 404 });
      }

      const prestamo = prestamoResult.rows[0];
      const nuevasCuotasPagadas = prestamo.cuotas_pagadas + 1;
      const nuevoSaldo = prestamo.saldo_pendiente - prestamo.monto_cuota;
      const nuevoEstado = nuevasCuotasPagadas >= prestamo.cuotas_totales ? 'pagado' : 'activo';

      const result = await pool.query(
        `UPDATE prestamos 
         SET cuotas_pagadas = $1, saldo_pendiente = $2, estado = $3, updated_at = CURRENT_TIMESTAMP
         WHERE id = $4
         RETURNING *`,
        [nuevasCuotasPagadas, Math.max(0, nuevoSaldo), nuevoEstado, id]
      );

      return NextResponse.json({ prestamo: result.rows[0] });
    }

    if (accion === 'cancelar') {
      const result = await pool.query(
        `UPDATE prestamos SET estado = 'cancelado', updated_at = CURRENT_TIMESTAMP
         WHERE id = $1 AND empresa_id = $2
         RETURNING *`,
        [id, session.empresaId]
      );

      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Préstamo no encontrado' }, { status: 404 });
      }

      return NextResponse.json({ prestamo: result.rows[0] });
    }

    return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

// DELETE - Eliminar préstamo
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
      `DELETE FROM prestamos WHERE id = $1 AND empresa_id = $2 RETURNING *`,
      [id, session.empresaId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Préstamo no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Préstamo eliminado' });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
