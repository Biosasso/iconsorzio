import { prisma } from '@/lib/db'
import { DateTime } from 'datetime-next';

export default async function handler(req, res) {

    DateTime.setDefaultLocale('it-IT');

    const companyId = req.body.companyId;

    const dataSelezionata = req.body.selectedData ? req.body.selectedData : new Date()
    //Elimino le ore, prima ne aggiungo una perché se è selezionata mezzanotte manca un'ora per via del LOCALE: IT
    const dataInizioUnix = new DateTime(dataSelezionata).addHour(1).setHour(0).setMinute(0).setSecond(0).getUnixTimestamp();

    const { selectedDay, selectedType } = req.body

    const startDateFormatted = new DateTime(selectedDay).getString('YYYY-MM-DDT00:00:00.000Z')
    const startDateUnix = new DateTime(startDateFormatted).getUnixTimestamp()

    const endDateFormatted = new DateTime(selectedDay).getString('YYYY-MM-DDT23:59:59.000Z')
    const endDateUnix = new DateTime(endDateFormatted).getUnixTimestamp()


    try {

        const result = await prisma.allievoServizio.findMany({
            where: {
                companyId: companyId,
                tariffa: {
                    tipo: {
                        tipo_cod: {
                            contains: selectedType
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
            },
            orderBy: {
                inizioServizio: 'asc'
            }
        })

        res.json(result)

    }
    catch (err) {
        console.log(err)
        res.status(200).json(false)
    }
}
