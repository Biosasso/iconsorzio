import { prisma } from '../../../../../lib/db.ts'
import { getSession } from 'next-auth/react'

export default async function handler(req, res) {

    if (req.method !== 'POST') {
        res.status(500).json('Non permesso!')
    }

    const session = await getSession({ req });

    if (!session) {
        res.redirect(307, '/');
        return;
    }

    const data = req.body;

    try {
        const getCompanyId = await prisma.activeCompany.findFirst({
            where: {
                userId: session.user.id
            }
        })

        const createUserRule = await prisma.userRules.create({
            data: {
                companyId: getCompanyId.isActive,
                ruleId: data.ruleId,
                userId: data.userId
            },
        })

        res.status(200).json({ statusCode: 200, message: 'Aggiornamento avvernuto con successo' })
    }
    catch (err) {
        console.log(err)
        res.status(200).json({ statusCode: 400 })
    }
}
