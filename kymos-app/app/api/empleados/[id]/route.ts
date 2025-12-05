import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db-postgres';
import { cookies } from 'next/headers';

// GET - Obtener un empleado por ID
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
    
    const result = await query(
      'SELECT * FROM empleados WHERE id = $1 AND empresa_id = $2',
      [parseInt(id), session.empresaId]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Empleado no encontrado' }, { status: 404 });
    }
    
    return NextResponse.json({ empleado: result.rows[0] });
  } catch (error: any) {
    console.error('Error al obtener empleado:', error);
    return NextResponse.json(
      { error: `Error al obtener el empleado: ${error.message}` },
      { status: 500 }
    );
  }
}

// PUT - Actualizar un empleado
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
    
    // Extraer todos los campos del formulario
    const {
      // Personal
      codigoEmpleado, rut, nombres, apellidos, nacionalidad, fechaNacimiento,
      sexo, estadoCivil, cantidadHijos, direccion, comuna, ciudad, telefono, email,
      contactoEmergenciaNombre, contactoEmergenciaTelefono, contactoEmergenciaRelacion,
      // Laboral
      fechaIngreso, fechaTermino, tipoContrato, jornada, horario, modalidad,
      departamento, subdepartamento, cargo, centroCosto, supervisor,
      // Renta
      sueldoBase, tipoSueldo, asignacionColacion, asignacionMovilizacion,
      asignacionZona, asignacionResponsabilidad, bonos, formaPago, banco, tipoCuenta, numeroCuenta,
      // Previsión
      afp, salud, planIsapre, tramoAsignacionFamiliar,
      // Asistencia
      turno, horarioAsistencia, calendario,
      // Estado
      activo,
    } = body;

    await query(
      `UPDATE empleados SET
        codigo_empleado = $1, rut = $2, nombre = $3, apellido = $4,
        nacionalidad = $5, fecha_nacimiento = $6, sexo = $7,
        estado_civil = $8, cantidad_hijos = $9, direccion = $10,
        comuna = $11, ciudad = $12, telefono = $13, email = $14,
        contacto_emergencia_nombre = $15, contacto_emergencia_telefono = $16,
        contacto_emergencia_relacion = $17,
        fecha_ingreso = $18, fecha_termino = $19, tipo_contrato = $20,
        jornada = $21, horario = $22, modalidad = $23, departamento = $24,
        subdepartamento = $25, cargo = $26, centro_costo = $27, supervisor = $28,
        salario = $29, tipo_sueldo = $30, asignacion_colacion = $31,
        asignacion_movilizacion = $32, asignacion_zona = $33,
        asignacion_responsabilidad = $34, bonos = $35, forma_pago = $36,
        banco = $37, tipo_cuenta = $38, numero_cuenta = $39,
        afp = $40, salud = $41, plan_isapre = $42, tramo_asignacion_familiar = $43,
        turno = $44, horario_asistencia = $45, calendario = $46,
        activo = $47
      WHERE id = $48 AND empresa_id = $49`,
      [
        codigoEmpleado || null,
        rut,
        nombres,
        apellidos,
        nacionalidad || null,
        fechaNacimiento || null,
        sexo || null,
        estadoCivil || null,
        parseInt(cantidadHijos) || 0,
        direccion || null,
        comuna || null,
        ciudad || null,
        telefono || null,
        email || null,
        contactoEmergenciaNombre || null,
        contactoEmergenciaTelefono || null,
        contactoEmergenciaRelacion || null,
        fechaIngreso,
        fechaTermino || null,
        tipoContrato || null,
        jornada || null,
        horario || null,
        modalidad || null,
        departamento || null,
        subdepartamento || null,
        cargo || null,
        centroCosto || null,
        supervisor || null,
        sueldoBase ? parseFloat(sueldoBase) : null,
        tipoSueldo || null,
        asignacionColacion ? parseFloat(asignacionColacion) : null,
        asignacionMovilizacion ? parseFloat(asignacionMovilizacion) : null,
        asignacionZona ? parseFloat(asignacionZona) : null,
        asignacionResponsabilidad ? parseFloat(asignacionResponsabilidad) : null,
        bonos ? parseFloat(bonos) : null,
        formaPago || null,
        banco || null,
        tipoCuenta || null,
        numeroCuenta || null,
        afp || null,
        salud || null,
        planIsapre || null,
        tramoAsignacionFamiliar || null,
        turno || null,
        horarioAsistencia || null,
        calendario || null,
        activo !== undefined ? activo : true,
        parseInt(id),
        session.empresaId,
      ]
    );
    
    return NextResponse.json({
      success: true,
      message: 'Empleado actualizado exitosamente'
    });
  } catch (error: any) {
    console.error('Error al actualizar empleado:', error);
    return NextResponse.json(
      { error: `Error al actualizar el empleado: ${error.message}` },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar un empleado (soft delete)
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
    
    // Soft delete - desactivar empleado
    await query(
      'UPDATE empleados SET activo = false WHERE id = $1 AND empresa_id = $2',
      [parseInt(id), session.empresaId]
    );
    
    return NextResponse.json({
      success: true,
      message: 'Empleado eliminado exitosamente'
    });
  } catch (error: any) {
    console.error('Error al eliminar empleado:', error);
    return NextResponse.json(
      { error: `Error al eliminar el empleado: ${error.message}` },
      { status: 500 }
    );
  }
}
