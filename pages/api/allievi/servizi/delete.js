import { prisma } from '@/lib/db'

export default async function handler(req, res) {

    const { id } = req.body

    try {

        const result = await prisma.allievoServizio.delete({
            where: {
                id: id
            },
        })

        if (!result) {
            res.status(200).json({ statusCode: 200, message: 'Nessun servizio presente in archivio' })
        }

        res.json(result)

    } catch (err) {
        console.log(err)
    }


}
