import { NextRequest, NextResponse } from 'next/server';
import { getMasterConnection, getCompanyConnection } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { usuario, password } = await request.json();

    if (!usuario || !password) {
      return NextResponse.json(
        { error: 'Usuario y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Conectar a la base de datos maestra
    const masterPool = await getMasterConnection();

    // Buscar la empresa por el email del usuario
    // Por ahora, asumimos que el usuario pertenece a Ignisterra
    const empresaResult = await masterPool.request()
      .input('dbName', 'ignisterra_db')
      .query('SELECT * FROM empresas WHERE db_name = @dbName AND activo = 1');

    if (empresaResult.recordset.length === 0) {
      await masterPool.close();
      return NextResponse.json(
        { error: 'Empresa no encontrada' },
        { status: 404 }
      );
    }

    const empresa = empresaResult.recordset[0];
    await masterPool.close();

    // Conectar a la base de datos de la empresa
    const companyPool = await getCompanyConnection(empresa.db_name);

    // Buscar el usuario
    const userResult = await companyPool.request()
      .input('email', usuario)
      .query('SELECT * FROM usuarios WHERE email = @email AND activo = 1');

    if (userResult.recordset.length === 0) {
      await companyPool.close();
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 401 }
      );
    }

    const user = userResult.recordset[0];

    // Verificar contraseña (por ahora comparación simple, después usar bcrypt)
    if (user.password_hash !== password) {
      await companyPool.close();
      return NextResponse.json(
        { error: 'Contraseña incorrecta' },
        { status: 401 }
      );
    }

    await companyPool.close();

    // Crear sesión (cookie)
    const cookieStore = await cookies();
    cookieStore.set('session', JSON.stringify({
      userId: user.id,
      email: user.email,
      nombre: user.nombre,
      rol: user.rol,
      empresa: empresa.nombre,
      dbName: empresa.db_name,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 horas
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        rol: user.rol,
        empresa: empresa.nombre,
      },
    });

  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
