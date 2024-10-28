import { prisma } from '@/lib/db';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {

    if (req.method !== 'GET') {
        res.status(500).json('Non permesso!')
        return;
    }

    const session = await getSession({ req });

    if (!session) {
        res.redirect(307, '/');
        return;
    }

    try {

        const companies = await prisma.usersCompanies.findMany({
            where: {
                userId: session.user.id
            },
            include: {
                company: {
                    select: {
                        vat: true,
                        profile: true
                    }
                }
            }
        });

        res.json(companies)
    }
    catch (err) {
        console.log(err)
        res.json({ statusCode: 500, message: 'Errore, riprova più tardi' })
    }
}