import React, { useContext, useEffect, useState } from 'react'
import NotificationsContext from '@/store/notifications'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import fetcher, { fetcherWithData } from '@/lib/fetch'
import { DateTime } from 'datetime-next';

import Layout from '@/components/layout/layout'
import Loader from '@/components/UI/loader'
import Form from '@/components/veicoli/form'

const pageInfo = {
    page: 'veicoli/list',
    createLink: '',
    title: 'Modifica veicolo'
}

export default function VeicoliNew() {

    const router = useRouter();

    const notify = useContext(NotificationsContext)

    const { data: isActive } = useSWR('/api/admin/company/isActive', fetcher);

    const { data: workplaces } = useSWR(isActive ? {
        url: `/api/admin/workplace/list`,
        data: { companyId: isActive.isActive }
    } : null, fetcherWithData);


    const [nome, setNome] = useState('');
    const [targa, setTarga] = useState('');
    const [modello, setModello] = useState('');
    const [immatricolazione, setImmatricolazione] = useState('');
    const [scadenzaRevisione, setScadenzaRevisione] = useState('');
    const [scadenzaAssicurazione, setScadenzaAssicurazione] = useState('');
    const [scadenzaBollo, setScadenzaBollo] = useState('');
    const [workplaceId, setWorkplaceId] = useState('');

    const createRecord = async () => {

        const data = {
            companyId: isActive.isActive,
            nome: nome.toLowerCase(),
            targa: targa.toLowerCase().replace(/\s+/g, ''),
            modello: modello.toLowerCase(),
            immatricolazione: new Date(immatricolazione),
            scadenzaRevisione: new Date(scadenzaRevisione),
            scadenzaAssicurazione: new Date(scadenzaAssicurazione),
            scadenzaBollo: new Date(scadenzaBollo),
            workplaceId: workplaceId
        }

        if ( // Controllo campi obbligatori
            nome === ''
            || targa === ''
            || modello === ''
            || immatricolazione === ''
            || scadenzaRevisione === ''
            || scadenzaAssicurazione === ''
            || scadenzaBollo === ''
        ) {
            notify.error.set({
                title: 'Tutti i campi sono obbligatori'
            })
            return
        }
        if (workplaceId === 'Seleziona' || workplaceId === '') { // Controllo se selezionato workspace
            notify.error.set({
                title: 'Devi selezionare un workspace per il veicolo'
            })
            return
        }

        try {
            const res = await fetch('/api/veicoli/new', {
                body: JSON.stringify(data),
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
                    router.replace(`/veicoli/edit/${result.id}`)
                }, 1000)
            }
            if (result.statusCode === 400) {
                notify.error.set({
                    title: result.title
                })
            }
        }
        catch (err) {
            notify.error.set({
                title: 'Errore nel collegamento con il server, riprova!'
            })
        }

    }

    const Button1 = () => {
        return (
            <button
                onClick={() => createRecord()}
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
            {/* {(nome && targa && modello && immatricolazione && scadenzaRevisione && scadenzaAssicurazione && scadenzaBollo && workplaceId) && */}
            {workplaces &&
                <Form
                    router={router}
                    nome={nome}
                    setNome={setNome}
                    targa={targa}
                    setTarga={setTarga}
                    modello={modello}
                    setModello={setModello}
                    immatricolazione={immatricolazione}
                    setImmatricolazione={setImmatricolazione}
                    scadenzaRevisione={scadenzaRevisione}
                    setScadenzaRevisione={setScadenzaRevisione}
                    scadenzaAssicurazione={scadenzaAssicurazione}
                    setScadenzaAssicurazione={setScadenzaAssicurazione}
                    scadenzaBollo={scadenzaBollo}
                    setScadenzaBollo={setScadenzaBollo}
                    workplaceId={workplaceId}
                    setWorkplaceId={setWorkplaceId}
                    workplaces={workplaces}
                />}
            {!workplaces && <Loader />}
        </Layout>
    )
}