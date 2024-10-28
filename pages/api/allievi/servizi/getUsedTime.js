import { prisma } from '@/lib/db'
import { DateTime } from 'datetime-next';

async function selectMaxTimeFromTariffa(tariffe, tariffaTipo) {
    const tariffaSelezionata = tariffe.find(el => el.id === tariffaTipo)
    if (tariffaSelezionata && tariffaSelezionata.tipo_cod === "corso_teorico") {
        return true
    }
    else {
        return false
    }

}
export default async function handler(req, res) {

    if (req.method !== 'POST') {
        res.json('Not allowed')
        return;
    }

    DateTime.setDefaultLocale('it-IT');

    const companyId = req.body.companyId;
    const veicoloId = req.body.veicoloId;
    const dataSelezionata = req.body.selectedData ? req.body.selectedData : new Date()
    const istruttoreId = req.body.istruttoreId;
    const { tariffaTipo, tariffe } = req.body

    const eveningTime = await selectMaxTimeFromTariffa(tariffe, tariffaTipo);

    //Elimino le ore, prima ne aggiungo una perché se è selezionata mezzanotte manca un'ora per via del LOCALE: IT
    const dataUnix = new DateTime(dataSelezionata).setHour(0).setMinute(0).setSecond(0).getUnixTimestamp(); //.addHour(1) RIMETTERE IN ORA LEGALE
    const domaniUnix = new DateTime(dataSelezionata).setHour(0).setMinute(0).setSecond(0).addDay(1).getUnixTimestamp(); //.addHour(1) RIMETTERE IN ORA LEGALE

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
                                },
                                {
                                    inizioServizio: {
                                        lt: domaniUnix
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
                                },
                                {
                                    inizioServizio: {
                                        lt: domaniUnix
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
                }
            })

            // result.push(
            //     {
            //         id: '1',
            //         inizioServizio: Math.floor(new Date(dataSelezionata).setHours(12, 0, 0) / 1000),
            //         fineServizio: Math.floor(new Date(dataSelezionata).setHours(12, 30, 0) / 1000),
            //         durataMinuti: 30
            //     },
            //     {
            //         id: '2',
            //         inizioServizio: Math.floor(new Date(dataSelezionata).setHours(12, 30, 0) / 1000),
            //         fineServizio: Math.floor(new Date(dataSelezionata).setHours(13, 0, 0) / 1000),
            //         durataMinuti: 30
            //     },
            //     {
            //         id: '3',
            //         inizioServizio: Math.floor(new Date(dataSelezionata).setHours(13, 0, 0) / 1000),
            //         fineServizio: Math.floor(new Date(dataSelezionata).setHours(13, 30, 0) / 1000),
            //         durataMinuti: 30
            //     },
            // )
            // if (!eveningTime) {
            //     result.push(

            //         {
            //             id: '4',
            //             inizioServizio: Math.floor(new Date(dataSelezionata).setHours(18, 0, 0) / 1000),
            //             fineServizio: Math.floor(new Date(dataSelezionata).setHours(19, 0, 0) / 1000),
            //             durataMinuti: 60
            //         },
            //         {
            //             id: '5',
            //             inizioServizio: Math.floor(new Date(dataSelezionata).setHours(19, 0, 0) / 1000),
            //             fineServizio: Math.floor(new Date(dataSelezionata).setHours(20, 0, 0) / 1000),
            //             durataMinuti: 60
            //         },
            //         {
            //             id: '6',
            //             inizioServizio: Math.floor(new Date(dataSelezionata).setHours(20, 0, 0) / 1000),
            //             fineServizio: Math.floor(new Date(dataSelezionata).setHours(21, 0, 0) / 1000),
            //             durataMinuti: 60
            //         },
            //         {
            //             id: '7',
            //             inizioServizio: Math.floor(new Date(dataSelezionata).setHours(21, 0, 0) / 1000),
            //             fineServizio: Math.floor(new Date(dataSelezionata).setHours(22, 0, 0) / 1000),
            //             durataMinuti: 60
            //         },
            //         {
            //             id: '7',
            //             inizioServizio: Math.floor(new Date(dataSelezionata).setHours(22, 0, 0) / 1000),
            //             fineServizio: Math.floor(new Date(dataSelezionata).setHours(23, 0, 0) / 1000),
            //             durataMinuti: 60
            //         },
            //     )
            // }
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
                        },
                        {
                            inizioServizio: {
                                lt: domaniUnix
                            }
                        }
                    ]
                },
                select: {
                    id: true,
                    inizioServizio: true,
                    fineServizio: true,
                    durataMinuti: true,
                }
            })

            // result.push(
            //     {
            //         id: '1',
            //         inizioServizio: Math.floor(new Date(dataSelezionata).setHours(12, 0, 0) / 1000),
            //         fineServizio: Math.floor(new Date(dataSelezionata).setHours(12, 30, 0) / 1000),
            //         durataMinuti: 30
            //     },
            //     {
            //         id: '2',
            //         inizioServizio: Math.floor(new Date(dataSelezionata).setHours(12, 30, 0) / 1000),
            //         fineServizio: Math.floor(new Date(dataSelezionata).setHours(13, 0, 0) / 1000),
            //         durataMinuti: 30
            //     },
            //     {
            //         id: '3',
            //         inizioServizio: Math.floor(new Date(dataSelezionata).setHours(13, 0, 0) / 1000),
            //         fineServizio: Math.floor(new Date(dataSelezionata).setHours(13, 30, 0) / 1000),
            //         durataMinuti: 30
            //     },
            // )
            // if (!eveningTime) {
            //     result.push(

            //         {
            //             id: '4',
            //             inizioServizio: Math.floor(new Date(dataSelezionata).setHours(18, 0, 0) / 1000),
            //             fineServizio: Math.floor(new Date(dataSelezionata).setHours(19, 0, 0) / 1000),
            //             durataMinuti: 60
            //         },
            //         {
            //             id: '5',
            //             inizioServizio: Math.floor(new Date(dataSelezionata).setHours(19, 0, 0) / 1000),
            //             fineServizio: Math.floor(new Date(dataSelezionata).setHours(20, 0, 0) / 1000),
            //             durataMinuti: 60
            //         },
            //         {
            //             id: '6',
            //             inizioServizio: Math.floor(new Date(dataSelezionata).setHours(20, 0, 0) / 1000),
            //             fineServizio: Math.floor(new Date(dataSelezionata).setHours(21, 0, 0) / 1000),
            //             durataMinuti: 60
            //         },
            //         {
            //             id: '7',
            //             inizioServizio: Math.floor(new Date(dataSelezionata).setHours(21, 0, 0) / 1000),
            //             fineServizio: Math.floor(new Date(dataSelezionata).setHours(22, 0, 0) / 1000),
            //             durataMinuti: 60
            //         },

            //     )
            // }
            res.json(result)
        }

    }
    catch (err) {
        console.log(err)
        res.status(200).json({ statusCode: 400, title: 'Errore inaspettato', message: 'Errore nel caricamento dei dati, ricarica la pagina' })
    }
}
