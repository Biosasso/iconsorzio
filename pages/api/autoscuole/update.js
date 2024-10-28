import { prisma } from '../../../lib/db.ts'

export default async function newAutoscuolaAPI(req, res) {

    if (req.method !== 'POST') {
        return;
    }

    const data = req.body.data;
    const where = req.body.where;

    try {
        const createAutoscuola = await prisma.autoscuola.update({
            where: {
                id: data.id
            },
            data: data,
        })

        res.status(200).json({ statusCode: 200, message: 'ok' })
    }
    catch (err) {
        console.log(err)
        res.status(200).json({ statusCode: 400, fields: err.meta.target })
    }
}
