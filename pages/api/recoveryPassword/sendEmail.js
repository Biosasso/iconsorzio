import { prisma } from '@/lib/db'
import { randomPassword, hashPassword } from '@/lib/auth';
import sgMail from '@sendgrid/mail';

export default async function handler(req, res) {


    if (req.method !== 'POST') {
        return;
    }

    const { email } = req.body;

    const password = await randomPassword(12);
    const hashedPassword = await hashPassword(password);

    try {

        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        })

        if (!user) {

            res.status(200).json({ statusCode: 400, message: 'Email non presente nei nostri archivi' })

            return
        }
        else {

            const updatePassword = await prisma.userPassword.update({
                where: {
                    userId: user.id
                },
                data: {
                    password: hashedPassword
                }
            })



            sgMail.setApiKey(process.env.SENDGRID_API_KEY)

            const msg = {
                to: [email],
                from: 'noreply@iconsorzio.it',
                subject: `Password modificata`,
                text: `Se non hai richiesto tu il cambio password ignora questa email. La tua nuova password è ${password}.`,
                html: `<strong><p>Se non hai richiesto tu il cambio password ignora questa email.</p><p>La tua nuova password è ${password}</p></strong>`,
            }
            const sendEmail = await sgMail.send(msg);

            res.status(200).json({ statusCode: 200, message: `Riceverai a breve un'email con la nuova password di accesso.` })

            return
        }

    }
    catch (err) {

        console.log(err)

        res.status(400).json({ statusCode: 400, message: 'Errore interno, ti preghiamo di riprovare più tardi!' })

        return
    }
}
