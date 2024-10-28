import { prisma } from '@/lib/db'
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {

    const session = await getSession({ req });

    const id = req.body.id;
    const codMotorizzazione = req.body.codMotorizzazione;

    try {

        const activeCompany = await prisma.activeCompany.findFirst({
            where: {
                userId: session.user.id
            }
        })

        const autoscuolaExist = await prisma.autoscuola.count({
            where: {
                companyId: activeCompany.isActive,
                codMotorizzazione: codMotorizzazione
            }
        });

        if (autoscuolaExist === 0) {
            res.status(200).json({ statusCode: 200, title: "Codice Motorizzazione disponibile" })
        }
        else {
            const autoscuolaFound = await prisma.autoscuola.findFirst({
                where: {
                    companyId: activeCompany.isActive,
                    codMotorizzazione: codMotorizzazione
                },
                select: {
                    id: true
                }
            })

            if (autoscuolaFound.id === id) {
                res.status(200).json({ statusCode: 200, title: "Cod Motorizzazione non modificato" })
            }
            else {
                res.status(200).json({ statusCode: 400, autoscuolaFound: autoscuolaFound.id, title: "Cod Motorizzazione NON disponibile", message: "L'autoscuola esiste già! Verrai spostato nella sua pagina per vedere i dettagli! Verifica che l'autoscuola non sia stata disattivata, puoi sempre riattivarla." })
            }

        }

    }
    catch (err) {
        console.log(err)
        res.status(200).json({ statusCode: 400, title: 'Errore inaspettato', message: 'Errore nel caricamento dei dati, ricarica la pagina ' })
    }
}
