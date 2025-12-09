import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { cookies } from 'next/headers';

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

// GET - Listar empleados
export async function GET() {
  try {
    const session = await getSession();
    if (!session?.empresaId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const result = await pool.query(
      `SELECT * FROM empleados WHERE empresa_id = $1 AND activo = true ORDER BY apellido, nombre`,
      [session.empresaId]
    );
    
    return NextResponse.json({ empleados: result.rows });
  } catch (error) {
    console.error('Error al obtener empleados:', error);
    return NextResponse.json(
      { error: 'Error al obtener empleados' },
      { status: 500 }
    );
  }
}

// POST - Crear empleado
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.empresaId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    
    const {
      codigoEmpleado, rut, nombres, apellidos, nacionalidad, fechaNacimiento,
      sexo, estadoCivil, cantidadHijos, direccion, comuna, ciudad, telefono, email,
      contactoEmergenciaNombre, contactoEmergenciaTelefono, contactoEmergenciaRelacion,
      fechaIngreso, fechaTermino, tipoContrato, jornada, horario, modalidad,
      departamento, subdepartamento, cargo, centroCosto, supervisor,
      sueldoBase, tipoSueldo, asignacionColacion, asignacionMovilizacion,
      asignacionZona, asignacionResponsabilidad, bonos, formaPago, banco, tipoCuenta, numeroCuenta,
      afp, salud, planIsapre, tramoAsignacionFamiliar,
      turno, horarioAsistencia, calendario,
    } = body;

    if (!rut || !nombres || !apellidos || !fechaIngreso) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios: RUT, Nombres, Apellidos y Fecha de Ingreso son requeridos' },
        { status: 400 }
      );
    }

    // Verificar si el RUT ya existe
    const existingRut = await pool.query(
      'SELECT id FROM empleados WHERE empresa_id = $1 AND rut = $2',
      [session.empresaId, rut]
    );
    
    if (existingRut.rows.length > 0) {
      return NextResponse.json(
        { error: 'Ya existe un trabajador con este RUT' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO empleados (
        empresa_id, codigo_empleado, rut, nombre, apellido, nacionalidad, fecha_nacimiento,
        sexo, estado_civil, cantidad_hijos, direccion, comuna, ciudad, telefono, email,
        contacto_emergencia_nombre, contacto_emergencia_telefono, contacto_emergencia_relacion,
        fecha_ingreso, fecha_termino, tipo_contrato, jornada, horario, modalidad,
        departamento, subdepartamento, cargo, centro_costo, supervisor,
        salario, tipo_sueldo, asignacion_colacion, asignacion_movilizacion,
        asignacion_zona, asignacion_responsabilidad, bonos, forma_pago, banco, tipo_cuenta, numero_cuenta,
        afp, salud, plan_isapre, tramo_asignacion_familiar,
        turno, horario_asistencia, calendario
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18,
        $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40,
        $41, $42, $43, $44, $45, $46, $47
      ) RETURNING id`,
      [
        session.empresaId, codigoEmpleado || null, rut, nombres, apellidos, nacionalidad || null, fechaNacimiento || null,
        sexo || null, estadoCivil || null, parseInt(cantidadHijos) || 0, direccion || null, comuna || null, ciudad || null, telefono || null, email || null,
        contactoEmergenciaNombre || null, contactoEmergenciaTelefono || null, contactoEmergenciaRelacion || null,
        fechaIngreso, fechaTermino || null, tipoContrato || null, jornada || null, horario || null, modalidad || null,
        departamento || null, subdepartamento || null, cargo || null, centroCosto || null, supervisor || null,
        sueldoBase ? parseFloat(sueldoBase) : null, tipoSueldo || null, asignacionColacion ? parseFloat(asignacionColacion) : null, asignacionMovilizacion ? parseFloat(asignacionMovilizacion) : null,
        asignacionZona ? parseFloat(asignacionZona) : null, asignacionResponsabilidad ? parseFloat(asignacionResponsabilidad) : null, bonos ? parseFloat(bonos) : null, formaPago || null, banco || null, tipoCuenta || null, numeroCuenta || null,
        afp || null, salud || null, planIsapre || null, tramoAsignacionFamiliar || null,
        turno || null, horarioAsistencia || null, calendario || null
      ]
    );
    
    return NextResponse.json({
      success: true,
      id: result.rows[0].id,
      message: 'Trabajador creado exitosamente'
    });
  } catch (error: unknown) {
    console.error('Error al crear empleado:', error);
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json(
      { error: `Error al crear el trabajador: ${message}` },
      { status: 500 }
    );
  }
}
