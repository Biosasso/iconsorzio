import { prisma } from '@/lib/db'

export default async function handler(req, res) {

    const data = req.body;

    try {

        const result = await prisma.allievoIstruzione.create({
            data: data
        })

        res.status(200).json({ statusCode: 200, title: 'Istruzione inserita', id: result.id });
        // res.status(200).json({ statusCode: 200, title: 'Workplace inserito', result: result })

    } catch (err) {
        console.log(err)
        res.status(200).json({ statusCode: 400, title: 'Errore generico, riprova!' })

    }

}
