import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);
    const body = await request.json();
    const { mes, anio } = body;

    if (!mes || !anio) {
      return NextResponse.json({ error: 'Mes y año son requeridos' }, { status: 400 });
    }

    // Obtener todos los empleados activos
    const empleadosResult = await pool.query(
      'SELECT * FROM empleados WHERE empresa_id = $1 AND activo = true',
      [session.empresaId]
    );

    const empleados = empleadosResult.rows;
    let generadas = 0;
    let omitidas = 0;
    const errores: string[] = [];

    for (const empleado of empleados) {
      try {
        // Verificar si ya existe
        const existeResult = await pool.query(
          'SELECT id FROM liquidaciones WHERE empleado_id = $1 AND periodo_mes = $2 AND periodo_anio = $3',
          [empleado.id, mes, anio]
        );

        if (existeResult.rows.length > 0) {
          omitidas++;
          continue;
        }

        // Calcular liquidación
        const sueldoBase = parseFloat(empleado.salario) || 0;
        const asignacionColacion = parseFloat(empleado.asignacion_colacion) || 0;
        const asignacionMovilizacion = parseFloat(empleado.asignacion_movilizacion) || 0;
        
        const gratificacion = Math.min(sueldoBase * 0.25, 500000 * 4.75 / 12);
        const totalImponible = sueldoBase + gratificacion;
        
        const afpPorcentaje = 11.5;
        const saludPorcentaje = 7;
        const seguroCesantia = 0.6;
        
        const afpMonto = totalImponible * (afpPorcentaje / 100);
        const saludMonto = totalImponible * (saludPorcentaje / 100);
        const cesantiaMonto = totalImponible * (seguroCesantia / 100);
        
        const totalHaberes = sueldoBase + gratificacion + asignacionColacion + asignacionMovilizacion;
        const totalDescuentosLegales = afpMonto + saludMonto + cesantiaMonto;
        
        const rentaTributable = totalImponible - afpMonto - saludMonto;
        const impuestoUnico = rentaTributable > 800000 ? (rentaTributable - 800000) * 0.04 : 0;
        
        const totalDescuentos = totalDescuentosLegales + impuestoUnico;
        const sueldoLiquido = totalHaberes - totalDescuentos;

        await pool.query(
          `INSERT INTO liquidaciones (
            empresa_id, empleado_id, periodo_mes, periodo_anio,
            sueldo_base, gratificacion, asignacion_colacion, asignacion_movilizacion,
            total_haberes, afp_monto, afp_porcentaje, salud_monto, salud_porcentaje,
            seguro_cesantia, impuesto_unico, total_descuentos_legales,
            total_descuentos, sueldo_liquido, estado
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, 'borrador'
          )`,
          [
            session.empresaId, empleado.id, mes, anio,
            sueldoBase, gratificacion, asignacionColacion, asignacionMovilizacion,
            totalHaberes, afpMonto, afpPorcentaje, saludMonto, saludPorcentaje,
            cesantiaMonto, impuestoUnico, totalDescuentosLegales,
            totalDescuentos, sueldoLiquido
          ]
        );

        generadas++;
      } catch (err: any) {
        errores.push(`${empleado.nombre} ${empleado.apellido}: ${err.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      resumen: {
        generadas,
        omitidas,
        errores: errores.length,
      },
      errores: errores.slice(0, 10),
    });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
