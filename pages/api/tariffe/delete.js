import { prisma } from '@/lib/db'

export default async function handler(req, res) {

    const data = req.body;

    try {

        const result = await prisma.tariffa.delete({
            where: {
                id: data.id
            }
        })

        res.status(200).json({ statusCode: 200, message: 'Tariffa eliminata', id: result.id })

    }
    catch (err) {
        console.log(err)
        res.status(200).json({ statusCode: 400, message: 'Errore' })
    }
}
