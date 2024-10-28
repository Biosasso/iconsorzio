import { prisma } from '../../../../lib/db.ts'

export default async function handler(req, res) {

    if (req.method !== 'GET') {
        res.status(500).json('Non permesso!')
    }

    const { uid } = req.query

    try {

        const user = await prisma.usersCompanies.findFirst({
            where: {
                id: uid
            },
            select: {
                id: true,
                companyId: true,
                isActive: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        profile: true,
                    }
                },
                rulesGroup: {
                    select: {
                        id: true,
                        name: true
                    },
                },
                appartenenza: true,
                autoscuolaAppartenenza: true
            }
        });

        res.json(user)
    } catch (err) {
        console.log(err)
    }


}