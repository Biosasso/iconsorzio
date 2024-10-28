import { prisma } from '@/lib/db.ts'

export default async function handler(req, res) {

    const data = req.body;

    try {
        const result = await prisma.tariffa.update({
            data: data,
            where: {
                id: data.id
            },
            include: {
                tipo: true
            }
        })

        res.status(200).json({ statusCode: 200, message: 'Tariffa aggiornata', id: result.id, tipo: result.tipo.tipo_cod })
    }
    catch (err) {
        console.log(err)
        res.status(200).json({ statusCode: 400, message: 'Errore' })
    }
}
