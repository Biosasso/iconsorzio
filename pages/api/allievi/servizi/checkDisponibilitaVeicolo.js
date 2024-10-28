import { prisma } from '@/lib/db'
import { DateTime } from 'datetime-next';
import { unixDateToIta } from '@/lib/utils'

export default async function handler(req, res) {

    DateTime.setDefaultLocale('it-IT');

    const companyId = req.body.companyId;
    const veicoloId = req.body.veicoloId;
    const inizioServizio = req.body.inizioServizio;
    const fineServizio = req.body.fineServizio;

    try {

        const result = await prisma.allievoServizio.count({
            where: {
                OR: [
                    {
                        inizioServizio: inizioServizio,
                    },
                    {
                        fineServizio: fineServizio,
                    },
                    {
                        AND: [{
                            inizioServizio: {
                                lt: inizioServizio,
                            },
                            fineServizio: {
                                gt: inizioServizio,
                                lt: fineServizio
                            },
                        }]

                    },
                    {
                        AND: [{
                            inizioServizio: {
                                gt: inizioServizio,
                                lt: fineServizio
                            },
                            fineServizio: {
                                gt: fineServizio
                            },
                        }]

                    },
                ],
                AND: [
                    {
                        companyId: companyId
                    },
                    {
                        veicoloId: veicoloId
                    }
                ]
            },
            // select: {
            //     inizioServizio: true
            // }
        })

        res.json(result)

    }
    catch (err) {
        console.log(err)
        res.status(200).json({ statusCode: 400, title: 'Errore inaspettato', message: 'Errore nel caricamento dei dati, ricarica la pagina' })
    }
}
