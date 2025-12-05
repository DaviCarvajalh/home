import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db-postgres';
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

    // Buscar la empresa (por ahora asumimos Ignisterra)
    const empresaResult = await query(
      'SELECT * FROM empresas WHERE db_schema = $1 AND activo = true',
      ['ignisterra']
    );

    if (empresaResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Empresa no encontrada' },
        { status: 404 }
      );
    }

    const empresa = empresaResult.rows[0];

    // Buscar el usuario
    const userResult = await query(
      'SELECT * FROM usuarios WHERE email = $1 AND activo = true AND empresa_id = $2',
      [usuario, empresa.id]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 401 }
      );
    }

    const user = userResult.rows[0];

    // Verificar contraseña (por ahora comparación simple, después usar bcrypt)
    if (user.password_hash !== password) {
      return NextResponse.json(
        { error: 'Contraseña incorrecta' },
        { status: 401 }
      );
    }

    // Crear sesión (cookie)
    const cookieStore = await cookies();
    cookieStore.set('session', JSON.stringify({
      userId: user.id,
      email: user.email,
      nombre: user.nombre,
      rol: user.rol,
      empresa: empresa.nombre,
      empresaId: empresa.id,
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
