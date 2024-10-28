export default async function handler(req, res) {

    if (req.method !== 'POST') {
        res.status(500).json('Non permesso!')
    }

    const password = req.body.pass;
    const emailTo = req.body.emailTo

    const sgMail = require('@sendgrid/mail')
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
        to: [emailTo],
        cc: 'customers@iconsorzio.it', //Redirect directly from aruba to admin emails
        from: 'noreply@iconsorzio.it',
        subject: `Benvenuto su ${process.env.SITE_NAME}`,
        text: `Questa è la tua email di benvenuto. Accedi con la password provvisoria per attivare il tuo account: ${password} . Per accedere segui il seguente link: ${process.env.SITE_URL} . Se hai ricevuto questa email per errore ti preghiamo di ignorarla`,
        html: `<strong><p>Questa è la tua email di benvenuto. Accedi con la password provvisoria per attivare il tuo account.</p><p>${password}</p><p>Per accedere segui il seguente link: ${process.env.SITE_URL}</p><p>Se hai ricevuto questa email per errore ti preghiamo di ignorarla</p></strong>`,
    }
    const sendEmail = await sgMail.send(msg);

    res.json({ statusCode: 200, message: 'Email inviata correttamente' })
}