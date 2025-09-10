import { prisma } from '@/lib/db'

export default async function handler(req, res) {

    const { companyId } = req.body;

    try {

        const result = await prisma.veicolo.findMany({
            where: {
                companyId: companyId,
            },
            include: {
                Patenti: {
                    select: {
                        patente: true
                    }
                },
                workplace: true
            },
            orderBy: {
                nome: 'asc',
            },
        })

        res.json(result)

    }
    catch (error) {
        console.error('Database error in /api/veicoli/list:', error);
        
        // Gestione specifica per errori di connessione
        if (error.code === 'P2037') {
            console.error('Troppe connessioni al database');
            return res.status(503).json({ statusCode: 503, title: 'Database sovraccarico', message: 'Database temporaneamente sovraccarico, riprova tra qualche minuto' });
        }
        
        // Per altri errori di database
        if (error.code && error.code.startsWith('P')) {
            console.error('Errore Prisma:', error.code);
            return res.status(500).json({ statusCode: 500, title: 'Errore database', message: 'Errore nel caricamento dei dati, ricarica la pagina' });
        }
        
        // Per errori generici
        return res.status(500).json({ statusCode: 500, title: 'Errore inaspettato', message: 'Errore nel caricamento dei dati, ricarica la pagina' });
    }
}
