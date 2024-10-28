import { prisma } from '@/lib/db'

export default async function handler(req, res) {

    if (req.method !== 'GET') {
        res.status(500).json('Non permesso!')
    }

    const id = req.query.wid;

    try {

        const result = await prisma.workplace.findFirst({
            where: {
                id: id
            }
        })

        if (!result) {
            res.status(200).json({ statusCode: 400, message: 'Nessun workplace presente in archivio' })
        }

        res.json(result)

    } catch (err) {
        console.log(err)
        res.status(200).json({ statusCode: 400, message: 'Errore nel caricamento dei dati' })
    }


}
