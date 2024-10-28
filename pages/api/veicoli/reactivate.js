import { prisma } from '@/lib/db'

export default async function handler(req, res) {

    const data = req.body;

    try {

        const result = await prisma.veicolo.update({
            where: {
                id: data.id
            },
            data: {
                isActive: true
            }
        })

        res.status(200).json({ statusCode: 200, title: 'Veicolo riattivato', id: result.id })

    }
    catch (err) {
        console.log(err)
        res.status(200).json({ statusCode: 400, title: 'Errore interno, ti preghiamo di riprovare più tardi!' })
    }
}
