import { prisma } from '@/lib/db'
import { getSession } from 'next-auth/react'

export default async function handler(req, res) {

    const session = await getSession({ req });

    const { activeTab, sorting } = req.body

    try {
        const companyId = await prisma.activeCompany.findFirst({
            where: {
                userId: session.user.id
            }
        });

        const datiAppartenenza = await prisma.usersCompanies.findFirst({
            where: {
                userId: session.user.id
            }
        })

        if (datiAppartenenza.appartenenza === 'consorzio') {

            const result = await prisma.allievo.findMany({
                where: {
                    companyId: companyId.isActive,
                    AllievoIstruzioni: {
                        some: {
                            istruzioneCompletata: activeTab === '#active' ? false : true
                        }
                    },
                    NOT: {
                        nome: {
                            contains: 'admin'
                        }
                    }
                },
                include: {
                    AllievoIstruzioni: {
                        where: {
                            istruzioneCompletata: activeTab === '#active' ? false : true
                        },
                        select: {
                            foglioRosaScadenza: true,
                            dataEsame: true,
                            patente: {
                                select: {
                                    nome: true
                                },
                            }
                        },
                        orderBy: {
                            foglioRosaScadenza: 'asc'
                        },
                        take: 1
                    },
                    autoscuola: {
                        select: {
                            denominazione: true
                        }
                    },
                },
                orderBy: (sorting !== 'patenteAsc' && sorting !== 'patenteDesc' && sorting !== 'foglioRosaAsc' && sorting !== 'foglioRosaDesc' && sorting !== 'esameAsc' && sorting !== 'esameDesc') ? sorting : { cognome: 'asc' },
            })

            if (!result) {
                res.status(200).json({ statusCode: 200, message: 'Nessun allievo presente in archivio' })
                return
            }

            if (sorting === 'patenteAsc' || sorting === 'patenteDesc') {
                const newData = result.sort((a, b) => {
                    const nameA = a['AllievoIstruzioni'][0].patente.nome;
                    const nameB = b['AllievoIstruzioni'][0].patente.nome;
                    // const nameA = a['AllievoIstruzioni'][0].foglioRosaScadenza ? a['AllievoIstruzioni'][0].foglioRosaScadenza : 0;
                    // const nameB = b['AllievoIstruzioni'][0].foglioRosaScadenza ? b['AllievoIstruzioni'][0].foglioRosaScadenza : 0;
                    if (sorting === 'patenteAsc') {
                        if (nameA < nameB) {
                            return -1;
                        }
                        if (nameA > nameB) {
                            return 1;
                        }
                        // names must be equal
                        return 0;
                    }
                    else {
                        if (nameA > nameB) {
                            return -1;
                        }
                        if (nameA < nameB) {
                            return 1;
                        }
                        // names must be equal
                        return 0;
                    }

                });
                res.json(newData)
                return
            }
            if (sorting === 'foglioRosaAsc' || sorting === 'foglioRosaDesc') {
                const newData = result.sort((a, b) => {
                    const nameA = a['AllievoIstruzioni'][0].foglioRosaScadenza ? a['AllievoIstruzioni'][0].foglioRosaScadenza : 0;
                    const nameB = b['AllievoIstruzioni'][0].foglioRosaScadenza ? b['AllievoIstruzioni'][0].foglioRosaScadenza : 0;
                    if (sorting === 'foglioRosaAsc') {
                        if (nameA < nameB) {
                            return -1;
                        }
                        if (nameA > nameB) {
                            return 1;
                        }
                        // names must be equal
                        return 0;
                    }
                    else {
                        if (nameA > nameB) {
                            return -1;
                        }
                        if (nameA < nameB) {
                            return 1;
                        }
                        // names must be equal
                        return 0;
                    }

                });
                res.json(newData)
                return
            }

            if (sorting === 'esameAsc' || sorting === 'esameDesc') {
                const newData = result.sort((a, b) => {
                    const nameA = new Date(a['AllievoIstruzioni'][0].dataEsame);
                    const nameB = new Date(b['AllievoIstruzioni'][0].dataEsame);
                    if (sorting === 'esameAsc') {
                        if (nameA < nameB) {
                            return -1;
                        }
                        if (nameA > nameB) {
                            return 1;
                        }
                        // names must be equal
                        return 0;
                    }
                    else {
                        if (nameA > nameB) {
                            return -1;
                        }
                        if (nameA < nameB) {
                            return 1;
                        }
                        // names must be equal
                        return 0;
                    }

                });
                res.json(newData)
                return
            }

            res.json(result)
        }
        else {
            const result = await prisma.allievo.findMany({
                where: {
                    companyId: companyId.isActive,
                    autoscuolaId: datiAppartenenza.autoscuolaAppartenenza,
                    AllievoIstruzioni: {
                        some: {
                            istruzioneCompletata: activeTab === '#active' ? false : true
                        }
                    },
                    NOT: {
                        nome: {
                            contains: 'admin'
                        }
                    }
                },
                include: {
                    AllievoIstruzioni: {
                        where: {
                            istruzioneCompletata: activeTab === '#active' ? false : true
                        },
                        select: {
                            foglioRosaScadenza: true,
                            dataEsame: true,
                            patente: {
                                select: {
                                    nome: true
                                },
                            }
                        },
                        orderBy: {
                            foglioRosaScadenza: 'asc'
                        },
                        take: 1
                    },
                    autoscuola: {
                        select: {
                            denominazione: true
                        }
                    },
                },
                orderBy: (sorting !== 'patenteAsc' && sorting !== 'patenteDesc' && sorting !== 'foglioRosaAsc' && sorting !== 'foglioRosaDesc' && sorting !== 'esameAsc' && sorting !== 'esameDesc') ? sorting : { cognome: 'asc' },
            })

            if (!result) {
                res.status(200).json({ statusCode: 200, message: 'Nessun allievo presente in archivio' })
            }

            if (sorting === 'patenteAsc' || sorting === 'patenteDesc') {
                const newData = result.sort((a, b) => {
                    const nameA = a['AllievoIstruzioni'][0].patente.nome;
                    const nameB = b['AllievoIstruzioni'][0].patente.nome;
                    // const nameA = a['AllievoIstruzioni'][0].foglioRosaScadenza ? a['AllievoIstruzioni'][0].foglioRosaScadenza : 0;
                    // const nameB = b['AllievoIstruzioni'][0].foglioRosaScadenza ? b['AllievoIstruzioni'][0].foglioRosaScadenza : 0;
                    if (sorting === 'patenteAsc') {
                        if (nameA < nameB) {
                            return -1;
                        }
                        if (nameA > nameB) {
                            return 1;
                        }
                        // names must be equal
                        return 0;
                    }
                    else {
                        if (nameA > nameB) {
                            return -1;
                        }
                        if (nameA < nameB) {
                            return 1;
                        }
                        // names must be equal
                        return 0;
                    }

                });
                res.json(newData)
                return
            }
            if (sorting === 'foglioRosaAsc' || sorting === 'foglioRosaDesc') {
                const newData = result.sort((a, b) => {
                    const nameA = a['AllievoIstruzioni'][0].foglioRosaScadenza ? a['AllievoIstruzioni'][0].foglioRosaScadenza : 0;
                    const nameB = b['AllievoIstruzioni'][0].foglioRosaScadenza ? b['AllievoIstruzioni'][0].foglioRosaScadenza : 0;
                    if (sorting === 'foglioRosaAsc') {
                        if (nameA < nameB) {
                            return -1;
                        }
                        if (nameA > nameB) {
                            return 1;
                        }
                        // names must be equal
                        return 0;
                    }
                    else {
                        if (nameA > nameB) {
                            return -1;
                        }
                        if (nameA < nameB) {
                            return 1;
                        }
                        // names must be equal
                        return 0;
                    }

                });
                res.json(newData)
                return
            }

            if (sorting === 'esameAsc' || sorting === 'esameDesc') {
                const newData = result.sort((a, b) => {
                    const nameA = new Date(a['AllievoIstruzioni'][0].dataEsame);
                    const nameB = new Date(b['AllievoIstruzioni'][0].dataEsame);
                    if (sorting === 'esameAsc') {
                        if (nameA < nameB) {
                            return -1;
                        }
                        if (nameA > nameB) {
                            return 1;
                        }
                        // names must be equal
                        return 0;
                    }
                    else {
                        if (nameA > nameB) {
                            return -1;
                        }
                        if (nameA < nameB) {
                            return 1;
                        }
                        // names must be equal
                        return 0;
                    }

                });
                res.json(newData)
                return
            }

            res.json(result)
        }


    } catch (err) {
        console.log(err)
    }


}
