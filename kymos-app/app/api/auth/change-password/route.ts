import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { query } from '@/lib/db-postgres';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    
    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'No hay sesión activa' },
        { status: 401 }
      );
    }

    const session = JSON.parse(sessionCookie.value);
    const { currentPassword, newPassword } = await request.json();

    // Validar campos
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Todos los campos son obligatorios' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'La nueva contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Verificar contraseña actual
    const result = await query(
      'SELECT id, password_hash FROM usuarios WHERE id = $1',
      [session.userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    const user = result.rows[0];

    // Comparar contraseña actual (en producción usar bcrypt)
    if (user.password_hash !== currentPassword) {
      return NextResponse.json(
        { error: 'La contraseña actual es incorrecta' },
        { status: 400 }
      );
    }

    // Actualizar contraseña
    await query(
      'UPDATE usuarios SET password_hash = $1 WHERE id = $2',
      [newPassword, session.userId]
    );

    return NextResponse.json({
      success: true,
      message: 'Contraseña actualizada correctamente'
    });

  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
