import { prisma } from '@/lib/db.ts'

export default async function handler(req, res) {

    if (req.method !== 'POST') {
        res.status(500).json('Non permesso!')
    }

    const data = req.body;

    try {
        const newGroup = await prisma.rulesGroup.create({
            data: data
        })

        res.status(200).json({ statusCode: 200, message: 'Gruppo inserito', createdGroup: newGroup })
    }
    catch (err) {
        console.log(err)
        res.status(200).json({ statusCode: 400, message: 'Errore' })
    }
}
