import { NextRequest, NextResponse } from 'next/server';
import { getCompanyConnection, sql } from '@/lib/db';
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
    const pool = await getCompanyConnection(session.dbName);
    
    const result = await pool.request()
      .input('id', sql.Int, parseInt(id))
      .query(`
        SELECT * FROM empleados WHERE id = @id
      `);
    
    await pool.close();
    
    if (result.recordset.length === 0) {
      return NextResponse.json({ error: 'Empleado no encontrado' }, { status: 404 });
    }
    
    return NextResponse.json({ empleado: result.recordset[0] });
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

    const pool = await getCompanyConnection(session.dbName);
    
    await pool.request()
      .input('id', sql.Int, parseInt(id))
      // Personal
      .input('codigo_empleado', sql.VarChar, codigoEmpleado || null)
      .input('rut', sql.VarChar, rut)
      .input('nombre', sql.VarChar, nombres)
      .input('apellido', sql.VarChar, apellidos)
      .input('nacionalidad', sql.VarChar, nacionalidad || null)
      .input('fecha_nacimiento', sql.Date, fechaNacimiento || null)
      .input('sexo', sql.Char(1), sexo || null)
      .input('estado_civil', sql.VarChar, estadoCivil || null)
      .input('cantidad_hijos', sql.Int, parseInt(cantidadHijos) || 0)
      .input('direccion', sql.VarChar, direccion || null)
      .input('comuna', sql.VarChar, comuna || null)
      .input('ciudad', sql.VarChar, ciudad || null)
      .input('telefono', sql.VarChar, telefono || null)
      .input('email', sql.VarChar, email || null)
      .input('contacto_emergencia_nombre', sql.VarChar, contactoEmergenciaNombre || null)
      .input('contacto_emergencia_telefono', sql.VarChar, contactoEmergenciaTelefono || null)
      .input('contacto_emergencia_relacion', sql.VarChar, contactoEmergenciaRelacion || null)
      // Laboral
      .input('fecha_ingreso', sql.Date, fechaIngreso)
      .input('fecha_termino', sql.Date, fechaTermino || null)
      .input('tipo_contrato', sql.VarChar, tipoContrato || null)
      .input('jornada', sql.VarChar, jornada || null)
      .input('horario', sql.VarChar, horario || null)
      .input('modalidad', sql.VarChar, modalidad || null)
      .input('departamento', sql.VarChar, departamento || null)
      .input('subdepartamento', sql.VarChar, subdepartamento || null)
      .input('cargo', sql.VarChar, cargo || null)
      .input('centro_costo', sql.VarChar, centroCosto || null)
      .input('supervisor', sql.VarChar, supervisor || null)
      // Renta
      .input('salario', sql.Decimal(12, 2), sueldoBase ? parseFloat(sueldoBase) : null)
      .input('tipo_sueldo', sql.VarChar, tipoSueldo || null)
      .input('asignacion_colacion', sql.Decimal(12, 2), asignacionColacion ? parseFloat(asignacionColacion) : null)
      .input('asignacion_movilizacion', sql.Decimal(12, 2), asignacionMovilizacion ? parseFloat(asignacionMovilizacion) : null)
      .input('asignacion_zona', sql.Decimal(12, 2), asignacionZona ? parseFloat(asignacionZona) : null)
      .input('asignacion_responsabilidad', sql.Decimal(12, 2), asignacionResponsabilidad ? parseFloat(asignacionResponsabilidad) : null)
      .input('bonos', sql.Decimal(12, 2), bonos ? parseFloat(bonos) : null)
      .input('forma_pago', sql.VarChar, formaPago || null)
      .input('banco', sql.VarChar, banco || null)
      .input('tipo_cuenta', sql.VarChar, tipoCuenta || null)
      .input('numero_cuenta', sql.VarChar, numeroCuenta || null)
      // Previsión
      .input('afp', sql.VarChar, afp || null)
      .input('salud', sql.VarChar, salud || null)
      .input('plan_isapre', sql.VarChar, planIsapre || null)
      .input('tramo_asignacion_familiar', sql.Char(1), tramoAsignacionFamiliar || null)
      // Asistencia
      .input('turno', sql.VarChar, turno || null)
      .input('horario_asistencia', sql.VarChar, horarioAsistencia || null)
      .input('calendario', sql.VarChar, calendario || null)
      // Estado
      .input('activo', sql.Bit, activo !== undefined ? activo : true)
      .query(`
        UPDATE empleados SET
          codigo_empleado = @codigo_empleado, rut = @rut, nombre = @nombre, apellido = @apellido,
          nacionalidad = @nacionalidad, fecha_nacimiento = @fecha_nacimiento, sexo = @sexo,
          estado_civil = @estado_civil, cantidad_hijos = @cantidad_hijos, direccion = @direccion,
          comuna = @comuna, ciudad = @ciudad, telefono = @telefono, email = @email,
          contacto_emergencia_nombre = @contacto_emergencia_nombre,
          contacto_emergencia_telefono = @contacto_emergencia_telefono,
          contacto_emergencia_relacion = @contacto_emergencia_relacion,
          fecha_ingreso = @fecha_ingreso, fecha_termino = @fecha_termino, tipo_contrato = @tipo_contrato,
          jornada = @jornada, horario = @horario, modalidad = @modalidad, departamento = @departamento,
          subdepartamento = @subdepartamento, cargo = @cargo, centro_costo = @centro_costo, supervisor = @supervisor,
          salario = @salario, tipo_sueldo = @tipo_sueldo, asignacion_colacion = @asignacion_colacion,
          asignacion_movilizacion = @asignacion_movilizacion, asignacion_zona = @asignacion_zona,
          asignacion_responsabilidad = @asignacion_responsabilidad, bonos = @bonos, forma_pago = @forma_pago,
          banco = @banco, tipo_cuenta = @tipo_cuenta, numero_cuenta = @numero_cuenta,
          afp = @afp, salud = @salud, plan_isapre = @plan_isapre, tramo_asignacion_familiar = @tramo_asignacion_familiar,
          turno = @turno, horario_asistencia = @horario_asistencia, calendario = @calendario,
          activo = @activo
        WHERE id = @id
      `);
    
    await pool.close();
    
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

// DELETE - Eliminar un empleado
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
    const pool = await getCompanyConnection(session.dbName);
    
    // Opción 1: Eliminar físicamente
    // await pool.request()
    //   .input('id', sql.Int, parseInt(id))
    //   .query('DELETE FROM empleados WHERE id = @id');
    
    // Opción 2: Desactivar (soft delete) - más seguro
    await pool.request()
      .input('id', sql.Int, parseInt(id))
      .query('UPDATE empleados SET activo = 0 WHERE id = @id');
    
    await pool.close();
    
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
