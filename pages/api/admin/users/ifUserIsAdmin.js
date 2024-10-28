import { prisma } from '@/lib/db'
import { getSession } from 'next-auth/react'

export default async function handler(req, res) {

    if (req.method !== 'GET') {
        res.status(500).json('Non permesso!')
    }

    const session = await getSession({ req });

    if (!session) {
        res.redirect(307, '/');
        return;
    }

    try {

        const getActiveCompany = await prisma.activeCompany.findFirst({
            where: {
                userId: session.user.id
            }
        });


        const result = await prisma.usersCompanies.findFirst({
            where: {
                companyId: getActiveCompany.isActive,
                userId: session.user.id,
            },
            select: {
                rulesGroup: true
            }
        });

        if (result.rulesGroup.name.includes('Admin') || result.rulesGroup.name.includes('admin')) {
            res.json(true)
        }
        else {
            res.json(false)
        }

    } catch (err) {
        res.json({ statusCode: 400 })
        console.log(err)
    }
}