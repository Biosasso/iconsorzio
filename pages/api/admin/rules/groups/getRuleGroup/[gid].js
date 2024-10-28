import { prisma } from '@/lib/db.ts'
import { getSession } from 'next-auth/react'

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

    const { gid } = req.query

    try {
        const getCompanyId = await prisma.activeCompany.findFirst({
            where: {
                userId: session.user.id
            }
        })

        const rulesGroup = await prisma.rulesGroup.findFirst({
            where: {
                id: gid
            },
            select: {
                id: true,
                companyId: true,
                name: true,
                description: true,
                companyRulesGroup: {
                    select: {
                        id: true,
                        ruleId: true,
                        rule: {
                            select: {
                                description: true,
                                accessCode: true,
                                bgColor: true
                            }
                        }
                    }
                }
            }
        })
        res.json(rulesGroup)
    } catch (err) {
        console.log(err)
    }


}