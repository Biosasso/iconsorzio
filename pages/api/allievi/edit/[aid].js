import { prisma } from '@/lib/db'

export default async function handler(req, res) {

    const id = req.query.aid;

    try {

        const result = await prisma.allievo.findFirst({
            where: {
                id: id
            },
            include: {
                AllievoIstruzioni: {
                    include: {
                        patente: true,
                        AllievoServizi: {
                            include: {
                                tariffa: {
                                    include: {
                                        patente: true,
                                        tipo: true
                                    }
                                },
                                istruttore: {
                                    include: {
                                        profile: true
                                    }
                                },
                            },
                            orderBy: {
                                inizioServizio: 'desc'
                            },
                        },

                    }
                }
            }
        })

        res.json(result)

    } catch (err) {
        console.log(err)
        res.status(200).json({ statusCode: 400, message: 'Errore nel caricamento dei dati' })
    }


}
