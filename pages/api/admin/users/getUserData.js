//Get User per pagina getione utenti 
import { prisma } from '../../../../lib/db.ts'
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

    const id = req.query.id

    try {
        const getActiveCompany = await prisma.activeCompany.findFirst({
            where: {
                userId: session.user.id
            }
        })

        const user = await prisma.usersCompanies.findFirst({
            where: {
                id: id
            },
            select: {
                id: true,
                user: {
                    select: {
                        profile: {
                            select: {
                                firstname: true,
                                lastname: true,
                            }
                        },
                    }
                },
                userRules: {
                    select: {
                        id: true,
                        ruleId: true,
                        userId: true
                    },
                    where: {
                        companyId: getActiveCompany.isActive
                    }
                }
            }
        })

        res.status(200).json(user)
    }
    catch (err) {
        console.log(err)
        res.status(200).json({ statusCode: 400, title: 'Errore inaspettato', message: 'Errore nel caricamento dei dati, ricarica la pagina ' })
    }
}
