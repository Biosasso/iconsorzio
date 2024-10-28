import { prisma } from '@/lib/db'
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {

    if (req.method !== 'POST') {
        res.status(500).json('Non permesso!')
    }

    const session = await getSession({ req });

    if (!session) {
        res.redirect(307, '/');
        return;
    }

    const rulesGroupDescription = req.body.rulesGroupDescription;

    try {
        const getActiveCompany = await prisma.activeCompany.findFirst({
            where: {
                userId: session.user.id
            }
        })
        const activeUsers = await prisma.usersCompanies.findMany({
            select: {
                id: true,
                isActive: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        profile: true,
                    },

                },
                rulesGroup: {
                    select: {
                        name: true
                    },
                },
            },
            where: {
                companyId: getActiveCompany.isActive,
                isActive: true,
                AND: {
                    rulesGroup: {
                        name: {
                            equals: rulesGroupDescription,
                        }
                    }
                }
            }
        })

        res.json(activeUsers)
    }
    catch (err) {
        console.log(err)
        res.status(200).json({ statusCode: 400, title: 'Errore inaspettato', message: 'Errore nel caricamento dei dati, ricarica la pagina ' })
    }
}
