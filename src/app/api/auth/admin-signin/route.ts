import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { adminId, password } = await req.json()

    if (!adminId || !password) {
      return NextResponse.json({ error: 'Admin ID and password required' }, { status: 400 })
    }

    const admin = await prisma.admin.findUnique({
      where: { adminId: adminId.toUpperCase() },
    })

    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const isValid = await bcrypt.compare(password, admin.passwordHash)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = await signToken({ userId: admin.id, adminId: admin.adminId, type: 'ADMIN' })

    const response = NextResponse.json({
      success: true,
      user: {
        adminId: admin.adminId,
        fullName: admin.fullName,
        type: 'ADMIN'
      },
    })

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Admin Signin error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
