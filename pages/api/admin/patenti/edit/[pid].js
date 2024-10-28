import { prisma } from '@/lib/db'

export default async function handler(req, res) {

    if (req.method !== 'GET') {
        res.status(500).json('Non permesso!')
    }

    const id = req.query.pid;

    try {

        const result = await prisma.patente.findFirst({
            where: {
                id: id
            }
        })

        if (!result) {
            res.status(200).json({ statusCode: 400, message: 'Nessuna patente presente in archivio' })
        }

        res.json(result)

    } catch (err) {
        console.log(err)
        res.status(200).json({ statusCode: 400, message: 'Errore nel caricamento dei dati' })
    }


}
