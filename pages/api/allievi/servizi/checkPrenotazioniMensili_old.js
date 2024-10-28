import { prisma } from '@/lib/db'
import { DateTime } from 'datetime-next';
import { unixDateToIta } from '@/lib/utils'

export default async function handler(req, res) {

    DateTime.setDefaultLocale('it-IT');

    const companyId = req.body.companyId;
    const dataSelezionata = req.body.dataSelezionata;
    const allievoIStruzioneId = req.body.allievoIStruzioneId;

    const mese = new DateTime(dataSelezionata).getMonth();
    const anno = new DateTime(dataSelezionata).getYear();

    const getDaysInMonth = async function (month, year) {
        // Here January is 1 based
        //Day 0 is the last day in the previous month
        return new Date(year, month, 0).getDate();
        // Here January is 0 based
        // return new Date(year, month+1, 0).getDate();
    };
    const giorniDelMese = await getDaysInMonth(mese, anno);
    const primoGiornoDelMese = await new DateTime(new Date(`${anno}-${mese}-${2}`)).getUnixTimestamp()
    const ultimoGiornoDelMese = await new DateTime(new Date(`${anno}-${mese}-${giorniDelMese}`)).getUnixTimestamp();
    try {

        const getNumeroMassimoPrenotazioni = await prisma.alertPrenotazioni.findFirst({
            where: {
                companyId: companyId
            }
        })

        const getAutoscuola = await prisma.allievoIstruzione.findFirst({
            id: allievoIStruzioneId,
            include: {
                allievo: true
            }
        });
        const autosucolaId = getAutoscuola.allievo.autoscuolaId

        const result = await prisma.allievoServizio.findMany({
            where: {
                AND: [
                    {
                        inizioServizio: {
                            gt: primoGiornoDelMese,
                        },
                        fineServizio: {
                            lt: ultimoGiornoDelMese,
                        },
                    },
                ]
            },
            include: {
                AllievoIstruzione: {
                    include: {
                        allievo: true
                    }
                }
            }

        })
        const filteredResult = result.filter(el => el.AllievoIstruzione.allievo.autoscuolaId === autosucolaId)
        res.json(filteredResult.length >= getNumeroMassimoPrenotazioni.limite ? true : false)
    }
    catch (err) {
        console.log(err)
        res.status(200).json({ statusCode: 400, title: 'Errore inaspettato', message: 'Errore nel caricamento dei dati, ricarica la pagina' })
    }
}
