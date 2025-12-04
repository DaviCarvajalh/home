import { NextRequest, NextResponse } from 'next/server';
import { getCompanyConnection, sql } from '@/lib/db';
import { cookies } from 'next/headers';

// GET - Listar empleados
export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);
    const pool = await getCompanyConnection(session.dbName);
    
    const result = await pool.request().query(`
      SELECT 
        id, codigo_empleado, rut, nombre, apellido, email, telefono,
        fecha_nacimiento, fecha_ingreso, departamento, cargo, salario, activo
      FROM empleados
      ORDER BY apellido, nombre
    `);
    
    await pool.close();
    
    return NextResponse.json({ empleados: result.recordset });
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
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);
    const body = await request.json();
    
    const {
      codigoEmpleado,
      rut,
      nombre,
      apellido,
      email,
      telefono,
      fechaNacimiento,
      fechaIngreso,
      departamento,
      cargo,
      salario,
    } = body;

    // Validaciones básicas
    if (!rut || !nombre || !apellido || !fechaIngreso) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios' },
        { status: 400 }
      );
    }

    const pool = await getCompanyConnection(session.dbName);
    
    // Verificar si el RUT ya existe
    const existingRut = await pool.request()
      .input('rut', sql.VarChar, rut)
      .query('SELECT id FROM empleados WHERE rut = @rut');
    
    if (existingRut.recordset.length > 0) {
      await pool.close();
      return NextResponse.json(
        { error: 'Ya existe un trabajador con este RUT' },
        { status: 400 }
      );
    }

    // Insertar empleado
    const result = await pool.request()
      .input('codigo_empleado', sql.VarChar, codigoEmpleado || null)
      .input('rut', sql.VarChar, rut)
      .input('nombre', sql.VarChar, nombre)
      .input('apellido', sql.VarChar, apellido)
      .input('email', sql.VarChar, email || null)
      .input('telefono', sql.VarChar, telefono || null)
      .input('fecha_nacimiento', sql.Date, fechaNacimiento || null)
      .input('fecha_ingreso', sql.Date, fechaIngreso)
      .input('departamento', sql.VarChar, departamento || null)
      .input('cargo', sql.VarChar, cargo || null)
      .input('salario', sql.Decimal(12, 2), salario || null)
      .query(`
        INSERT INTO empleados (
          codigo_empleado, rut, nombre, apellido, email, telefono,
          fecha_nacimiento, fecha_ingreso, departamento, cargo, salario
        )
        OUTPUT INSERTED.id
        VALUES (
          @codigo_empleado, @rut, @nombre, @apellido, @email, @telefono,
          @fecha_nacimiento, @fecha_ingreso, @departamento, @cargo, @salario
        )
      `);
    
    await pool.close();
    
    return NextResponse.json({
      success: true,
      id: result.recordset[0].id,
      message: 'Trabajador creado exitosamente'
    });
  } catch (error) {
    console.error('Error al crear empleado:', error);
    return NextResponse.json(
      { error: 'Error al crear el trabajador' },
      { status: 500 }
    );
  }
}
