import { prisma } from '@/lib/db'

export default async function handler(req, res) {

    const data = req.body;

    try {
        // Gestione valutazioni per servizi guida con esito presente
        let processedData = { ...data };
        
        if (data.esito === 'presente' && data.valutazioneTeoria !== undefined) {
            // Crea oggetto valutazioni
            const valutazioni = {
                tipo: 'presente',
                valutazioni: {
                    teoria: data.valutazioneTeoria || 0,
                    lento: data.valutazioneLento || 0,
                    veloce: data.valutazioneVeloce || 0,
                    guida: data.valutazioneGuida || 0
                }
            };
            
            // Salva come JSON nel campo esito
            processedData.esito = JSON.stringify(valutazioni);
            
            // Rimuovi i campi valutazione dal data per evitare errori Prisma
            delete processedData.valutazioneTeoria;
            delete processedData.valutazioneLento;
            delete processedData.valutazioneVeloce;
            delete processedData.valutazioneGuida;
        }

        const result = await prisma.allievoServizio.create({
            data: processedData
        })

        res.status(200).json({ statusCode: 200, title: 'Servizio inserito', id: result.id });
        // res.status(200).json({ statusCode: 200, title: 'Workplace inserito', result: result })

    } catch (err) {
        console.log(err)
        res.status(200).json({ statusCode: 400, title: 'Errore generico, riprova!' })

    }

}
