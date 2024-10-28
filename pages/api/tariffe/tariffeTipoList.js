import { prisma } from '@/lib/db'
import { getSession } from 'next-auth/react'

export default async function handler(req, res) {

    const session = await getSession({ req });

    try {
        const activeCompany = await prisma.activeCompany.findFirst({
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

            const tariffeTipo = await prisma.tariffaTipo.findMany({
                where: {
                    companyId: activeCompany.isActive,
                },
                include: {
                    Tariffe: {
                        include: {
                            patente: true
                        }
                    },
                    _count: {
                        select: {
                            Tariffe: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'asc'
                }

            })

            if (!tariffeTipo) {
                res.status(200).json({ statusCode: 100, message: 'Nessuna tipologia di tariffa presente in archivio' })
            }

            res.json(tariffeTipo)
        }
        else {
            const tariffeTipo = await prisma.tariffaTipo.findMany({
                where: {
                    companyId: activeCompany.isActive,
                    tipo_cod: 'guida'
                },
                include: {
                    Tariffe: {
                        include: {
                            patente: true
                        }
                    },
                    _count: {
                        select: {
                            Tariffe: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'asc'
                }

            })

            if (!tariffeTipo) {
                res.status(200).json({ statusCode: 100, message: 'Nessuna tipologia di tariffa presente in archivio' })
            }

            res.json(tariffeTipo)
        }

    } catch (err) {
        console.log(err)
    }


}
