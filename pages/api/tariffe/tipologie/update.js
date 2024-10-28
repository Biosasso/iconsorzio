import { prisma } from '@/lib/db'

export default async function handler(req, res) {

    const data = req.body;

    try {
        const found = await prisma.tariffaTipo.findFirst({
            where: {
                companyId: data.companyId,
                tipo_cod: data.tipo_cod
            }
        });

        console.log(found)
        if (found) {
            res.status(200).json({ statusCode: 400, message: 'Duplicato! Tipologia già presente nei database' })
        }
        else {
            const updateRes = await prisma.tariffaTipo.update({
                data: data,
                where: {
                    id: data.id
                }
            })

            res.status(200).json({ statusCode: 200, message: 'Tipologia tariffa aggiornata', id: updateRes.id })
        }

    }
    catch (err) {
        console.log(err)
        res.status(200).json({ statusCode: 400, message: 'Errore' })
    }
}
