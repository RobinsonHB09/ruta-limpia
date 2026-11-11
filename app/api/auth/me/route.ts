
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('ruta_limpia_session')?.value

    if (!token) {
      return NextResponse.json(
        { usuario: null },
        { status: 401 }
      )
    }

    const secret = process.env.AUTH_SECRET

    if (!secret || secret.length < 32) {
      throw new Error('AUTH_SECRET no está configurada.')
    }

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    )

    return NextResponse.json({
      usuario: {
        id: payload.sub,
        nombre: payload.nombre,
        correo: payload.correo,
        rol: payload.rol,
      },
    })

  } catch {
    return NextResponse.json(
      { usuario: null },
      { status: 401 }
    )
  }
}
