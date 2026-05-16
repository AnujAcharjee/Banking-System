import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateOTP } from '@/lib/client-utils'

export async function POST(req: NextRequest) {
  try {
    const { accountNumber, phone } = await req.json()

    if (!accountNumber || !phone) {
      return NextResponse.json({ error: 'Account number and phone required' }, { status: 400 })
    }

    const user = await prisma.user.findFirst({
      where: {
        accountNumber: accountNumber.toUpperCase(),
        phone,
      },
    })

    if (!user) {
      // Don't reveal if user exists for security
      return NextResponse.json({
        success: true,
        message: 'If the details match, an OTP will be sent to your phone',
      })
    }

    // Delete existing OTPs for this account
    await prisma.otpStore.deleteMany({
      where: { accountNumber: accountNumber.toUpperCase() },
    })

    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    await prisma.otpStore.create({
      data: {
        accountNumber: accountNumber.toUpperCase(),
        otp,
        expiresAt,
      },
    })

    // In production: send via SMS. For lab/dev, return OTP in response.
    console.log(`[DEV] OTP for ${accountNumber}: ${otp}`)

    return NextResponse.json({
      success: true,
      message: 'OTP sent to registered phone number',
      // REMOVE THIS IN PRODUCTION - only for lab/dev purposes
      devOtp: process.env.NODE_ENV !== 'production' ? otp : undefined,
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
