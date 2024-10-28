import React, { useState, useContext, useEffect } from 'react'
import fetcher, { fetcherWithData } from '@/lib/fetch'
import useSWR from "swr";
import NotificationsContext from '../../../store/notifications';

import Layout from '../../../components/layout/layout'
import { useRouter } from 'next/router';
import Loader from '../../../components/UI/loader';
import TariffaForm from '../../../components/tariffe/form';

const pageInfo = {
    page: 'tariffe/list',
    createLink: '',
    title: 'Modifica tariffa'
}

export default function TariffaEdit({ id }) {

    const notify = useContext(NotificationsContext);
    const router = useRouter();

    const { data: isActive } = useSWR('/api/admin/company/isActive', fetcher);
    const { data: patenti } = useSWR(isActive ? {
        url: '/api/admin/patenti/list',
        data: { companyId: isActive.isActive }
    } : null, fetcherWithData)

    const { data: tariffa } = useSWR(patenti ? `/api/tariffe/edit/${id}` : null, fetcher);
    const { data: tipoList, error } = useSWR(tariffa ? '/api/tariffe/tariffeTipoList' : null, fetcher);

    const [patente, setPatente] = useState('');
    const [prezzo, setPrezzo] = useState(tariffa ? tariffa.prezzo : '');
    const [tariffaTipoId, setTariffaTipoId] = useState(tariffa ? tariffa.tariffaTipoId : 'Seleziona');

    const updateTariffa = async () => {

        if (patente === tariffa.patenteId && tariffaTipoId === tariffa.tariffaTipoId && prezzo === tariffa.prezzo) {
            notify.warning.set({ title: `Non sono state apportate modifiche perché non è stato cambiato alcun valore.` });
            return
        }

        if (tariffaTipoId === 'Seleziona') {
            notify.error.set({
                title: `Seleziona una tipologia di servizio`
            });

            return
        }
        if (!patente || patente === 'Seleziona') {
            notify.error.set({
                title: `Seleziona la patente per la tariffa`
            });
            return
        }
        notify.loading.setShow(true);

        const data = {
            id: id,
            patenteId: patente,
            prezzo: prezzo,
            tariffaTipoId: tariffaTipoId,
            companyId: tariffa.companyId
        }

        try {
            const res = await fetch('/api/tariffe/update', {
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST'
            });
            const result = await res.json();

            if (result.statusCode === 200) {
                notify.success.set({
                    title: `Tariffa aggiornata correttamente`
                })
                router.push(`/${pageInfo.page}?identifier=${id}#${result.tipo}`)
            }
            if (result.statusCode === 400) {
                notify.error.set({
                    title: `Errore, controlla i dati inseriti`
                });
            }
        }
        catch (err) {
            notify.error.set({
                title: `Errore interno, ti preghiamo di riprovare più tardi`
            });
        }

    }

    const alertDeleteTariffa = () => {
        notify.alert.set({
            title: `Sei sicuro di voler eliminare la tariffa?`,
            message: `Eliminando la tariffa non sarà più utilizzabile in nessun'altra sezione del gestionale`,
        })
    }

    const deleteTariffa = async () => {

        notify.loading.setShow(true);

        const data = {
            id: id
        }
        try {
            const res = await fetch('/api/tariffe/delete', {
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

                setTimeout(() => {
                    router.push(`/tariffe/list?identifier=null`);
                }, 1000)

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
                onClick={() => updateTariffa()}
                className="order-0 mx-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:order-1 sm:ml-3">
                Salva
            </button>
        )
    }

    useEffect(() => {
        if (tariffa) {
            setPatente(tariffa.patenteId);
            setPrezzo(tariffa.prezzo);
            setTariffaTipoId(tariffa.tariffaTipoId)
        }

    }, [tariffa])

    return (
        <Layout
            page={pageInfo.page}
            createLink={pageInfo.createLink}
            title={pageInfo.title}
            Button1={Button1}
        >
            {(tipoList && patente && prezzo && tariffaTipoId) &&
                <TariffaForm
                    router={router}
                    companyId={isActive.isActive}
                    originalData={tariffa}
                    patente={patente}
                    setPatente={setPatente}
                    patenti={patenti}
                    prezzo={prezzo}
                    setPrezzo={setPrezzo}
                    tipo={tariffaTipoId}
                    setTipo={setTariffaTipoId}
                    tipoList={tipoList}
                    alertDeleteTariffa={alertDeleteTariffa}
                    deleteTariffa={deleteTariffa}

                />
            }
            {!tipoList && <Loader />}
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