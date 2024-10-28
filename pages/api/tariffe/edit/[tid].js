import { prisma } from '@/lib/db.ts'
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {

    const session = await getSession({ req });

    const id = req.query.tid;


    try {

        const getTariffa = await prisma.tariffa.findFirst({
            where: {
                id: id
            }
        })

        if (!getTariffa) {
            res.status(200).json({ statusCode: 100, message: 'Nessuna tariffa presente in archivio' })
        }

        res.json(getTariffa)

    } catch (err) {
        console.log(err)
    }


}
