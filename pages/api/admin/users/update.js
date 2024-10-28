import { prisma } from '@/lib/db.ts'

export default async function handler(req, res) {

    if (req.method !== 'POST') {
        res.status(500).json('Non permesso!')
    }

    const data = req.body.userData;
    const userCompanyId = req.body.userCompanyId;
    const { selectedRule, appartenenza, selectedAutoscuola } = req.body;

    const email = data.email.toLowerCase();

    try {
        const updateUser = await prisma.user.update({
            where: {
                id: data.id
            },
            data: {
                email: email,
                profile: {
                    upsert: {
                        update: {
                            firstname: data.profile.firstname,
                            lastname: data.profile.lastname,
                            address: data.profile.address,
                            zip: data.profile.zip,
                            city: data.profile.city,
                            country: data.profile.country,
                            state: data.profile.state,
                            phone: data.profile.phone
                        },
                        create: {
                            firstname: data.profile.firstname,
                            lastname: data.profile.lastname,
                            address: data.profile.address,
                            zip: data.profile.zip,
                            city: data.profile.city,
                            country: data.profile.country,
                            state: data.profile.state,
                            phone: data.profile.phone
                        },
                    }
                },
            },
        })

        const updateUserRule = await prisma.usersCompanies.update({
            where: {
                id: userCompanyId
            },
            data: {
                rulesGroupId: selectedRule,
                appartenenza: appartenenza,
                autoscuolaAppartenenza: selectedAutoscuola
            }
        })

        res.status(200).json({ statusCode: 200, message: 'Aggiornamento avvernuto con successo' })
    }
    catch (err) {
        console.log(err)
        res.status(200).json({ statusCode: 400 })
    }
}
