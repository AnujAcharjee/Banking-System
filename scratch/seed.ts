import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const usersToCreate = [
    { name: 'Alice Smith', phone: '9876543210', pan: 'ABCDE1234F', aadhaar: '123456789012', balance: 50000 },
    { name: 'Bob Johnson', phone: '9876543211', pan: 'BCDEF2345G', aadhaar: '234567890123', balance: 12500 },
    { name: 'Charlie Davis', phone: '9876543212', pan: 'CDEFG3456H', aadhaar: '345678901234', balance: 350000 },
    { name: 'Diana Prince', phone: '9876543213', pan: 'DEFGH4567I', aadhaar: '456789012345', balance: 5000 },
    { name: 'Ethan Hunt', phone: '9876543214', pan: 'EFGHI5678J', aadhaar: '567890123456', balance: 87500 }
  ]

  const password = 'Password123!'
  const passwordHash = await bcrypt.hash(password, 10)

  console.log('Seeding users...')
  
  const createdUsers = []

  for (let i = 0; i < usersToCreate.length; i++) {
    const u = usersToCreate[i]
    
    const exists = await prisma.user.findUnique({ where: { phone: u.phone } })
    if (exists) {
      // Just fetch the account number to display it
      createdUsers.push({ name: u.name, accountNumber: exists.accountNumber, password, balance: u.balance })
      continue
    }

    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase()
    const panNumber = `PAN${randomStr}${i}`
    const aadhaarNumber = `${Math.floor(100000000000 + Math.random() * 900000000000)}`

    const accountNumber = `NOVA${Math.floor(10000000 + Math.random() * 90000000)}`

    const user = await prisma.user.create({
      data: {
        fullName: u.name,
        phone: u.phone,
        email: `demo${i+1}_${randomStr}@example.com`,
        panNumber,
        aadhaarNumber,
        address: '123 Demo Street, Tech City',
        accountNumber,
        passwordHash,
        account: {
          create: {
            balance: u.balance,
            isActive: true
          }
        }
      }
    })
    createdUsers.push({ name: u.name, accountNumber, password, balance: u.balance })
  }

  console.log('\n--- DEMO ACCOUNTS CREATED ---')
  console.table(createdUsers)
  console.log('-----------------------------\n')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
