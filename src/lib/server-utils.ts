/**
 * server-utils.ts — Server-only. Never import into 'use client' components.
 */
import { prisma } from './prisma'
import { generateAccountNumber } from './client-utils'

export { generateAccountNumber, generateOTP, generateTransactionRef } from './client-utils'

export async function generateUniqueAccountNumber(): Promise<string> {
  let accountNumber = generateAccountNumber()
  let exists = await prisma.user.findUnique({ where: { accountNumber } })

  while (exists) {
    accountNumber = generateAccountNumber()
    exists = await prisma.user.findUnique({ where: { accountNumber } })
  }

  return accountNumber
}
