import { prisma } from '../../../lib/db.ts'

export default async function newAutoscuolaAPI(req, res) {

    if (req.method !== 'POST') {
        return;
    }

    const email = req.body.email;

    try {

        const userExist = await prisma.usersCompanies.count({
            where: {
                user: {
                    email: email
                }
            }
        });

        if (userExist === 0) {
            res.status(200).json({ statusCode: 200, title: "Indirizzo email disponibile" })
        }
        else {
            res.status(200).json({ statusCode: 400, title: "Indirizzo email già registrato", message: "L'utente esiste già!" })
        }

    }
    catch (err) {
        console.log(err)
        res.status(200).json({ statusCode: 400, title: 'Errore inaspettato', message: 'Errore nel caricamento dei dati, ricarica la pagina ' })
    }

}
