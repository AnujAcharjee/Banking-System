import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { accountNumber, otp, newPassword } = await req.json()

    if (!accountNumber || !otp || !newPassword) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 })
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const otpRecord = await prisma.otpStore.findFirst({
      where: {
        accountNumber: accountNumber.toUpperCase(),
        otp,
        expiresAt: { gt: new Date() },
      },
    })

    if (!otpRecord) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(newPassword, 12)

    await prisma.user.update({
      where: { accountNumber: accountNumber.toUpperCase() },
      data: { passwordHash },
    })

    await prisma.otpStore.delete({ where: { id: otpRecord.id } })

    return NextResponse.json({ success: true, message: 'Password reset successfully' })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
