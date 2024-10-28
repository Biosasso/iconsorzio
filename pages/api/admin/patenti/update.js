import { prisma } from '@/lib/db'

export default async function handler(req, res) {

    if (req.method !== 'POST') {
        res.status(500).json('Non permesso!')
    }

    const data = req.body;

    try {
        const found = await prisma.patente.findFirst({
            where: {
                companyId: data.companyId,
                nome: data.nome
            }
        });

        if (found) {
            res.status(200).json({ statusCode: 400, title: 'Duplicato! Patente già presente nei database' })
        }
        else {
            const updateRes = await prisma.patente.update({
                data: data,
                where: {
                    id: data.id
                }
            })

            res.status(200).json({ statusCode: 200, title: 'Patente aggiornata', id: updateRes.id })
        }

    }
    catch (err) {
        console.log(err)
        res.status(200).json({ statusCode: 400, title: 'Errore interno, ti preghiamo di riprovare più tardi!' })
    }
}
