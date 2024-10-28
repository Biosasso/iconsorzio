import { prisma } from '@/lib/db.ts'
import { getSession } from 'next-auth/react';
import { DateTime } from 'datetime-next';


export default async function handler(req, res) {

    const session = await getSession({ req });

    const { startDate, endDate } = req.body

    const startDateFormatted = new DateTime(startDate).getString('YYYY-MM-DDT00:00:00.000Z')
    const startDateUnix = new DateTime(startDateFormatted).getUnixTimestamp()

    const endDateFormatted = new DateTime(endDate).getString('YYYY-MM-DDT23:59:59.000Z')
    const endDateUnix = new DateTime(endDateFormatted).getUnixTimestamp()

    try {

        const getActiveCompany = await prisma.activeCompany.findFirst({
            where: {
                userId: session.user.id
            }
        })

        const getList = await prisma.allievoServizio.findMany({
            where: {
                companyId: getActiveCompany.isActive,
                tariffa: {
                    tipo: {
                        tipo_cod: {
                            contains: 'esame'
                        }
                    }
                },
                AND: [{
                    inizioServizio: {
                        gte: startDateUnix
                    },
                    fineServizio: {
                        lte: endDateUnix
                    }
                }],
                AllievoIstruzione: {
                    allievo: {
                        NOT: {
                            nome: {
                                contains: 'admin',
                                mode: 'insensitive',
                            }
                        }
                    }
                }
            },
            orderBy: {
                inizioServizio: 'asc',
            },
            select: {
                id: true,
                inizioServizio: true,
                fineServizio: true,
                durataMinuti: true,
                AllievoIstruzione: {
                    select: {
                        allievo: {
                            select: {
                                id: true,
                                nome: true,
                                cognome: true,
                                tel: true,
                                email: true,
                                autoscuola: {
                                    select: {
                                        denominazione: true
                                    }
                                }
                            }
                        },
                        patente: {
                            select: {
                                nome: true
                            }
                        },
                        id: true
                    }
                },
                tariffa: {
                    select: {
                        tipo: true
                    }
                },
                veicolo: true,
                istruttore: {
                    select: {
                        profile: true
                    }
                }
            }

        })
        res.json(getList)

    }
    catch (err) {
        res.status(200).json({ statusCode: 400, title: 'Errore inaspettato', message: 'Errore nel caricamento dei dati, ricarica la pagina ' })
    }
}
