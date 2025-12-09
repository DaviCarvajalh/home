import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { cookies } from 'next/headers';

// GET - Obtener una liquidación
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);

    const result = await pool.query(
      `SELECT l.*, e.nombre, e.apellido, e.rut, e.cargo, e.departamento,
              e.fecha_ingreso, e.afp, e.salud
       FROM liquidaciones l
       JOIN empleados e ON l.empleado_id = e.id
       WHERE l.id = $1 AND l.empresa_id = $2`,
      [parseInt(id), session.empresaId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Liquidación no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ liquidacion: result.rows[0] });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Actualizar liquidación
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);
    const body = await request.json();

    // Verificar que la liquidación existe y pertenece a la empresa
    const existeResult = await pool.query(
      'SELECT id, estado FROM liquidaciones WHERE id = $1 AND empresa_id = $2',
      [parseInt(id), session.empresaId]
    );

    if (existeResult.rows.length === 0) {
      return NextResponse.json({ error: 'Liquidación no encontrada' }, { status: 404 });
    }

    const liquidacionActual = existeResult.rows[0];

    // Si solo se está cambiando el estado
    if (body.estado) {
      // Validar transiciones de estado
      const transicionesValidas: Record<string, string[]> = {
        borrador: ['emitida', 'anulada'],
        emitida: ['pagada', 'anulada'],
        pagada: [],
        anulada: [],
      };

      if (!transicionesValidas[liquidacionActual.estado]?.includes(body.estado)) {
        return NextResponse.json(
          { error: `No se puede cambiar de ${liquidacionActual.estado} a ${body.estado}` },
          { status: 400 }
        );
      }

      await pool.query(
        'UPDATE liquidaciones SET estado = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [body.estado, parseInt(id)]
      );

      return NextResponse.json({ success: true });
    }

    // Actualización completa de montos (solo en borrador)
    if (liquidacionActual.estado !== 'borrador') {
      return NextResponse.json(
        { error: 'Solo se pueden editar liquidaciones en borrador' },
        { status: 400 }
      );
    }

    const {
      sueldoBase, gratificacion, horasExtras, comisiones, bonos,
      asignacionColacion, asignacionMovilizacion, asignacionFamiliar, otrosHaberes,
      afpMonto, saludMonto, seguroCesantia, impuestoUnico,
      anticipos, prestamos, otrosDescuentos
    } = body;

    // Recalcular totales
    const totalHaberes = (sueldoBase || 0) + (gratificacion || 0) + (horasExtras || 0) +
      (comisiones || 0) + (bonos || 0) + (asignacionColacion || 0) +
      (asignacionMovilizacion || 0) + (asignacionFamiliar || 0) + (otrosHaberes || 0);

    const totalDescuentosLegales = (afpMonto || 0) + (saludMonto || 0) +
      (seguroCesantia || 0) + (impuestoUnico || 0);

    const totalOtrosDescuentos = (anticipos || 0) + (prestamos || 0) + (otrosDescuentos || 0);

    const totalDescuentos = totalDescuentosLegales + totalOtrosDescuentos;
    const sueldoLiquido = totalHaberes - totalDescuentos;

    await pool.query(
      `UPDATE liquidaciones SET
        sueldo_base = $1, gratificacion = $2, horas_extras = $3, comisiones = $4,
        bonos = $5, asignacion_colacion = $6, asignacion_movilizacion = $7,
        asignacion_familiar = $8, otros_haberes = $9, total_haberes = $10,
        afp_monto = $11, salud_monto = $12, seguro_cesantia = $13, impuesto_unico = $14,
        total_descuentos_legales = $15, anticipos = $16, prestamos = $17,
        otros_descuentos = $18, total_otros_descuentos = $19,
        total_descuentos = $20, sueldo_liquido = $21, updated_at = CURRENT_TIMESTAMP
      WHERE id = $22`,
      [
        sueldoBase, gratificacion, horasExtras, comisiones, bonos,
        asignacionColacion, asignacionMovilizacion, asignacionFamiliar, otrosHaberes,
        totalHaberes, afpMonto, saludMonto, seguroCesantia, impuestoUnico,
        totalDescuentosLegales, anticipos, prestamos, otrosDescuentos,
        totalOtrosDescuentos, totalDescuentos, sueldoLiquido, parseInt(id)
      ]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Eliminar liquidación
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);

    // Verificar que existe y está en borrador
    const existeResult = await pool.query(
      'SELECT estado FROM liquidaciones WHERE id = $1 AND empresa_id = $2',
      [parseInt(id), session.empresaId]
    );

    if (existeResult.rows.length === 0) {
      return NextResponse.json({ error: 'Liquidación no encontrada' }, { status: 404 });
    }

    if (existeResult.rows[0].estado !== 'borrador') {
      return NextResponse.json(
        { error: 'Solo se pueden eliminar liquidaciones en borrador' },
        { status: 400 }
      );
    }

    await pool.query('DELETE FROM liquidaciones WHERE id = $1', [parseInt(id)]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
