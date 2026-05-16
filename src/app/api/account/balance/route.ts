import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUserFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(req)
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const account = await prisma.account.findUnique({
      where: { userId: authUser.userId },
    })

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      balance: account.balance,
      isActive: account.isActive,
    })
  } catch (error) {
    console.error('Balance error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
