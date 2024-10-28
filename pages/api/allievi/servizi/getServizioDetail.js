import { prisma } from '@/lib/db'

export default async function handler(req, res) {

    const { id } = req.body

    try {

        const result = await prisma.allievoServizio.findFirst({
            where: {
                id: id
            },
            select: {
                AllievoIstruzione: {
                    select: {
                        patente: {
                            select: {
                                nome: true
                            }
                        },
                        allievo: {
                            select: {
                                nome: true,
                                cognome: true
                            }
                        }
                    }
                }
            }
        })

        if (!result) {
            res.status(200).json({ statusCode: 200, message: 'Nessuna istruzione presente in archivio' })
        }

        res.json(result)

    } catch (err) {
        console.log(err)
    }


}
