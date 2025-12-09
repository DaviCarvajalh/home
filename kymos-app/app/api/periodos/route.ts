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
      `SELECT * FROM periodos WHERE empresa_id = $1 ORDER BY anio DESC, mes DESC`,
      [session.empresaId]
    );

    return NextResponse.json({ periodos: result.rows });
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
    const { mes, anio } = body;

    // Verificar si ya existe el período
    const existing = await pool.query(
      'SELECT id FROM periodos WHERE empresa_id = $1 AND mes = $2 AND anio = $3',
      [session.empresaId, mes, anio]
    );

    if (existing.rows.length > 0) {
      return NextResponse.json({ error: 'El período ya existe' }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO periodos (empresa_id, mes, anio, estado, fecha_apertura)
       VALUES ($1, $2, $3, 'abierto', NOW())
       RETURNING *`,
      [session.empresaId, mes, anio]
    );

    return NextResponse.json({ periodo: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
