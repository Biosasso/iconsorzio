import { prisma } from '@/lib/db'

export default async function handler(req, res) {

    if (req.method !== 'POST') {
        res.status(500).json('Non permesso!')
    }

    const email = req.body.email;
    const getActiveCompany = req.body.activeCompany;

    try {

        const userExist = await prisma.usersCompanies.count({
            where: {
                companyId: getActiveCompany.isActive,
                user: {
                    email: email
                }
            }
        });

        if (userExist === 0) {
            res.status(200).json({ statusCode: 200, title: "Indirizzo email disponibile" })
        }
        else {
            const userFound = await prisma.usersCompanies.findFirst({
                where: {
                    companyId: getActiveCompany.isActive,
                    user: {
                        email: email
                    }
                },
                select: {
                    id: true
                }
            })
            res.status(200).json({ statusCode: 400, userFound: userFound.id, title: "Indirizzo email NON disponibile", message: "L'utente esiste già! Verrai spostato nella sua pagina per vedere i dettagli! Verifica che l'utente non sia stato disattivato, puoi sempre riattivarlo." })
        }

    }
    catch (err) {
        console.log(err)
        res.status(200).json({ statusCode: 400, title: 'Errore inaspettato', message: 'Errore nel caricamento dei dati, ricarica la pagina ' })
    }
}
