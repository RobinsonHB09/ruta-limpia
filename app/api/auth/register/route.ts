
import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const nombre = String(body.nombre || '').trim()
    const correo = String(body.correo || '').trim().toLowerCase()
    const password = String(body.password || '')

    // Validar campos
    if (!nombre || !correo || !password) {
      return NextResponse.json(
        { success: false, message: 'Todos los campos son obligatorios.' },
        { status: 400 }
      )
    }

    if (nombre.length > 120) {
      return NextResponse.json(
        { success: false, message: 'El nombre es demasiado largo.' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(correo) || correo.length > 150) {
      return NextResponse.json(
        { success: false, message: 'Ingresa un correo electrónico válido.' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'La contraseña debe tener mínimo 6 caracteres.' },
        { status: 400 }
      )
    }

    // Comprobar si el correo ya existe
    const [existingUsers] = await pool.execute(
      'SELECT id FROM usuarios WHERE correo = ? LIMIT 1',
      [correo]
    )

    if ((existingUsers as Array<{ id: number }>).length > 0) {
      return NextResponse.json(
        { success: false, message: 'Este correo electrónico ya está registrado.' },
        { status: 409 }
      )
    }

    // Encriptar contraseña
    const passwordHash = await bcrypt.hash(password, 12)

    // Registrar usuario
    const [result] = await pool.execute(
      `INSERT INTO usuarios (nombre, correo, password, rol, estado)
       VALUES (?, ?, ?, 'operador', 'activo')`,
      [nombre, correo, passwordHash]
    )

    const userId = (result as { insertId: number }).insertId

    return NextResponse.json(
      {
        success: true,
        message: 'Tu cuenta fue creada correctamente.',
        usuario: {
          id: userId,
          nombre,
          correo,
          rol: 'operador'
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error en el registro:', error)

    return NextResponse.json(
      { success: false, message: 'Ocurrió un error al crear la cuenta.' },
      { status: 500 }
    )
  }
}
