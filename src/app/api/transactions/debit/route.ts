import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUserFromRequest } from '@/lib/auth'
import { generateTransactionRef } from '@/lib/client-utils'

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(req)
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { amount, description } = await req.json()

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    const account = await prisma.account.findUnique({
      where: { userId: authUser.userId },
    })

    if (!account || !account.isActive) {
      return NextResponse.json({ error: 'Account not found or inactive' }, { status: 404 })
    }

    if (account.balance < amount) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })
    }

    const newBalance = account.balance - amount
    const referenceNumber = generateTransactionRef()

    const [updatedAccount, transaction] = await prisma.$transaction([
      prisma.account.update({
        where: { userId: authUser.userId },
        data: { balance: newBalance },
      }),
      prisma.transaction.create({
        data: {
          userId: authUser.userId,
          type: 'DEBIT',
          amount,
          balanceAfter: newBalance,
          description: description || 'Debit',
          referenceNumber,
          status: 'SUCCESS',
        },
      }),
    ])

    return NextResponse.json({
      success: true,
      transaction: {
        referenceNumber: transaction.referenceNumber,
        amount: transaction.amount,
        type: transaction.type,
        balanceAfter: transaction.balanceAfter,
        createdAt: transaction.createdAt,
      },
      newBalance: updatedAccount.balance,
    })
  } catch (error) {
    console.error('Debit error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
