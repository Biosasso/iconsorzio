import { prisma } from '@/lib/db'
import { randomPassword, hashPassword } from '@/lib/auth';
export default async function handler(req, res) {

    if (req.method !== 'POST') {
        res.status(500).json('Non permesso!')
    }

    const email = req.body.userData.email.toLowerCase();
    const profile = req.body.userData.profile;
    const companyId = req.body.companyId;
    const selectedRule = req.body.selectedRule;
    const { appartenenza, autoscuolaAppartenenza } = req.body

    const password = await randomPassword(12);
    const hashedPassword = await hashPassword(password);

    try {
        const createUser = await prisma.user.create({
            data: {
                email: email,
                profile: {
                    create: profile,
                },
                companies: {
                    create: {
                        companyId: companyId,
                        rulesGroupId: selectedRule,
                        appartenenza: appartenenza,
                        autoscuolaAppartenenza: autoscuolaAppartenenza
                    }
                },
                userPassword: {
                    create: {
                        password: hashedPassword
                    }
                }
            },
        })

        res.status(200).json({ statusCode: 200, email: email, password: password, id: createUser.id })
    }
    catch (err) {
        console.log(err)
        res.status(200).json({ statusCode: 400 })
    }
}
