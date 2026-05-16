import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/auth'
import { generateUniqueAccountNumber } from '@/lib/server-utils'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { fullName, email, phone, address, panNumber, aadhaarNumber, password } = body

    // Validate required fields
    if (!fullName || !phone || !address || !panNumber || !aadhaarNumber || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // Validate PAN format
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber.toUpperCase())) {
      return NextResponse.json({ error: 'Invalid PAN number format' }, { status: 400 })
    }

    // Validate Aadhaar format
    if (!/^\d{12}$/.test(aadhaarNumber)) {
      return NextResponse.json({ error: 'Aadhaar must be 12 digits' }, { status: 400 })
    }

    // Validate phone
    if (!/^\d{10}$/.test(phone)) {
      return NextResponse.json({ error: 'Phone must be 10 digits' }, { status: 400 })
    }

    // Check existing user
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { phone },
          { panNumber: panNumber.toUpperCase() },
          { aadhaarNumber },
          ...(email ? [{ email }] : []),
        ],
      },
    })

    if (existingUser) {
      return NextResponse.json({ error: 'User with these details already exists' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const accountNumber = await generateUniqueAccountNumber()

    const user = await prisma.user.create({
      data: {
        accountNumber,
        passwordHash,
        fullName,
        email: email || null,
        phone,
        address,
        panNumber: panNumber.toUpperCase(),
        aadhaarNumber,
        account: {
          create: {
            balance: 0,
          },
        },
      },
    })

    const token = await signToken({ userId: user.id, accountNumber: user.accountNumber, type: 'USER' })

    const response = NextResponse.json({
      success: true,
      accountNumber: user.accountNumber,
      message: 'Account created successfully',
    }, { status: 201 })

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
