import { prisma } from '@/lib/db'
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {

    const session = await getSession({ req });

    try {
        const companyId = await prisma.activeCompany.findFirst({
            where: {
                userId: session.user.id
            }
        });

        const datiAppartenenza = await prisma.usersCompanies.findFirst({
            where: {
                userId: session.user.id
            }
        })

        if (datiAppartenenza.appartenenza === 'consorzio') {

            const istruzioniInCorso = await prisma.allievoIstruzione.findMany({
                where: {
                    companyId: companyId.isActive,
                    istruzioneCompletata: false,
                    NOT: {
                        marcaOperativa: {
                            contains: 'admin'
                        }
                    }
                },
                distinct: ['allievoId']
            })
            const istruzioniCompletate = await prisma.allievoIstruzione.findMany({
                where: {
                    companyId: companyId.isActive,
                    istruzioneCompletata: true,
                    NOT: {
                        marcaOperativa: {
                            contains: 'admin'
                        }
                    }
                },
                distinct: ['allievoId']
            })
            res.status(200).json({ active: istruzioniInCorso.length, deactivated: istruzioniCompletate.length })
        }
        else {

            const istruzioniInCorso = await prisma.allievoIstruzione.findMany({
                where: {
                    companyId: companyId.isActive,
                    istruzioneCompletata: false,
                    allievo: {
                        autoscuolaId: datiAppartenenza.autoscuolaAppartenenza
                    }
                },
                distinct: ['allievoId']
            })

            const istruzioniCompletate = await prisma.allievoIstruzione.findMany({
                where: {
                    companyId: companyId.isActive,
                    istruzioneCompletata: true,
                    allievo: {
                        autoscuolaId: datiAppartenenza.autoscuolaAppartenenza
                    }
                },
                distinct: ['allievoId']
            })

            res.status(200).json({ active: istruzioniInCorso.length, deactivated: istruzioniCompletate.length })
        }

    }
    catch (err) {
        console.log(err)
        res.status(200).json({ statusCode: 400, title: 'Errore inaspettato', message: 'Errore nel caricamento dei dati, ricarica la pagina ' })
    }
}
