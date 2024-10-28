import { prisma } from '@/lib/db.ts'
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {

    const session = await getSession({ req });

    const id = req.query.aid;


    try {

        const activeCompany = await prisma.activeCompany.findFirst({
            where: {
                userId: session.user.id
            }
        })

        const getAutoscuola = await prisma.autoscuola.findFirst({
            where: {
                companyId: activeCompany.isActive,
                id: id
            }
        })

        if (!getAutoscuola) {
            res.status(200).json({ statusCode: 100, message: 'Nessuna autoscuola presente in archivio' })
        }

        res.json(getAutoscuola)

    } catch (err) {
        console.log(err)
    }


}
