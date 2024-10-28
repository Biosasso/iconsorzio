import { prisma } from '@/lib/db'
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {

    const session = await getSession({ req });

    try {
        const getActiveCompany = await prisma.activeCompany.findFirst({
            where: {
                userId: session.user.id
            }
        })
        const activeSchool = await prisma.autoscuola.count({
            where: {
                companyId: getActiveCompany.isActive,
                isActive: true
            }
        });
        const deactivatedSchool = await prisma.autoscuola.count({
            where: {
                companyId: getActiveCompany.isActive,
                isActive: false
            }
        })

        res.status(200).json({ active: activeSchool, deactivated: deactivatedSchool })
    }
    catch (err) {
        console.log(err)
        res.status(200).json({ statusCode: 400, title: 'Errore inaspettato', message: 'Errore nel caricamento dei dati, ricarica la pagina ' })
    }
}
