import { prisma } from '@/lib/db'
import { getSession } from 'next-auth/react'

export default async function newAutoscuolaAPI(req, res) {

    const session = await getSession({ req });

    const { allievoId, servizioCompletato } = req.body;

    try {
        const companyId = await prisma.activeCompany.findFirst({
            where: {
                userId: session.user.id
            }
        });

        const result = await prisma.allievoIstruzione.findMany({
            where: {
                companyId: companyId.isActive,
                allievoId: allievoId,
                istruzioneCompletata: servizioCompletato
            },
            include: {
                patente: true
            }
        })

        if (!result) {
            res.status(200).json({ statusCode: 200, message: 'Nessuna istruzione presente in archivio' })
        }

        res.json(result)

    } catch (err) {
        console.log(err)
    }


}
