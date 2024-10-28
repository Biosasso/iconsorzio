import React, { useState, useContext, useEffect } from 'react'
import fetcher from '@/lib/fetch'
import useSWR from "swr";
import NotificationsContext from '../../../../store/notifications';

import Layout from '../../../../components/layout/layout'
import { useRouter } from 'next/router';
import Loader from '../../../../components/UI/loader';
import TariffaTipoFormUpdate from '../../../../components/tariffe/formTipologiaUpdate'

const pageInfo = {
    page: 'tariffe/list#newTipo',
    createLink: 'push',
    title: 'Modifica Tipologia tariffa'
}

export default function TariffaTipoEdit({ id }) {

    const notify = useContext(NotificationsContext);
    const router = useRouter();

    const { data: tariffa, error } = useSWR(`/api/tariffe/tipologie/edit/${id}`, fetcher);
    const [nome, setNome] = useState('');

    const updateTariffaTipo = async () => {

        if (!nome) {
            notify.error.set({
                title: `Inserisci il nome della Tipologia Tariffa`,
            })
            return
        }

        notify.loading.setShow(true);

        const data = {
            id: id,
            tipo: nome,
            tipo_cod: nome.replace(' ', '_').toLowerCase(),
            companyId: tariffa.companyId
        }

        if (data.tipo_cod === tariffa.tipo_cod) {
            notify.warning.set({
                title: `Non è stata apportata nessuna modifica`,
                message: `I dati inseriti sono uguali a quelli precedenti`
            })
            return
        }
        try {
            const res = await fetch('/api/tariffe/tipologie/update', {
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST'
            });
            const result = await res.json();

            if (result.statusCode === 200) {
                notify.success.set({
                    title: `Tipologia tariffa aggiornata correttamente`,
                });
                router.push('/tariffe/list#newTipo');
            }
            if (result.statusCode === 400) {
                notify.error.set({
                    title: `Errore, controlla i dati inseriti`,
                    message: result.message
                })
            }
        }
        catch (err) {
            notify.error.set({
                title: `Errore interno, ti preghiamo di riprovare più tardi`,
            })
        }

    }

    const alertDeleteTariffa = () => {
        notify.alert.set({
            title: `Sei sicuro di voler eliminare la tipologia?`,
            message: `Eliminando la tipologia verranno eliminati tutti i dati collegati, incluse le tariffe e le assegnazioni`,
        })
    }

    const deleteTariffaTipo = async () => {

        notify.loading.setShow(true);

        const data = {
            id: id
        }
        try {
            const res = await fetch('/api/tariffe/tipologie/delete', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const result = await res.json();

            if (result.statusCode === 200) {
                notify.success.set({
                    title: result.message
                });

                router.push('/tariffe/list#newTipo');
            }
            if (result.statusCode === 400) {
                notify.error.set({
                    title: 'Errore generico, riprova!',
                    message: `Se il problema persiste contatta l'amministratore del sito`
                })
            }


        } catch (err) {
            notify.error.set({
                title: 'Errore generico, riprova!',
                message: `Se il problema persiste contatta l'amministratore del sito`
            })
        }
    }


    const Button1 = (data) => {
        return (
            <button
                onClick={() => updateTariffaTipo()}
                className="order-0 mx-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:order-1 sm:ml-3">
                Salva
            </button>
        )
    }

    useEffect(() => {
        if (tariffa) {
            setNome(tariffa.tipo);
        }
    }, [tariffa])

    return (
        <Layout
            page={pageInfo.page}
            createLink={pageInfo.createLink}
            title={pageInfo.title}
            Button1={Button1}
        >
            {tariffa && <TariffaTipoFormUpdate nome={nome} setNome={setNome} deleteTariffaTipo={deleteTariffaTipo} alertDeleteTariffa={alertDeleteTariffa} />}
            {!tariffa && <Loader />}
            {error && 'Errore nel caricamento, prova a ricaricare la pagina! Ci scusiamo per il disguido'}
        </Layout>
    )
}


export async function getServerSideProps(context) {

    const { tid } = context.query

    return {
        props: {
            id: tid
        }
    }
}