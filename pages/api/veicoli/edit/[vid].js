import { prisma } from '@/lib/db'

export default async function handler(req, res) {

    const id = req.query.vid;

    try {

        const result = await prisma.veicolo.findFirst({
            where: {
                id: id
            },
            include: {
                Patenti: {
                    select: {
                        patente: true
                    }
                },
                workplace: true
            }
        })

        if (!result) {
            res.status(200).json({ statusCode: 400, message: 'Nessun veicolo presente in archivio' })
        }

        res.json(result)

    } catch (err) {
        console.log(err)
        res.status(200).json({ statusCode: 400, message: 'Errore nel caricamento dei dati' })
    }


}
