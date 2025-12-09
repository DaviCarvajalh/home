import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { pool } from '@/lib/db';

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

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.empresaId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const result = await pool.query(
      `SELECT * FROM sucursales WHERE empresa_id = $1 ORDER BY nombre`,
      [session.empresaId]
    );

    return NextResponse.json({ sucursales: result.rows });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.empresaId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { nombre, direccion, ciudad, telefono, email } = body;

    const result = await pool.query(
      `INSERT INTO sucursales (empresa_id, nombre, direccion, ciudad, telefono, email)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [session.empresaId, nombre, direccion, ciudad, telefono, email]
    );

    return NextResponse.json({ sucursal: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
