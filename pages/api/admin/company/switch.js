import { prisma } from '@/lib/db';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {

    if (req.method !== 'POST') {
        res.status(500).json('Non permesso!')
    }

    const session = await getSession({ req });

    const userId = session.user.id;
    const selected = req.body.selected;

    try {
        const updateActive = await prisma.activeCompany.update({
            where: {
                userId: userId
            },
            data: {
                isActive: selected
            }
        });
        res.json({ statusCode: 200, message: 'Aggiornamento riuscito!' })
    }
    catch (err) {
        console.log(err)
        res.json({ statusCode: 500, message: 'Errore, riprova più tardi' })
    }
}