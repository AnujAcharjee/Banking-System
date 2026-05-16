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

    const { toAccountNumber, amount, description } = await req.json()

    if (!toAccountNumber || !amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    if (toAccountNumber.toUpperCase() === authUser.accountNumber) {
      return NextResponse.json({ error: 'Cannot transfer to own account' }, { status: 400 })
    }

    const [fromAccount, toUser] = await Promise.all([
      prisma.account.findUnique({ where: { userId: authUser.userId } }),
      prisma.user.findUnique({
        where: { accountNumber: toAccountNumber.toUpperCase() },
        include: { account: true },
      }),
    ])

    if (!fromAccount || !fromAccount.isActive) {
      return NextResponse.json({ error: 'Your account is inactive' }, { status: 400 })
    }

    if (!toUser || !toUser.account || !toUser.account.isActive) {
      return NextResponse.json({ error: 'Recipient account not found' }, { status: 404 })
    }

    if (fromAccount.balance < amount) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })
    }

    const fromNewBalance = fromAccount.balance - amount
    const toNewBalance = toUser.account.balance + amount
    const refOut = generateTransactionRef()
    const refIn = generateTransactionRef()
    const desc = description || `Transfer to ${toAccountNumber.toUpperCase()}`

    await prisma.$transaction([
      prisma.account.update({
        where: { userId: authUser.userId },
        data: { balance: fromNewBalance },
      }),
      prisma.account.update({
        where: { userId: toUser.id },
        data: { balance: toNewBalance },
      }),
      prisma.transaction.create({
        data: {
          userId: authUser.userId,
          type: 'TRANSFER_OUT',
          amount,
          balanceAfter: fromNewBalance,
          description: desc,
          referenceNumber: refOut,
          status: 'SUCCESS',
        },
      }),
      prisma.transaction.create({
        data: {
          userId: toUser.id,
          type: 'TRANSFER_IN',
          amount,
          balanceAfter: toNewBalance,
          description: `Transfer from ${authUser.accountNumber}`,
          referenceNumber: refIn,
          status: 'SUCCESS',
        },
      }),
    ])

    return NextResponse.json({
      success: true,
      message: `₹${amount} transferred to ${toUser.fullName}`,
      referenceNumber: refOut,
      newBalance: fromNewBalance,
    })
  } catch (error) {
    console.error('Transfer error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
