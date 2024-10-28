import { prisma } from '@/lib/db.ts'
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {

    const session = await getSession({ req });

    try {

        const getActiveCompany = await prisma.activeCompany.findFirst({
            where: {
                userId: session.user.id
            }
        })

        const getBlocchiEsami = await prisma.allievoServizio.findMany({
            where: {
                companyId: getActiveCompany.isActive,
                AllievoIstruzione: {
                    allievo: {
                        nome: {
                            contains: 'admin',
                            mode: 'insensitive',
                        }
                    }
                }
            },
            select: {
                id: true,
                inizioServizio: true,
                fineServizio: true,
                durataMinuti: true,
                istruttore: {
                    select: {
                        profile: {
                            select: {
                                firstname: true,
                                lastname: true
                            }
                        }
                    }
                },
                veicolo: {
                    select: {
                        workplace: {
                            select: {
                                nome: true
                            }
                        }
                    }
                },
                tariffa: {
                    select: {
                        tipo: {
                            select: {
                                tipo_cod: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                inizioServizio: 'asc'
            }
        })

        res.json(getBlocchiEsami)

    }
    catch (err) {
        res.json([])
    }
}
