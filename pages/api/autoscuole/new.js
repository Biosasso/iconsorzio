import { prisma } from '@/lib/db'

export default async function newAutoscuolaAPI(req, res) {

    if (req.method !== 'POST') {
        return;
    }

    const data = req.body;

    try {
        const createAutoscuola = await prisma.autoscuola.create({
            data: data,
        })
        res.status(200).json({ statusCode: 200, message: 'ok' })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ statusCode: 400, fields: err.meta?.target })
    }



}
