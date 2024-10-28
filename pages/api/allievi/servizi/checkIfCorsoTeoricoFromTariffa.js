import { prisma } from '@/lib/db'

export default async function handler(req, res) {

    const { tariffaId } = req.body

    try {

        const result = await prisma.tariffa.findFirst({
            where: {
                id: tariffaId,
            },
            select: {
                tipo: {
                    select: {
                        tipo_cod: true
                    }
                }
            }
        })

        if (result.tipo.tipo_cod === 'corso_teorico') {
            res.json(true)
        }
        else {
            res.json(false)
        }


    }
    catch (err) {
        console.log(err)
        res.status(200).json(false)
    }
}
