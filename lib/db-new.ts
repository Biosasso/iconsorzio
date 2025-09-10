// Nuovo database Digital Ocean
import { PrismaClient } from '@prisma/client'

const prismaNew = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_TEST || process.env.DATABASE_URL_NEW
    }
  },
  log: ['query', 'info', 'warn', 'error']
})

export { prismaNew }
