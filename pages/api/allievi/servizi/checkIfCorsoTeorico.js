import { prisma } from '@/lib/db'

export default async function handler(req, res) {

    const { tariffaTipo } = req.body

    try {

        const result = await prisma.tariffaTipo.findFirst({
            where: {
                id: tariffaTipo,
            },
        })

        res.json(result)

    }
    catch (err) {
        console.log(err)
        res.status(200).json(false)
    }
}
