import { prisma } from '@/lib/db'

export default async function handler(req, res) {

    const { id } = req.body;

    try {

        const result = await prisma.allievoServizio.delete({
            where: {
                id: id
            }
        })
        res.json(result);

    } catch (err) {

        console.log(err)
        res.status(200).json({ statusCode: 400, title: 'Errore generico, riprova!' })

    }

}
