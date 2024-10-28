// import { prisma } from '@/lib/db.ts'

export default async function handler(req, res) {

    const patenti = req.body.patenti;
    const patentiAttive = req.body.patentiAttive;
    const veicoloId = req.body.veicoloId

    const arr = [];
    const assignedPatenti = []

    patenti && patenti.map((item, i) => {

        const found = patentiAttive.find(element => element.patente.id === item.id);

        if (found) {
            arr.push({
                id: item.id,
                companyId: item.companyId,
                nome: item.nome,
                isChecked: true
            })
        }
        else {
            arr.push({
                id: item.id,
                companyId: item.companyId,
                nome: item.nome,
                isChecked: false
            })
        }

        assignedPatenti.push({
            companyId: item.companyId,
            patenteId: item.id,
            veicoloId: veicoloId,
        });

    })

    res.json({ dataForPage: arr, dataForDb: assignedPatenti });

}
