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

// PUT - Cambiar estado del período (abrir/cerrar)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session?.empresaId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { estado } = body;

    if (!['abierto', 'cerrado'].includes(estado)) {
      return NextResponse.json({ error: 'Estado inválido' }, { status: 400 });
    }

    const fechaCampo = estado === 'cerrado' ? 'fecha_cierre' : 'fecha_apertura';
    
    const result = await pool.query(
      `UPDATE periodos SET estado = $1, ${fechaCampo} = NOW()
       WHERE id = $2 AND empresa_id = $3
       RETURNING *`,
      [estado, id, session.empresaId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Período no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ periodo: result.rows[0] });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

// DELETE - Eliminar período
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session?.empresaId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Verificar que no tenga liquidaciones asociadas
    const liquidaciones = await pool.query(
      `SELECT COUNT(*) as count FROM liquidaciones l
       JOIN periodos p ON l.periodo_mes = p.mes AND l.periodo_anio = p.anio
       WHERE p.id = $1 AND l.empresa_id = $2`,
      [id, session.empresaId]
    );

    if (parseInt(liquidaciones.rows[0].count) > 0) {
      return NextResponse.json(
        { error: 'No se puede eliminar un período con liquidaciones' },
        { status: 400 }
      );
    }

    await pool.query(
      'DELETE FROM periodos WHERE id = $1 AND empresa_id = $2',
      [id, session.empresaId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
