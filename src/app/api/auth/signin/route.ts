import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { accountNumber, password } = await req.json()

    if (!accountNumber || !password) {
      return NextResponse.json({ error: 'Account number and password required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { accountNumber: accountNumber.toUpperCase() },
      include: { account: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    if (!user.account?.isActive) {
      return NextResponse.json({ error: 'Account is inactive' }, { status: 403 })
    }

    const token = await signToken({ userId: user.id, accountNumber: user.accountNumber, type: 'USER' })

    const response = NextResponse.json({
      success: true,
      user: {
        accountNumber: user.accountNumber,
        fullName: user.fullName,
        balance: user.account?.balance ?? 0,
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
    console.error('Signin error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
