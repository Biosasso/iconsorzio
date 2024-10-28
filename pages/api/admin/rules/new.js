import { prisma } from '@/lib/db'

export default async function createRuleAPI(req, res) {

    if (req.method !== 'POST') {
        res.status(500).json('Non permesso!')
    }

    const { data } = req.body;

    try {

        const newRule = await prisma.rule.create({
            data: data
        })
        res.status(200).json({ statusCode: 200, message: 'Ruolo inserito' })

    } catch (err) {

        res.status(200).json({ statusCode: 400, message: 'Errore' })

    }

}
