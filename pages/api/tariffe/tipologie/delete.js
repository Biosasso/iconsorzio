import { prisma } from '@/lib/db'

export default async function handler(req, res) {

    const data = req.body;

    try {

        const result = await prisma.tariffaTipo.delete({
            where: {
                id: data.id
            }
        })

        res.status(200).json({ statusCode: 200, message: 'Tipologia eliminata', id: result.id })

    }
    catch (err) {
        console.log(err)
        res.status(200).json({ statusCode: 400, message: 'Errore' })
    }
}
