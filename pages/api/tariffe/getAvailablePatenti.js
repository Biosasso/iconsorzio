import { prisma } from '@/lib/db'

export default async function handler(req, res) {

    const companyId = req.body.companyId;
    const tariffaTipo = req.body.tariffaTipo;

    try {

        const result = await prisma.tariffa.findMany({
            where: {
                companyId: companyId,
                tariffaTipoId: tariffaTipo
            },
            select: {
                patente: {
                    select: {
                        id: true,
                        nome: true
                    }
                }
            }
        })

        if (!result) {
            res.status(200).json({ statusCode: 400, title: 'Nessuna patente presente in archivio' })
        }

        res.json(result)

    } catch (err) {
        console.log(err)
        res.status(200).json({ statusCode: 400, title: 'Errore generico, riprova più tardi' })
    }


}
