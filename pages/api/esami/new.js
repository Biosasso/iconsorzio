import { prisma } from '@/lib/db'
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {

    const session = await getSession({ req });

    const { data } = req.body

    try {

        const getActiveCompany = await prisma.activeCompany.findFirst({
            where: {
                userId: session.user.id
            }
        })

        const getTariffa = await prisma.tariffa.findFirst({
            where: {
                companyId: getActiveCompany.isActive,
                tipo: {
                    tipo_cod: {
                        contains: 'preesame',
                        mode: 'insensitive',
                    }
                }
            }
        })

        const getIstruzioneId = await prisma.allievoIstruzione.findFirst({
            where: {
                companyId: getActiveCompany.isActive,
                allievo: {
                    nome: {
                        contains: 'admin',
                        mode: 'insensitive',
                    }
                }
            },
            select: {
                id: true
            }
        })

        const result = await prisma.allievoServizio.createMany({
            data: data
        })

        res.json(result);

    } catch (err) {
        console.log(err)
        res.status(200).json({ statusCode: 400, title: 'Errore generico, riprova!' })

    }

}
