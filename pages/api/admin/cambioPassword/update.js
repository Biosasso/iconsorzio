import { prisma } from '@/lib/db'
import { hashPassword } from '@/lib/auth';

export default async function handler(req, res) {

    if (req.method !== 'POST') {
        res.status(500).json('Non permesso!')
    }

    const { isActive, password } = req.body;

    const hashedPassword = await hashPassword(password);

    try {

        const updatePassword = await prisma.userPassword.update({
            data: {
                password: hashedPassword
            },
            where: {
                userId: isActive.userId
            }
        })

        if (updatePassword) {
            res.status(200).json({ statusCode: 200, title: `Password aggiornata con successo` })
        }
        else {
            res.status(200).json({ statusCode: 400, title: `Errore nell'aggiornamento della password` })
        }

    }
    catch (err) {
        console.log(err)
        res.status(200).json({ statusCode: 400, title: `Errore interno, ti preghiamo di riprovare più tardi!` })
    }
}
