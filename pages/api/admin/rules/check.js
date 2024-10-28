import { prisma } from '@/lib/db'

export default async function handler(req, res) {

    if (req.method !== 'POST') {
        res.status(500).json('Non permesso!')
    }
    const companyId = req.body.activeCompany;
    const id = req.body.id;

    const rulesListArray = await prisma.usersCompanies.findFirst({
        where: {
            companyId: companyId.isActive,
            userId: id
        },
        select: {
            rulesGroup: {
                select: {
                    companyRulesGroup: {
                        select: {
                            rule: {
                                select: {
                                    accessCode: true
                                }
                            }
                        }
                    }
                }
            }
        }
    })

    res.json({ rulesListArray: rulesListArray.rulesGroup.companyRulesGroup });

}
