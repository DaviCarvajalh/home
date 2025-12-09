import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { cookies } from 'next/headers';

// GET - Listar liquidaciones
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);
    const { searchParams } = new URL(request.url);
    const mes = searchParams.get('mes');
    const anio = searchParams.get('anio');
    const empleadoId = searchParams.get('empleado_id');
    
    let queryText = `
      SELECT l.*, e.nombre, e.apellido, e.rut, e.cargo, e.departamento
      FROM liquidaciones l
      JOIN empleados e ON l.empleado_id = e.id
      WHERE l.empresa_id = $1
    `;
    const params: any[] = [session.empresaId];
    let paramIndex = 2;

    if (mes) {
      queryText += ` AND l.periodo_mes = $${paramIndex}`;
      params.push(parseInt(mes));
      paramIndex++;
    }

    if (anio) {
      queryText += ` AND l.periodo_anio = $${paramIndex}`;
      params.push(parseInt(anio));
      paramIndex++;
    }

    if (empleadoId) {
      queryText += ` AND l.empleado_id = $${paramIndex}`;
      params.push(parseInt(empleadoId));
      paramIndex++;
    }

    queryText += ' ORDER BY l.periodo_anio DESC, l.periodo_mes DESC, e.apellido, e.nombre';

    const result = await pool.query(queryText, params);
    
    return NextResponse.json({ liquidaciones: result.rows });
  } catch (error: any) {
    console.error('Error al obtener liquidaciones:', error);
    return NextResponse.json(
      { error: `Error al obtener liquidaciones: ${error.message}` },
      { status: 500 }
    );
  }
}

// POST - Generar liquidación
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);
    const body = await request.json();
    const { empleadoId, mes, anio } = body;

    if (!empleadoId || !mes || !anio) {
      return NextResponse.json(
        { error: 'Empleado, mes y año son requeridos' },
        { status: 400 }
      );
    }

    // Obtener datos del empleado
    const empResult = await pool.query(
      'SELECT * FROM empleados WHERE id = $1 AND empresa_id = $2',
      [empleadoId, session.empresaId]
    );

    if (empResult.rows.length === 0) {
      return NextResponse.json({ error: 'Empleado no encontrado' }, { status: 404 });
    }

    const empleado = empResult.rows[0];

    // Verificar si ya existe liquidación para este período
    const existeResult = await pool.query(
      'SELECT id FROM liquidaciones WHERE empleado_id = $1 AND periodo_mes = $2 AND periodo_anio = $3',
      [empleadoId, mes, anio]
    );

    if (existeResult.rows.length > 0) {
      return NextResponse.json(
        { error: 'Ya existe una liquidación para este período' },
        { status: 400 }
      );
    }

    // Calcular liquidación
    const sueldoBase = parseFloat(empleado.salario) || 0;
    const asignacionColacion = parseFloat(empleado.asignacion_colacion) || 0;
    const asignacionMovilizacion = parseFloat(empleado.asignacion_movilizacion) || 0;
    
    // Gratificación legal (25% del sueldo, tope 4.75 IMM)
    const gratificacion = Math.min(sueldoBase * 0.25, 500000 * 4.75 / 12);
    
    // Total imponible
    const totalImponible = sueldoBase + gratificacion;
    
    // Descuentos previsionales (aproximados)
    const afpPorcentaje = 11.5; // Promedio AFP
    const saludPorcentaje = 7;
    const seguroCesantia = 0.6;
    
    const afpMonto = totalImponible * (afpPorcentaje / 100);
    const saludMonto = totalImponible * (saludPorcentaje / 100);
    const cesantiaMonto = totalImponible * (seguroCesantia / 100);
    
    // Total haberes
    const totalHaberes = sueldoBase + gratificacion + asignacionColacion + asignacionMovilizacion;
    
    // Total descuentos legales
    const totalDescuentosLegales = afpMonto + saludMonto + cesantiaMonto;
    
    // Impuesto único (simplificado - 0 si está bajo el tramo exento)
    const rentaTributable = totalImponible - afpMonto - saludMonto;
    const impuestoUnico = rentaTributable > 800000 ? (rentaTributable - 800000) * 0.04 : 0;
    
    // Total descuentos
    const totalDescuentos = totalDescuentosLegales + impuestoUnico;
    
    // Sueldo líquido
    const sueldoLiquido = totalHaberes - totalDescuentos;

    // Insertar liquidación
    const result = await pool.query(
      `INSERT INTO liquidaciones (
        empresa_id, empleado_id, periodo_mes, periodo_anio,
        sueldo_base, gratificacion, asignacion_colacion, asignacion_movilizacion,
        total_haberes, afp_monto, afp_porcentaje, salud_monto, salud_porcentaje,
        seguro_cesantia, impuesto_unico, total_descuentos_legales,
        total_descuentos, sueldo_liquido, estado
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, 'borrador'
      ) RETURNING id`,
      [
        session.empresaId, empleadoId, mes, anio,
        sueldoBase, gratificacion, asignacionColacion, asignacionMovilizacion,
        totalHaberes, afpMonto, afpPorcentaje, saludMonto, saludPorcentaje,
        cesantiaMonto, impuestoUnico, totalDescuentosLegales,
        totalDescuentos, sueldoLiquido
      ]
    );

    return NextResponse.json({
      success: true,
      id: result.rows[0].id,
      resumen: {
        totalHaberes,
        totalDescuentos,
        sueldoLiquido
      }
    });
  } catch (error: any) {
    console.error('Error al generar liquidación:', error);
    return NextResponse.json(
      { error: `Error al generar liquidación: ${error.message}` },
      { status: 500 }
    );
  }
}
