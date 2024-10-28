import { prisma } from '@/lib/db.ts'

export default async function handler(req, res) {

    const data = req.body;

    try {
        const newTariffaTipo = await prisma.tariffaTipo.create({
            data: data
        })

        res.status(200).json({ statusCode: 200, message: 'Tipologia di tariffa inserita', id: newTariffaTipo.id })
    }
    catch (err) {
        console.log(err)
        res.status(200).json({ statusCode: 400, message: 'Errore' })
    }
}
