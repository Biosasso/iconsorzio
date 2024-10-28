import { prisma } from '@/lib/db'

export default async function handler(req, res) {

    const id = req.query.sid;

    try {

        const result = await prisma.allievoServizio.findFirst({
            where: {
                id: id
            },
            include: {
                tariffa: {
                    include: {
                        patente: true,
                        tipo: true
                    }
                },
                istruttore: {
                    include: {
                        profile: true
                    }
                },
            },
        })

        res.json(result)

    } catch (err) {
        console.log(err)
        res.status(200).json({ statusCode: 400, message: 'Errore nel caricamento dei dati' })
    }


}
