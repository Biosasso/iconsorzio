import { prisma } from '@/lib/db'

export default async function handler(req, res) {
    try {
        // Test connessione database
        const result = await prisma.$queryRaw`SELECT 1 as test`
        
        res.status(200).json({ 
            statusCode: 200, 
            message: 'Database connesso correttamente',
            test: result
        })
    } catch (err) {
        console.log('Errore connessione database:', err)
        res.status(500).json({ 
            statusCode: 500, 
            message: 'Errore connessione database',
            error: err.message
        })
    }
}