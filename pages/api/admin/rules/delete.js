import { prisma } from '../../../../lib/db.ts'

export default async function createRuleAPI(req, res) {

    if (req.method !== 'POST') {
        res.status(500).json('Non permesso!')
    }

    const id = req.body.id;

    try {

        const deleteRule = await prisma.rule.delete({
            where: {
                id: id
            }
        });
        res.status(200).json({ statusCode: 200, title: 'Ruolo eliminato' })

    }
    catch (err) {
        console.log(err)
        res.status(200).json({ statusCode: 400, message: 'Errore, ruolo NON eliminato!' })
    }



}
