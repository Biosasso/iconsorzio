//DEACTIVATE NOT DELETE

import { prisma } from '@/lib/db.ts'

export default async function handler(req, res) {

    const id = req.body.id;

    try {
        const deactivateUser = await prisma.autoscuola.update({
            where: {
                id: id,
            },
            data: {
                isActive: true
            }
        });
        res.status(200).json({ statusCode: 200, title: 'Autoscuola riattivata', message: false })
    }
    catch (err) {
        console.log(err)
        res.status(200).json({ statusCode: 400, message: 'Errore' })
    }



}
