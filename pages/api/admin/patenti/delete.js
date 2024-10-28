import { prisma } from '@/lib/db'

export default async function handler(req, res) {

    if (req.method !== 'POST') {
        res.status(500).json('Non permesso!')
    }

    const data = req.body;

    try {

        const result = await prisma.patente.delete({
            where: {
                id: data.id
            }
        })

        res.status(200).json({ statusCode: 200, title: 'Patente eliminata', id: result.id })

    }
    catch (err) {
        console.log(err)
        res.status(200).json({ statusCode: 400, title: 'Errore interno, ti preghiamo di riprovare più tardi!' })
    }
}
