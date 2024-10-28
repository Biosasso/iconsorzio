import { prisma } from '@/lib/db'
import { getSession } from 'next-auth/react'

export default async function newAutoscuolaAPI(req, res) {

    const session = await getSession({ req });

    const { allievoName } = req.body;

    try {
        const companyId = await prisma.activeCompany.findFirst({
            where: {
                userId: session.user.id
            }
        });

        const result = await prisma.allievoIstruzione.findFirst({
            where: {
                companyId: companyId.isActive,
                allievo: {
                    nome: {
                        contains: allievoName,
                        mode: 'insensitive',
                    }
                }
            },
            select: {
                id: true
            }
        })

        if (!result) {
            res.status(200).json({ statusCode: 200, message: 'Nessuna istruzione presente in archivio' })
        }

        res.json(result.id)

    } catch (err) {
        console.log(err)
    }


}
