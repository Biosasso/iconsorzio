import { prisma } from '@/lib/db'

export default async function handler(req, res) {

    const { companyId } = req.body;

    try {

        const result = await prisma.veicolo.findMany({
            where: {
                companyId: companyId,
            },
            include: {
                Patenti: {
                    select: {
                        patente: true
                    }
                },
                workplace: true
            },
            orderBy: {
                nome: 'asc',
            },
        })

        res.json(result)

    }
    catch (err) {
        console.log(err)
        res.status(200).json({ statusCode: 400, title: 'Errore inaspettato', message: 'Errore nel caricamento dei dati, ricarica la pagina' })
    }
}
