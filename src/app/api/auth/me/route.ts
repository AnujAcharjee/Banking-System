import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const user = await getAuthUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
  return NextResponse.json({ authenticated: true, userId: user.userId, accountNumber: user.accountNumber })
}
