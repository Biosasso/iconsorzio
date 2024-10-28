import { prisma } from '@/lib/db'
import { getSession } from 'next-auth/react'

export default async function handler(req, res) {

    const { allievoId } = req.body;

    const session = await getSession({ req });

    const datiAppartenenza = await prisma.usersCompanies.findFirst({
        where: {
            userId: session.user.id
        }
    })

    if (datiAppartenenza.appartenenza == 'consorzio') {
        res.json('consorzio')
        return
    }
    else {
        try {
            const getAutoscuolaId = await prisma.allievo.findFirst({
                where: {
                    id: allievoId,
                },
                select: {
                    autoscuolaId: true
                }
            });

            res.json(getAutoscuolaId.autoscuolaId)
            return
        }
        catch (err) {
            console.log(err)
            res.status(200).json({ statusCode: 400, title: 'Errore inaspettato', message: 'Errore nel caricamento dei dati, ricarica la pagina' })
        }
    }

}
