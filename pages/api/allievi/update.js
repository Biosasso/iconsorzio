import { prisma } from '@/lib/db'

export default async function handler(req, res) {

    const data = req.body;

    try {
        const result = await prisma.allievo.update({
            data: data,
            where: {
                id: data.id
            }
        })

        res.status(200).json({ statusCode: 200, title: 'I dati allievo sono stati aggiornati correttamente' })
    }
    catch (err) {
        console.log(err)
        res.status(200).json({ statusCode: 400, title: 'Errore sconosciuto, ti preghiamo di riprovare più tardi o di controllare i dati inseriti' })
    }
}
