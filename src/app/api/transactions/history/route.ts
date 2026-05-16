import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUserFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(req)
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type') || undefined
    const skip = (page - 1) * limit

    const where = {
      userId: authUser.userId,
      ...(type ? { type: type as any } : {}),
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,
      }),
      prisma.transaction.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      transactions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Transaction history error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
