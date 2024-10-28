import React, { useState, useContext } from 'react'
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
    title: 'Crea nuova tariffa'
}

export default function TariffaNew() {

    const notify = useContext(NotificationsContext);
    const router = useRouter();

    const { data: isActive } = useSWR('/api/admin/company/isActive', fetcher);
    const { data: patenti } = useSWR(isActive ? {
        url: '/api/admin/patenti/list',
        data: { companyId: isActive.isActive }
    } : null, fetcherWithData)
    const { data: tipoList, error } = useSWR(patenti ? '/api/tariffe/tariffeTipoList' : null, fetcher);

    const [patente, setPatente] = useState('');
    const [prezzo, setPrezzo] = useState('');
    const [tariffaTipoId, setTariffaTipoId] = useState('Seleziona');

    const createTariffa = async () => {

        if (tariffaTipoId === 'Seleziona') {
            notify.error.set({ title: `Seleziona una tipologia di servizio` });
            return
        }
        if (!patente || patente === 'Seleziona') {
            notify.error.set({ title: `Seleziona la patente per la tariffa` });
            return
        }
        notify.loading.setShow(true);

        const data = {
            patenteId: patente,
            prezzo: prezzo,
            tariffaTipoId: tariffaTipoId,
            companyId: isActive.isActive
        }

        try {
            const res = await fetch('/api/tariffe/new', {
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST'
            });
            const result = await res.json();

            if (result.statusCode === 200) {
                notify.success.set({ title: `Tariffa creata correttamente` });

                setTimeout(() => {
                    router.push(`/tariffe/list?identifier=${result.id}#${result.tipo}`);
                }, 1000)

            }
            if (result.statusCode === 400) {
                notify.error.set({ title: `Errore, controlla i dati inseriti` });
            }
        }
        catch (err) {
            notify.error.set({ title: `Errore interno, ti preghiamo di riprovare più tardi` });
        }

    }

    const Button1 = (data) => {
        return (
            <button
                onClick={() => createTariffa()}
                className="order-0 mx-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:order-1 sm:ml-3">
                Salva
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
            {tipoList &&
                <TariffaForm
                    router={router}
                    companyId={isActive.isActive}
                    patente={patente}
                    setPatente={setPatente}
                    patenti={patenti}
                    prezzo={prezzo}
                    setPrezzo={setPrezzo}
                    tipo={tariffaTipoId}
                    setTipo={setTariffaTipoId}
                    tipoList={tipoList} />}
            {!tipoList && <Loader />}
            {error && 'Errore nel caricamento, prova a ricaricare la pagina! Ci scusiamo per il disguido'}
        </Layout>
    )
}
