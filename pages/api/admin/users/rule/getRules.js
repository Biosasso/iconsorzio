import { prisma } from '../../../../../lib/db.ts'
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {

    if (req.method !== 'GET') {
        res.status(500).json('Non permesso!')
        return;
    }

    const session = await getSession({ req });

    if (!session) {
        res.redirect(307, '/');
        return;
    }

    try {
        const getCompanyId = await prisma.activeCompany.findFirst({
            where: {
                userId: session.user.id
            }
        })

        const getRule = await prisma.rule.findMany({
            where: {
                companyId: getCompanyId.isActive
            },
            orderBy: {
                accessCode: 'asc',
            },
        })

        res.json(getRule)

    }
    catch (err) {
        res.status(200).json({ statusCode: 400, title: 'Errore inaspettato', message: 'Errore nel caricamento dei dati, ricarica la pagina ' })
    }
}
