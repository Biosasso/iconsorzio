import { prisma } from '../../../lib/db.ts'

export default async function newAutoscuolaAPI(req, res) {

    if (req.method !== 'POST') {
        return;
    }

    const { email, name, appartenenza, autoscuola } = req.body;

    try {

        const password = req.body.pass;


        const sgMail = require('@sendgrid/mail')
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)
        const msg = {
            to: ['customers@iconsorzio.it'],
            // cc: 'customers@iconsorzio.it', //Redirect directly from aruba to admin emails
            from: 'noreply@iconsorzio.it',
            subject: `Nuova richiesta di account per  ${process.env.SITE_NAME}`,
            text: `C'è una nuova richiesta di account. Nome: ${name}, email: ${email}, Appartenenza: ${appartenenza}, Nome Autoscuola: ${autoscuola}`,
            html: `<strong><p>C'è una nuova richiesta di account. Nome: ${name}, email: ${email}, Appartenenza: ${appartenenza}, Nome Autoscuola: ${autoscuola}</p></strong>`,
        }
        const sendEmail = await sgMail.send(msg);

        res.json({ statusCode: 200, message: 'Email inviata correttamente' })

    }
    catch (err) {
        console.log(err)
        res.status(200).json({ statusCode: 400, title: 'Errore inaspettato', message: 'Errore! La tua email non è stata inviata, riprova più tardi oppure scrivi a info@iconsorzio.it ' })
    }

}
