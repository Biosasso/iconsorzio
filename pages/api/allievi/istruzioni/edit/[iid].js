import { prisma } from '@/lib/db'

export default async function handler(req, res) {

    const id = req.query.iid;

    try {

        const result = await prisma.allievoIstruzione.findFirst({
            where: {
                id: id
            },
            include: {
                patente: true,
            }
        })

        res.json(result)

    } catch (err) {
        console.log(err)
        res.status(200).json({ statusCode: 400, message: 'Errore nel caricamento dei dati' })
    }


}
