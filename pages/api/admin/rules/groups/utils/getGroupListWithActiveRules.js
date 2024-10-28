// import { prisma } from '@/lib/db.ts'

export default async function handler(req, res) {

    if (req.method !== 'POST') {
        res.status(500).json('Non permesso!')
    }

    const rules = req.body.rules;
    const ruleGroup = req.body.ruleGroup;

    const arr = [];
    const assignedRules = []

    rules && rules.map((item, i) => {

        const found = ruleGroup.companyRulesGroup.find(element => element.ruleId === item.id);

        // arr.push({ [item.id]: found ? true : false });

        if (found) {
            arr.push({
                id: item.id,
                companyId: item.companyId,
                description: item.description,
                accessCode: item.accessCode,
                isChecked: true
            })
        }
        else {
            arr.push({
                id: item.id,
                companyId: item.companyId,
                description: item.description,
                accessCode: item.accessCode,
                isChecked: false
            })
        }

        assignedRules.push({
            companyId: ruleGroup.companyId,
            ruleId: item.id,
            rulesGroupId: ruleGroup.id,
        });

    })

    res.json({ dataForPage: arr, dataForDb: assignedRules });

}
