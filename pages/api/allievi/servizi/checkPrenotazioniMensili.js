import { prisma } from '@/lib/db'
import { DateTime } from 'datetime-next';
import { unixDateToIta } from '@/lib/utils'
import { getSession } from 'next-auth/react'

export default async function handler(req, res) {

    DateTime.setDefaultLocale('it-IT');

    const session = await getSession({ req });

    //dataSelezionata serve solo nella creazione di nuovi servizi
    //dataOriginale serve per la pagina di modifica del servizio
    const { companyId, dataSelezionata, dataOriginale } = req.body

    const mese = new DateTime(dataSelezionata ? new Date(dataSelezionata * 1000) : new Date()).getMonth();
    const anno = new DateTime(dataSelezionata ? new Date(dataSelezionata * 1000) : new Date()).getYear();
    const meseNome = new DateTime(dataSelezionata ? new Date(dataSelezionata * 1000) : new Date()).getMonthName();

    const meseOriginale = new DateTime(dataOriginale ? new Date(dataOriginale * 1000) : new Date()).getMonth();
    const annoOriginale = new DateTime(dataOriginale ? new Date(dataOriginale * 1000) : new Date()).getYear();
    const meseNomeOriginale = new DateTime(dataOriginale ? new Date(dataOriginale * 1000) : new Date()).getMonthName();

    const getDaysInMonth = async function (month, year) {
        // Here January is 1 based
        //Day 0 is the last day in the previous month
        return new Date(year, month, 0).getDate();
        // Here January is 0 based
        // return new Date(year, month+1, 0).getDate();
    };
    const giorniDelMese = await getDaysInMonth(mese, anno);
    const primoGiornoDelMese = await new DateTime(`${anno}-${mese}-1`).setHour(4).getUnixTimestamp();
    const ultimoGiornoDelMese = await new DateTime(`${anno}-${mese}-${giorniDelMese}`).setHour(21).getUnixTimestamp();
    // const ultimoGiornoDelMese = await new DateTime(new Date(`${anno}-${mese}-${giorniDelMese}`)).getUnixTimestamp();

    const giorniDelMeseOriginale = await getDaysInMonth(meseOriginale, annoOriginale);
    const primoGiornoDelMeseOriginale = await new DateTime(new Date(`${annoOriginale}-${meseOriginale}-${2}`)).getUnixTimestamp()
    const ultimoGiornoDelMeseOriginale = await new DateTime(new Date(`${annoOriginale}-${meseOriginale}-${giorniDelMeseOriginale}`)).getUnixTimestamp();

    //Verifico se è cambiato il mese selezionato nella pagina di modifica del servizio, 
    const cambioMese = dataOriginale && mese === meseOriginale && anno === annoOriginale ? false : true

    try {

        const datiAppartenenza = await prisma.usersCompanies.findFirst({
            where: {
                userId: session.user.id
            }
        })

        if (datiAppartenenza.appartenenza == 'consorzio') {
            res.json({
                appartenenza: 'consorzio',
                totalePrenotazioniMese: 0,
                limitePrenotazioni: 999999999,
                possibilitaPrenotazione: true,
                possibilitaPrenotazioneEdit: true,
                nomeMeseSelezionato: 'Tutti i mesi',
                cambioMese: cambioMese,
            })
            return
        }

        const limitePrenotazioni = await prisma.autoscuola.findFirst({
            where: {
                id: datiAppartenenza.autoscuolaAppartenenza,
            },
            select: {
                limitePrenotazioni: true
            }
        })

        const getPrenotazioni = await prisma.allievoServizio.count({
            where: {
                companyId: companyId.isActive,
                inizioServizio: {
                    gt: primoGiornoDelMese,
                },
                fineServizio: {
                    lt: ultimoGiornoDelMese,
                },
                AllievoIstruzione: {
                    allievo: {
                        autoscuolaId: datiAppartenenza.autoscuolaAppartenenza
                    }
                },
                createdFrom: datiAppartenenza.autoscuolaAppartenenza
            },
        })

        const prenotazioniRimaste = Number(limitePrenotazioni.limitePrenotazioni) - Number(getPrenotazioni);

        const possibilitaPrenotazione = prenotazioniRimaste <= 0 ? false : true

        //Solo per pagina Edit
        const possibilitaPrenotazioneEdit = prenotazioniRimaste <= 0 && cambioMese ? false : true

        res.json({
            appartenenza: 'autoscuola',
            totalePrenotazioniMese: getPrenotazioni,
            limitePrenotazioni: limitePrenotazioni.limitePrenotazioni,
            possibilitaPrenotazione: possibilitaPrenotazione,
            possibilitaPrenotazioneEdit: possibilitaPrenotazioneEdit,
            nomeMeseSelezionato: meseNome,
            cambioMese: cambioMese,
        })

    }
    catch (err) {
        console.log(err)
        res.status(200).json({ statusCode: 400, title: 'Errore inaspettato', message: 'Errore nel caricamento dei dati, ricarica la pagina' })
    }
}
