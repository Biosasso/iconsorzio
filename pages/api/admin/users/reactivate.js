//DEACTIVATE NOT DELETE

import { prisma } from '@/lib/db.ts'

export default async function handler(req, res) {

    if (req.method !== 'POST') {
        res.status(500).json('Non permesso!')
    }

    const id = req.body.id;

    try {
        const reactivateUser = await prisma.usersCompanies.update({
            where: {
                id: id,
            },
            data: {
                isActive: true
            }
        });
        res.status(200).json({ statusCode: 200, title: 'Utente riattivato correttamente', message: '' })
    }
    catch (err) {
        console.log(err)
        res.status(200).json({ statusCode: 400, message: 'Errore' })
    }



}
