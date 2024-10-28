import { prisma } from '@/lib/db'
import { DateTime } from 'datetime-next';
import { unixDateToIta } from '@/lib/utils'

export default async function handler(req, res) {

    DateTime.setDefaultLocale('it-IT');

    const companyId = req.body.companyId;
    const veicoloId = req.body.veicoloId;
    const dataSelezionata = req.body.selectedData ? req.body.selectedData : new Date()
    const istruttoreId = req.body.istruttoreId;
    //Elimino le ore, prima ne aggiungo una perché se è selezionata mezzanotte manca un'ora per via del LOCALE: IT
    const dataUnix = new DateTime(dataSelezionata).setHour(0).setMinute(0).setSecond(0).getUnixTimestamp(); //addHour(1) RIMETTERE IN ORA LEGALE

    try {

        const controlloSeIstruttoreGenerico = await prisma.usersCompanies.findFirst({
            where: {
                companyId: companyId,
                userId: istruttoreId,
            },
            include: {
                user: true
            }
        });

        if (controlloSeIstruttoreGenerico.user.email !== 'istruttoregenerico@iconsorzio.it') {
            const result = await prisma.allievoServizio.findMany({
                where: {
                    OR: [
                        {
                            AND: [
                                {
                                    companyId: companyId
                                },
                                {
                                    veicoloId: veicoloId
                                },
                                {
                                    inizioServizio: {
                                        gt: dataUnix
                                    }
                                }
                            ]
                        },
                        {
                            AND: [
                                {
                                    companyId: companyId
                                },
                                {
                                    istruttoreId: istruttoreId
                                },
                                {
                                    inizioServizio: {
                                        gt: dataUnix
                                    }
                                }
                            ]
                        }
                    ]

                },
                select: {
                    id: true,
                    inizioServizio: true,
                    fineServizio: true,
                    durataMinuti: true,
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
                    AND: [
                        {
                            companyId: companyId
                        },
                        {
                            veicoloId: veicoloId
                        },
                        {
                            inizioServizio: {
                                gt: dataUnix
                            }
                        }
                    ]

                },
                select: {
                    id: true,
                    inizioServizio: true,
                    fineServizio: true,
                    durataMinuti: true,
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
