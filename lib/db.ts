import { PrismaClient } from '@prisma/client'

declare global {
    var prisma: PrismaClient | undefined
}

export const prisma =
    global.prisma ||
    new PrismaClient({
        // log: ['query'],
        datasources: {
            db: {
                url: process.env.DATABASE_URL + (process.env.NODE_ENV === 'production' ? '?connection_limit=1&pool_timeout=43200&connect_timeout=60' : '')
            }
        }
    })

if (process.env.NODE_ENV !== 'production') global.prisma = prisma