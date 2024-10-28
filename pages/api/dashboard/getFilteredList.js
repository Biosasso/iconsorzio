import { prisma } from '@/lib/db'

export default async function handler(req, res) {


    const { companyId, selectedFilter } = req.body;

    try {
        if (selectedFilter === 'workplace') {
            const result = await prisma.workplace.findMany({
                where: {
                    companyId: companyId,
                    isActive: true
                }
            })
            res.json(result)
            return
        }
        else if (selectedFilter === 'istruttore') {
            const result = await prisma.usersCompanies.findMany({
                where: {
                    companyId: companyId,
                    isActive: true,
                    rulesGroup: {
                        name: {
                            contains: 'istruttore',
                            mode: 'insensitive',
                        }
                    }
                },
                select: {
                    id: true,
                    user: {
                        select: {
                            profile: true
                        },
                    }
                }
            })
            res.json(result)
            return
        }
        else if (selectedFilter === 'insegnante') {
            const result = await prisma.usersCompanies.findMany({
                where: {
                    companyId: companyId,
                    isActive: true,
                    rulesGroup: {
                        name: {
                            contains: 'insegnante',
                            mode: 'insensitive',
                        }
                    }
                },
                select: {
                    id: true,
                    user: {
                        select: {
                            profile: true
                        },
                    }
                }
            })
            res.json(result)
            return
        }
        else {
            res.json('No Data')
            return
        }



        // const result = await prisma.allievoServizio.findMany({
        //     where: {
        //         companyId: companyId,
        //         inizioServizio: {
        //             gt: dataUnix
        //         }

        //     },
        //     select: {
        //         id: true,
        //         inizioServizio: true,
        //         fineServizio: true,
        //         durataMinuti: true,
        //         AllievoIstruzione: {
        //             select: {
        //                 allievo: {
        //                     select: {
        //                         id: true,
        //                         nome: true,
        //                         cognome: true,
        //                         tel: true,
        //                         email: true
        //                     }
        //                 }
        //             }
        //         },
        //         tariffa: {
        //             select: {
        //                 tipo: true
        //             }
        //         },
        //         veicolo: true,
        //         istruttore: {
        //             select: {
        //                 profile: true
        //             }
        //         }
        //     }
        // })



    }
    catch (err) {
        console.log(err)
        res.status(200).json({ statusCode: 400, title: 'Errore inaspettato', message: 'Errore nel caricamento dei dati, ricarica la pagina' })
    }
}
