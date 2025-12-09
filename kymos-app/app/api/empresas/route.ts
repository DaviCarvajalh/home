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
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const result = await pool.query(
      `SELECT * FROM empresas ORDER BY nombre`
    );

    return NextResponse.json({ empresas: result.rows });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.rol !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { nombre, rut, db_schema } = body;

    const result = await pool.query(
      `INSERT INTO empresas (nombre, rut, db_schema)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [nombre, rut, db_schema || nombre.toLowerCase().replace(/\s+/g, '_')]
    );

    return NextResponse.json({ empresa: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
