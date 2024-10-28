import { prisma } from '@/lib/db'
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {

    if (req.method !== 'GET') {
        res.status(500).json('Non permesso!')
    }

    const session = await getSession({ req });

    if (!session) {
        res.redirect(307, '/');
        return;
    }

    try {
        const getActiveCompany = await prisma.activeCompany.findFirst({
            where: {
                userId: session.user.id
            }
        })
        const activeUser = await prisma.usersCompanies.count({
            where: {
                companyId: getActiveCompany.isActive,
                isActive: true
            }
        });
        const deactivatedUser = await prisma.usersCompanies.count({
            where: {
                companyId: getActiveCompany.isActive,
                isActive: false
            }
        })

        if (!activeUser) {
            res.status(200).json({ statusCode: 400, title: 'Errore inaspettato', message: 'Errore nel caricamento dei dati, ricarica la pagina' })
        }
        res.status(200).json({ active: activeUser, deactivated: deactivatedUser })
    }
    catch (err) {
        console.log(err)
        res.status(200).json({ statusCode: 400, title: 'Errore inaspettato', message: 'Errore nel caricamento dei dati, ricarica la pagina ' })
    }
}
