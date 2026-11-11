
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SignJWT } from 'jose'
import bcrypt from 'bcryptjs'
import db from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { correo, password } = await request.json()

    if (!correo || !password) {
      return NextResponse.json(
        { message: 'Ingresa tu correo y contraseña.' },
        { status: 400 }
      )
    }

    const correoNormalizado = String(correo).trim().toLowerCase()

    const [rows]: any = await db.execute(
      `SELECT id, nombre, correo, password, rol, estado
       FROM usuarios
       WHERE correo = ?
       LIMIT 1`,
      [correoNormalizado]
    )

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { message: 'El correo o la contraseña son incorrectos.' },
        { status: 401 }
      )
    }

    const usuario = rows[0]

    if (usuario.estado !== 'activo') {
      return NextResponse.json(
        { message: 'Tu cuenta se encuentra inactiva. Contacta al administrador.' },
        { status: 403 }
      )
    }

    const passwordValida = await bcrypt.compare(
      String(password),
      usuario.password
    )

    if (!passwordValida) {
      return NextResponse.json(
        { message: 'El correo o la contraseña son incorrectos.' },
        { status: 401 }
      )
    }

    const secret = process.env.AUTH_SECRET

    if (!secret || secret.length < 32) {
      throw new Error('AUTH_SECRET no está configurada correctamente.')
    }

    const token = await new SignJWT({
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(String(usuario.id))
      .setIssuedAt()
      .setExpirationTime('8h')
      .sign(new TextEncoder().encode(secret))

    const cookieStore = await cookies()

    cookieStore.set('ruta_limpia_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8,
    })

    return NextResponse.json({
      message: 'Inicio de sesión exitoso.',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    })

  } catch (error) {
    console.error('Error en login:', error)

    return NextResponse.json(
      { message: 'Ocurrió un error al iniciar sesión.' },
      { status: 500 }
    )
  }
}
