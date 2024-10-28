import { prisma } from '@/lib/db.ts'

export default async function handler(req, res) {

    if (req.method !== 'GET') {
        res.status(500).json('Non permesso!')
    }

    const { isActive } = req.query

    try {

        const getRule = await prisma.rule.findMany({
            where: {
                companyId: isActive
            },
            orderBy: {
                accessCode: 'asc',
            },
        })

        res.json(getRule)

    }
    catch (err) {
        res.status(200).json({ statusCode: 400, title: 'Errore inaspettato', message: 'Errore nel caricamento dei dati, ricarica la pagina ' })
    }
}
