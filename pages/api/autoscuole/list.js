import { prisma } from '../../../lib/db.ts'
import { getSession } from 'next-auth/react'

export default async function newAutoscuolaAPI(req, res) {

    const session = await getSession({ req });

    try {
        const getActiveCompany = await prisma.activeCompany.findFirst({
            where: {
                userId: session.user.id
            }
        });

        const datiAppartenenza = await prisma.usersCompanies.findFirst({
            where: {
                userId: session.user.id
            }
        })

        if (datiAppartenenza.appartenenza === 'consorzio') {

            const getAutoscuole = await prisma.autoscuola.findMany({
                where: {
                    companyId: getActiveCompany.isActive,
                    NOT: {
                        denominazione: {
                            contains: 'admin',
                            mode: 'insensitive',
                        }
                    }
                }
            })

            if (!getAutoscuole) {
                res.status(200).json({ statusCode: 100, message: 'Nessuna autoscuola presente in archivio' })
            }

            res.json(getAutoscuole)

        }
        else {

            const getAutoscuole = await prisma.autoscuola.findMany({
                where: {
                    companyId: getActiveCompany.isActive,
                    id: datiAppartenenza.autoscuolaAppartenenza,
                    NOT: {
                        denominazione: {
                            contains: 'admin',
                            mode: 'insensitive',
                        }
                    }
                }
            })

            if (!getAutoscuole) {
                res.status(200).json({ statusCode: 100, message: 'Nessuna autoscuola presente in archivio' })
            }

            res.json(getAutoscuole)

        }

    } catch (err) {
        console.log(err)
    }


}
