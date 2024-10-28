import { prisma } from '@/lib/db'

export default async function handler(req, res) {

    if (req.method !== 'POST') {
        res.status(500).json('Non permesso!')
    }

    const { id, newLimite } = req.body;

    try {

        const result = await prisma.autoscuola.update({
            where: {
                id: id
            },
            data: {
                limitePrenotazioni: newLimite
            },
        })
        res.status(200).json({ statusCode: 200, title: 'Limite aggiornato', updatedLimite: result.limitePrenotazioni, id: result.id })
    }
    catch (err) {
        console.log(err)
        res.status(200).json({ statusCode: 400, title: 'Errore interno, ti preghiamo di riprovare più tardi!' })
    }
}
