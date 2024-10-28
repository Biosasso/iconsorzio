import { prisma } from '@/lib/db'

export default async function handler(req, res) {

    if (req.method !== 'POST') {
        res.status(500).json('Non permesso!')
    }

    const { companyId } = req.body;

    try {

        const result = await prisma.autoscuola.findMany({
            where: {
                companyId: companyId
            },
            select: {
                id: true,
                denominazione: true,
                limitePrenotazioni: true
            },
            orderBy: {
                denominazione: 'asc'
            }
        })

        res.json(result)

    }
    catch (err) {
        console.log(err)
        res.status(200).json({ statusCode: 400, title: 'Errore inaspettato', message: 'Errore nel caricamento dei dati, ricarica la pagina' })
    }
}
