import { prisma } from '@/lib/db.ts'

export default async function handler(req, res) {

    if (req.method !== 'POST') {
        res.status(500).json('Non permesso!')
    }

    const data = req.body;

    const rules = data.originalData;

    //Creo le nuove righe
    data.rulesToCreate.map(async (item) => {


        const found = rules.companyRulesGroup.find(element => element.ruleId === item.ruleId);
        if (!found) {
            try {
                const createRules = await prisma.companyRulesGroup.create({
                    data: item
                })
            } catch (err) {
                console.log(err);
                res.status(200).json({ statusCode: 400 });
            }

        }
    })

    // Elimino le righe
    data.rulesToDelete.map(async (item) => {
        const found = rules.companyRulesGroup.find(element => element.ruleId === item.ruleId);
        if (found) {
            try {
                const findId = await prisma.companyRulesGroup.findFirst({
                    where: {
                        AND: [{
                            companyId: item.companyId,
                            ruleId: item.ruleId,
                            rulesGroupId: item.rulesGroupId
                        }]
                    }
                })
                const deleteRules = await prisma.companyRulesGroup.delete({
                    where: { id: findId.id }
                })
            } catch (err) {
                console.log(err);
                res.status(200).json({ statusCode: 400 });
            }
        }

    })

    try {
        // Aggiorno i dati generici del ruolo gruppo
        const updateRulesGroup = await prisma.rulesGroup.update({
            where: {
                id: data.id
            },
            data: {
                name: data.name,
                description: data.description,
            },
        });

        res.status(200).json({ statusCode: 200 })
    }
    catch (err) {
        console.log(err)
        res.status(200).json({ statusCode: 400 })
    }
}
