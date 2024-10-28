import { prisma } from '@/lib/db'

export default async function handler(req, res) {

    const data = req.body;

    try {

        const found = await prisma.veicolo.findMany({
            where: {
                AND: [
                    {
                        companyId: data.companyId,
                    },
                    {
                        targa: data.targa
                    }
                ]
            }
        })
        if (found.length > 0) {
            res.status(200).json({ statusCode: 400, title: 'La targa inserita è già presente nel database' })
        }
        else {
            const result = await prisma.veicolo.create({
                data: data
            })
            res.status(200).json({ statusCode: 200, title: 'Veicolo inserito', id: result.id })
        }




    } catch (err) {
        console.log(err)
        res.status(200).json({ statusCode: 400, title: 'Errore generico, riprova!' })

    }

}
