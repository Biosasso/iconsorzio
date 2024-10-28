import { prisma } from '@/lib/db'
import { DateTime } from 'datetime-next';
import { getSession } from 'next-auth/react'

export default async function handler(req, res) {

    const session = await getSession({ req });

    DateTime.setDefaultLocale('it-IT');

    const companyId = req.body.companyId;
    const dataRange = req.body.dataRange

    //Elimino le ore, prima ne aggiungo una perché se è selezionata mezzanotte manca un'ora per via del LOCALE: IT
    const dataInizioUnix = new DateTime(dataRange?.rangeFrom).getUnixTimestamp();
    //.addHour(1).setHour(0).setMinute(0).setSecond(0).getUnixTimestamp();
    const dataFineUnix = new DateTime(dataRange?.rangeTo).getUnixTimestamp();
    //.addHour(1).setHour(0).setMinute(0).setSecond(0).getUnixTimestamp();

    try {

        const datiAppartenenza = await prisma.usersCompanies.findFirst({
            where: {
                userId: session.user.id
            }
        })

        if (datiAppartenenza.appartenenza === 'consorzio') {

            const result = await prisma.allievoServizio.findMany({
                where: {
                    companyId: companyId,
                    inizioServizio: {
                        gt: dataInizioUnix
                    },
                    fineServizio: {
                        lt: dataFineUnix
                    },
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
                            }
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
            res.json(result)
        }
        else {

            const result = await prisma.allievoServizio.findMany({
                where: {
                    companyId: companyId,
                    AllievoIstruzione: {
                        allievo: {
                            autoscuolaId: datiAppartenenza.autoscuolaAppartenenza,
                        },
                    },
                    inizioServizio: {
                        gt: dataInizioUnix
                    },
                    fineServizio: {
                        lt: dataFineUnix
                    },
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
                                    email: true
                                }
                            }
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

            res.json(result)

        }

    }
    catch (err) {
        console.log(err)
        res.status(200).json({ statusCode: 400, title: 'Errore inaspettato', message: 'Errore nel caricamento dei dati, ricarica la pagina' })
    }
}
