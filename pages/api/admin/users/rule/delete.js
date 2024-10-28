import { prisma } from '../../../../../lib/db.ts'

export default async function handler(req, res) {

    if (req.method !== 'POST') {
        res.status(500).json('Non permesso!')
    }

    const id = req.body.id;

    try {

        const deleteUserRule = await prisma.userRules.delete({
            where: {
                id: id
            }
        });
        res.json({ statusCode: 200, title: 'Ruolo eliminato', message: '' })
    }
    catch (err) {
        console.log(err)
        res.json({ statusCode: 400, message: 'Errore' })
    }



}
