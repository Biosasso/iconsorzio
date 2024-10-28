import { prisma } from '@/lib/db'

export default async function handler(req, res) {

    if (req.method !== 'POST') {
        res.status(500).json('Non permesso!')
    }

    const data = req.body;

    try {
        const found = await prisma.workplace.findFirst({
            where: {
                companyId: data.companyId,
                nome: data.nome
            }
        });

        if (found) {
            res.status(200).json({ statusCode: 400, title: 'Duplicato! Workplace già presente nei database' })
        }
        else {
            const result = await prisma.workplace.update({
                data: data,
                where: {
                    id: data.id
                }
            })

            res.status(200).json({ statusCode: 200, title: 'Workplace aggiornata', id: result.id })
        }

    }
    catch (err) {
        console.log(err)
        res.status(200).json({ statusCode: 400, title: 'Errore interno, ti preghiamo di riprovare più tardi!' })
    }
}
