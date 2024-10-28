import { prisma } from '@/lib/db.ts'
import { getSession } from 'next-auth/react';
import { DateTime } from 'datetime-next';


export default async function handler(req, res) {

    const session = await getSession({ req });

    const { selectedDay } = req.body

    const startDateFormatted = new DateTime(selectedDay).getString('YYYY-MM-DDT00:00:00.000Z')

    //Elimino le ore, prima ne aggiungo una perché se è selezionata mezzanotte manca un'ora per via del LOCALE: IT
    const dataUnix = new DateTime(startDateFormatted).setHour(0).setMinute(0).setSecond(0).getUnixTimestamp(); //.addHour(1) RIMETTERE IN ORA LEGALE
    const domaniUnix = new DateTime(startDateFormatted).setHour(0).setMinute(0).setSecond(0).addDay(1).getUnixTimestamp(); //.addHour(1) RIMETTERE IN ORA LEGALE

    try {
        const getActiveCompany = await prisma.activeCompany.findFirst({
            where: {
                userId: session.user.id
            }
        })
        //controllo se nella data selezionata ci sono esami
        const checkEsami = await prisma.allievoServizio.count({
            where: {
                companyId: getActiveCompany.isActive,
                inizioServizio: {
                    gt: dataUnix,
                    lt: domaniUnix
                },
                tariffa: {
                    tipo: {
                        tipo_cod: {
                            contains: 'esame',
                            mode: 'insensitive',
                        }
                    }
                }
            }
        })

        res.json({ statusCode: 200, bloccoGiaAttivo: checkEsami > 0 ? true : false })

    }
    catch (err) {
        res.status(200).json({ statusCode: 400, title: 'Errore inaspettato', message: 'Errore nel caricamento dei dati, ricarica la pagina ' })
    }
}
