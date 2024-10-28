import { prisma } from '@/lib/db'
import { getSession } from 'next-auth/react'

export default async function handler(req, res) {

    const session = await getSession({ req });

    const tariffaTipo = req.body.tariffaTipo ? req.body.tariffaTipo : 'Guida';

    try {
        const activeCompany = await prisma.activeCompany.findFirst({
            where: {
                userId: session.user.id
            }
        });

        const tariffe = await prisma.tariffa.findMany({
            where: {
                companyId: activeCompany.isActive,
                tipo: {
                    tipo_cod: {
                        contains: tariffaTipo,
                        mode: 'insensitive',
                    }
                }
            },
            include: {
                patente: {
                    select: {
                        nome: true
                    }
                }
            }
        })

        if (!tariffe) {
            res.status(200).json({ statusCode: 400, title: 'Nessuna tariffa presente in archivio' })
        }

        res.json(tariffe)

    } catch (err) {
        console.log(err)
        res.status(200).json({ statusCode: 400, title: 'Errore generico, riprova più tardi' })
    }


}
