import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUserFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(req)
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
      select: {
        id: true,
        accountNumber: true,
        fullName: true,
        email: true,
        phone: true,
        address: true,
        panNumber: true,
        aadhaarNumber: true,
        createdAt: true,
        account: {
          select: { balance: true, isActive: true },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        accountNumber: user.accountNumber,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        panNumber: user.panNumber,
        aadhaarNumber: user.aadhaarNumber,
        createdAt: user.createdAt,
        account: {
          balance: user.account?.balance ?? 0,
          isActive: user.account?.isActive ?? false,
        },
      },
    })
  } catch (error) {
    console.error('Account details error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
