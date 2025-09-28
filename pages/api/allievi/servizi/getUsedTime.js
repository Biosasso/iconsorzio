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

    // Correzione fuso orario: gestisce correttamente il timezone locale
    let dataUnix, domaniUnix;
    
    if (typeof dataSelezionata === 'number') {
        // Gestisce timestamp Unix ricevuti dal fetcher
        const dataDate = new Date(dataSelezionata * 1000);
        const year = dataDate.getFullYear();
        const month = dataDate.getMonth();
        const day = dataDate.getDate();
        
        // Crea date locali per mezzanotte del giorno selezionato
        const dataLocale = new Date(year, month, day, 0, 0, 0);
        const domaniLocale = new Date(year, month, day + 1, 0, 0, 0);
        
        dataUnix = Math.floor(dataLocale.getTime() / 1000);
        domaniUnix = Math.floor(domaniLocale.getTime() / 1000);
        
        console.log('DEBUG getUsedTime API (Unix timestamp):', {
            dataSelezionata,
            dataDate: dataDate.toISOString(),
            dataLocale: dataLocale.toISOString(),
            domaniLocale: domaniLocale.toISOString(),
            dataUnix,
            domaniUnix,
            year, month, day
        });
    } else if (dataSelezionata instanceof Date) {
        // Usa il timezone del browser per creare date locali corrette
        const year = dataSelezionata.getFullYear();
        const month = dataSelezionata.getMonth();
        const day = dataSelezionata.getDate();
        
        // Crea date locali per mezzanotte del giorno selezionato
        // Usa il timezone del browser invece di UTC
        const dataLocale = new Date(year, month, day, 0, 0, 0);
        const domaniLocale = new Date(year, month, day + 1, 0, 0, 0);
        
        dataUnix = Math.floor(dataLocale.getTime() / 1000);
        domaniUnix = Math.floor(domaniLocale.getTime() / 1000);
        
        // Debug log per verificare le date
        console.log('DEBUG getUsedTime API (Date):', {
            dataSelezionata: dataSelezionata.toISOString(),
            dataLocale: dataLocale.toISOString(),
            domaniLocale: domaniLocale.toISOString(),
            dataUnix,
            domaniUnix,
            year, month, day,
            timezoneOffset: dataSelezionata.getTimezoneOffset()
        });
    } else {
        // Fallback per stringhe - usa DateTime per parsing sicuro
        const dataString = dataSelezionata;
        dataUnix = new DateTime(dataString).setHour(0).setMinute(0).setSecond(0).getUnixTimestamp();
        domaniUnix = new DateTime(dataString).setHour(0).setMinute(0).setSecond(0).addDay(1).getUnixTimestamp();
        
        console.log('DEBUG getUsedTime API (string):', {
            dataString,
            dataUnix,
            domaniUnix
        });
    }

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
