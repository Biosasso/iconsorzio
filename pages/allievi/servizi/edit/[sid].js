
import React, { useEffect, useState, useContext } from 'react'
import NotificationContext from '@/store/notifications'
import { useRouter } from 'next/router';
import useSWR from 'swr';
import fetcher, { fetcherWithData } from '@/lib/fetch'
import Layout from '@/components/layout/layout';
import Form from '@/components/allievi/form';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

// const pageInfo = {
//     page: 'allievi/edit',
//     createLink: 'back',
//     title: 'Modifica Servizo'
// }

export default function ServiziModifica({ sid }) {

    const notify = useContext(NotificationContext)
    const router = useRouter();

    const { data: companyId } = useSWR('/api/admin/company/isActive', fetcher);

    const { data: tariffe } = useSWR(companyId ? `/api/tariffe/tariffeTipoList` : null, fetcher);

    const { data: servizi } = useSWR(tariffe ? `/api/allievi/servizi/edit/${sid}` : null, fetcher);

    const { data: veicoli } = useSWR(servizi ? {
        url: '/api/veicoli/list',
        data: { companyId: companyId.isActive }
    } : null, fetcherWithData)

    const [data, setData] = useState(servizi);

    // const { data: autoscuolaId } = useSWR(sid ? {
    //     url: '/api/allievi/servizi/getAutoscuolaIdFromAllievo',
    //     data: {
    //         allievoId: sid,
    //     }
    // } : null, fetcherWithData);

    const { data: guideMeseCorrente } = useSWR(companyId && data && servizi ? {
        url: '/api/allievi/servizi/checkPrenotazioniMensili',
        data: {
            companyId: companyId.isActive,
            dataSelezionata: data.inizioServizio,
            dataOriginale: servizi.inizioServizio
        }
    } : null, fetcherWithData)

    const { data: checkIfUserIsAdmin } = useSWR('/api/admin/users/ifUserIsAdmin', fetcher)

    useEffect(() => {
        if (servizi) {
            setData(servizi)
        }
    }, [servizi]);

    useEffect(() => {

        if (guideMeseCorrente && guideMeseCorrente.appartenenza !== 'consorzio') {
            if (guideMeseCorrente.totalePrenotazioniMese >= guideMeseCorrente.limitePrenotazioni && guideMeseCorrente.cambioMese) {
                notify.warning.set({
                    title: `Disponibilità mensili terminate`,
                    message: `Ti ricordiamo che hai superato il tuo limite di prenotazioni per il mese in corso. Puoi prenotare per il prossimo mese o per i mesi futuri`
                })
            }
            else {
                if (guideMeseCorrente.cambioMese) {
                    notify.success.set({
                        title: `Disponibilità residue`,
                        message: `Ti rimangono ancora ${Number(guideMeseCorrente.limitePrenotazioni) - Number(guideMeseCorrente.totalePrenotazioniMese)} guide disponibili da prenotare per il mese di ${guideMeseCorrente.nomeMeseSelezionato}`
                    })
                }
            }
        }
    }, [guideMeseCorrente])

    const updateServizi = async (dataToUpdate) => {

        delete dataToUpdate.tariffa;
        delete dataToUpdate.insegnante;
        delete dataToUpdate.istruttore;

        if (dataToUpdate.istruttoreId === 'Seleziona') {
            dataToUpdate.istruttoreId = null;
        }
        if (dataToUpdate.insegnanteId === 'Seleziona') {
            dataToUpdate.insegnanteId = null;
        }
        if (dataToUpdate.tariffaId === 'Seleziona') {
            notify.error.set({
                title: `Devi selezionare una tariffa`
            })
            return
        }
        try {
            const res = await fetch(`/api/allievi/servizi/update`, {
                body: JSON.stringify(dataToUpdate),
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
                onClick={() => { guideMeseCorrente?.possibilitaPrenotazioneEdit ? updateServizi(data) : null }}
                disabled={!guideMeseCorrente?.possibilitaPrenotazioneEdit}
                className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${guideMeseCorrente?.possibilitaPrenotazioneEdit ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-red-600 hover:bg-red-700'}  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:order-1 sm:ml-3`}>
                {guideMeseCorrente?.possibilitaPrenotazioneEdit ? `Salva` : `Limite mensile raggiunto`}
            </button>
        )
    }

    const pageInfo = {
        page: `allievi/edit/${router.query.allievoId}#servizi`,
        createLink: 'push',
        title: 'Modifica Servizo'
    }

    return (
        <Layout
            page={pageInfo.page}
            createLink={pageInfo.createLink}
            title={pageInfo.title}
            Button1={Button1}
        >
            {(data && veicoli && tariffe && servizi) &&
                <Form
                    sid={sid}
                    router={router}
                    notify={notify}
                    serviziData={data}
                    setServiziData={setData}
                    tariffe={tariffe}
                    step={'servizi'}
                    veicoli={veicoli}
                    allievoId={router.query.allievoId}
                    userIsAdmin={checkIfUserIsAdmin}
                />
            }
        </Layout>
    )
}


export async function getServerSideProps(context) {
    return {
        props: {
            sid: context.query.sid
        }
    }
}