
import React, { useEffect, useState, useContext } from 'react'
import NotificationContext from '@/store/notifications'
import { useRouter } from 'next/router';
import useSWR from 'swr';
import fetcher, { fetcherWithData } from '@/lib/fetch'
import Layout from '@/components/layout/layout';
import Form from '@/components/allievi/form';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

const pageInfo = {
    page: 'allievi/list',
    createLink: 'back',
    title: 'Crea Servizo'
}

export default function ServiziCrea({ aid }) {

    const notify = useContext(NotificationContext)

    const router = useRouter();

    const [data, setData] = useState([]);

    const { data: companyId } = useSWR('/api/admin/company/isActive', fetcher);

    const { data: tariffe } = useSWR(companyId ? `/api/tariffe/tariffeTipoList` : null, fetcher);

    const { data: autoscuolaId } = useSWR(aid ? {
        url: '/api/allievi/servizi/getAutoscuolaIdFromAllievo',
        data: {
            allievoId: aid,
        }
    } : null, fetcherWithData);

    const { data: veicoli } = useSWR(companyId ? {
        url: '/api/veicoli/list',
        data: { companyId: companyId.isActive }
    } : null, fetcherWithData);

    const { data: guideMeseCorrente } = useSWR(companyId && data ? {
        url: '/api/allievi/servizi/checkPrenotazioniMensili',
        data: {
            companyId: companyId.isActive,
            dataSelezionata: data.inizioServizio
        }
    } : null, fetcherWithData)

    const { data: checkIfUserIsAdmin } = useSWR('/api/admin/users/ifUserIsAdmin', fetcher)

    useEffect(() => {

        if (guideMeseCorrente && guideMeseCorrente.appartenenza !== 'consorzio') {
            if (guideMeseCorrente.totalePrenotazioniMese >= guideMeseCorrente.limitePrenotazioni) {
                notify.warning.set({
                    title: `Disponibilità mensili terminate`,
                    message: `Ti ricordiamo che hai superato il tuo limite di prenotazioni per il mese in corso. Puoi prenotare per il prossimo mese o per i mesi futuri`
                })
            }
            else {
                notify.success.set({
                    title: `Disponibilità residue`,
                    message: `Ti rimangono ancora ${Number(guideMeseCorrente.limitePrenotazioni) - Number(guideMeseCorrente.totalePrenotazioniMese)} guide disponibili da prenotare per il mese di ${guideMeseCorrente.nomeMeseSelezionato}`
                })
            }
        }
    }, [guideMeseCorrente])

    useEffect(() => {
        if (tariffe) {
            setData({
                allievoIStruzioneId: 'Seleziona',
                companyId: companyId.isActive,
                tariffaId: 'Seleziona',
                veicoloId: 'Seleziona',
                inizioServizio: undefined,
                fineServizio: undefined,
                durataMinuti: 30,
                istruttoreId: undefined,
                insegnanteId: undefined,
                esito: '',
                createdFrom: autoscuolaId
            })
        }
    }, [tariffe]);

    const createServizi = async (dataToCreate) => {

        data.createdFrom = autoscuolaId;

        if (data.inizioServizio) {
            data.fineServizio = data.inizioServizio + data.durataMinuti * 60
        }

        if (data.allievoIStruzioneId === 'Seleziona') {
            notify.error.set({
                title: `Devi scegliere un'istruzione a cui collegare il servizio `,
            })
            return
        }

        if (data.tariffaId === 'Seleziona') {
            notify.error.set({
                title: 'Devi scegliere una tariffa',
            })
            return
        }

        if (data.veicoloId !== 'Seleziona' && data.inizioServizio === undefined) {
            notify.error.set({
                title: `Per assegnare un veicolo devi aver prima selezionato una data ed un orario del servizio`,
                message: `Questa opzione è necessaria per prenotare il veicolo selezionato`
            })
            return
        }

        if (data.veicoloId === 'Seleziona' && data.inizioServizio !== undefined) {
            notify.error.set({
                title: `Per assegnare orario devi aver prima selezionato un veicolo e verificare la disponibilità`,
                message: `Questa opzione è necessaria per assegnare un veicolo`
            })
            return
        }

        if (data.veicoloId === 'Seleziona') {
            data.veicoloId = undefined;
        }

        //CONTROLLARE QUI CHE SE E' UN CORSO TEORICO NON DEVE  CONTROLLARE LE DISPONIBILITA
        try {

            const checkIfCorsoTeorico = await fetch(`/api/allievi/servizi/checkIfCorsoTeoricoFromTariffa`, {
                body: JSON.stringify({
                    tariffaId: data.tariffaId,
                }),
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST'
            });

            const resultCorsoTeorico = await checkIfCorsoTeorico.json();

            //SE NON È UN CORSO TEORICO CONTROLLO DISPONIBILITà ALTRI ALTRIMENTI NON MI PREOCCUPO DEI DOPPIONI DI ORARIO
            if (!resultCorsoTeorico) {
                const checkDisponibilita = await fetch(`/api/allievi/servizi/checkDisponibilitaVeicolo`, {
                    body: JSON.stringify({
                        companyId: companyId.isActive,
                        veicoloId: data.veicoloId,
                        inizioServizio: data.inizioServizio,
                        fineServizio: data.fineServizio,
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'POST'
                });

                const resultDisponibilita = await checkDisponibilita.json();

                if (resultDisponibilita > 0) {
                    notify.error.set({
                        title: 'Orario non disponibile per il veicolo selezionato',
                    })
                    return
                }
            }

        } catch (err) {
            console.log(err)
        }

        try {
            const res = await fetch(`/api/allievi/servizi/new`, {
                body: JSON.stringify(dataToCreate),
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST'
            });

            const result = await res.json();

            if (result.statusCode === 200) {
                notify.success.set({
                    title: result.title
                })
                setTimeout(() => {
                    router.push(`/allievi/edit/${aid}?identifier=${result.id}#servizi`)
                }, 500)
            }
            if (result.statusCode === 400) {
                notify.error.set({
                    title: result.title
                })
            }
        }
        catch (err) {
            notify.error.set({
                title: `Errore nell'aggiornamento dei dati, controlla bene i campi oppure riprova più tardi`
            })
        }

    }

    const Button1 = () => {
        if (guideMeseCorrente === undefined) {
            return (
                <button
                    className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:order-1 sm:ml-3`}>
                    <ArrowPathIcon className='w-5 h-5 animate-spin' />
                </button>
            )
        }
        return (
            <button
                onClick={() => { guideMeseCorrente?.possibilitaPrenotazione ? createServizi(data) : null }}
                disabled={!guideMeseCorrente?.possibilitaPrenotazione}
                className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${guideMeseCorrente?.possibilitaPrenotazione ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-red-600 hover:bg-red-700'}  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:order-1 sm:ml-3`}>
                {guideMeseCorrente?.possibilitaPrenotazione ? `Salva` : `Limite mensile raggiunto`}
            </button>
        )
    }

    return (
        <Layout
            page={pageInfo.page}
            createLink={pageInfo.createLink}
            title={pageInfo.title}
            Button1={Button1}
        >
            {(data && tariffe && veicoli) &&
                <Form
                    router={router}
                    notify={notify}
                    serviziData={data}
                    setServiziData={setData}
                    tariffe={tariffe}
                    step={'servizi'}
                    allievoId={aid}
                    veicoli={veicoli}
                    userIsAdmin={checkIfUserIsAdmin}
                />
            }

        </Layout>
    )
}


export async function getServerSideProps(context) {

    return {
        props: {
            aid: context.query.aid,
        }
    }
}