import { prisma } from '@/lib/db'

export default async function handler(req, res) {
    const data = req.body.data;
    const toCreate = req.body.toCreate;
    const toDeactivate = req.body.toDeactivate;
    const patentiAssociate = req.body.patentiAssociate;

    //Creo le nuove righe
    toCreate.map(async (item) => {
        const found = patentiAssociate.find(element => element.patente.id === item.patenteId);
        if (!found) {
            try {
                const createNewRow = await prisma.patentiOnVeicoli.create({
                    data: item
                })
            } catch (err) {
                console.log(err);
                res.status(200).json({ statusCode: 400 });
            }

        }
    })

    // Elimino le righe
    toDeactivate.map(async (item) => {
        const found = patentiAssociate.find(element => element.patente.id === item.patenteId);
        if (found) {
            try {

                const deleteRow = await prisma.patentiOnVeicoli.deleteMany({
                    where: item
                })

            } catch (err) {
                console.log(err);
                res.status(200).json({ statusCode: 400 });

            }
        }

    })


    try {
        const found = await prisma.veicolo.findFirst({
            where: {
                companyId: data.companyId,
                targa: data.targa,
                NOT: [{
                    id: data.id
                }]
            }
        });

        if (found) {
            res.status(200).json({ statusCode: 400, title: 'Duplicato! Veicolo già presente nei database' })
        }
        else {
            const result = await prisma.veicolo.update({
                data: data,
                where: {
                    id: data.id
                }
            })

            res.status(200).json({ statusCode: 200, title: 'Veicolo aggiornato', id: result.id })
        }

    }
    catch (err) {
        console.log(err)
        res.status(200).json({ statusCode: 400, title: 'Errore interno, ti preghiamo di riprovare più tardi!' })
    }
}
