import { prisma } from '@/lib/db.ts'
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {

    const session = await getSession({ req });

    const id = req.query.tid;

    try {

        const getTariffaTipo = await prisma.tariffaTipo.findFirst({
            where: {
                id: id
            }
        })

        if (!getTariffaTipo) {
            res.status(200).json({ statusCode: 100, message: 'Nessuna tariffa presente in archivio' })
        }

        res.json(getTariffaTipo)

    } catch (err) {
        console.log(err)
    }


}
