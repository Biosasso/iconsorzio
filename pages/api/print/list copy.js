import { prisma } from '@/lib/db'
import { DateTime } from 'datetime-next';
import { unixDateToIta } from '@/lib/utils'

export default async function handler(req, res) {

    DateTime.setDefaultLocale('it-IT');

    const companyId = req.body.companyId;

    const dataSelezionata = req.body.selectedData ? req.body.selectedData : new Date()
    //Elimino le ore, prima ne aggiungo una perché se è selezionata mezzanotte manca un'ora per via del LOCALE: IT
    const dataInizioUnix = new DateTime(dataSelezionata).addHour(1).setHour(0).setMinute(0).setSecond(0).getUnixTimestamp();

    try {

        const result = await prisma.allievoServizio.findMany({
            where: {
                companyId: companyId,
                inizioServizio: {
                    gt: dataInizioUnix
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

        res.json(result)

    }
    catch (err) {
        console.log(err)
        res.status(200).json({ statusCode: 400, title: 'Errore inaspettato', message: 'Errore nel caricamento dei dati, ricarica la pagina' })
    }
}
