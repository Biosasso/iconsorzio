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
                url: process.env.DATABASE_URL + '?connection_limit=22&pool_timeout=30&connect_timeout=10&socket_timeout=10'
            }
        }
    })

if (process.env.NODE_ENV !== 'production') global.prisma = prisma

// Aggiungi listener solo una volta per evitare memory leak
if (!global.prisma) {
    // Disconnect automatico per evitare troppi collegamenti
    process.on('beforeExit', async () => {
        await prisma.$disconnect()
    })

    process.on('SIGINT', async () => {
        await prisma.$disconnect()
        process.exit(0)
    })

    process.on('SIGTERM', async () => {
        await prisma.$disconnect()
        process.exit(0)
    })

    // Gestori aggiuntivi per errori
    process.on('uncaughtException', async () => {
        await prisma.$disconnect()
        process.exit(1)
    })

    process.on('unhandledRejection', async () => {
        await prisma.$disconnect()
        process.exit(1)
    })
}