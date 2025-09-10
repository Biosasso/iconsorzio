import { prisma } from '@/lib/db'
import { getSession } from 'next-auth/react'

export default async function newAutoscuolaAPI(req, res) {

    const session = await getSession({ req });

    const { allievoId, servizioCompletato } = req.body;

    try {
        const companyId = await prisma.activeCompany.findFirst({
            where: {
                userId: session.user.id
            }
        });

        const result = await prisma.allievoIstruzione.findMany({
            where: {
                companyId: companyId.isActive,
                allievoId: allievoId,
                istruzioneCompletata: servizioCompletato
            },
            include: {
                patente: true
            }
        })

        if (!result) {
            res.status(200).json({ statusCode: 200, message: 'Nessuna istruzione presente in archivio' })
        }

        res.json(result)

    } catch (error) {
        console.error('Database error in /api/allievi/istruzioni/list:', error);
        
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
