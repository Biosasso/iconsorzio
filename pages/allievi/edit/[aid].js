import React, { useEffect, useState, useContext } from 'react'
import NotificationContext from '@/store/notifications'
import Layout from '@/components/layout/layout';
import Tabs from '../../../components/allievi/tabs';
import useSWR from 'swr';
import fetcher, { fetcherWithData } from '@/lib/fetch'
import Loader from '../../../components/UI/loader';
import Form from '../../../components/allievi/form';
import { useRouter } from 'next/router';
import IstruzioniList from '../../../components/allievi/istruzioni/list';
import ServiziList from '../../../components/allievi/servizi/lsit';

const pageInfo = {
    page: 'allievi/list',
    createLink: 'push',
    title: 'Modifica Allievo'
}

export default function AllievoModifica({ aid }) {

    const notify = useContext(NotificationContext)
    const router = useRouter();

    const count = undefined;

    const tabs = [
        { name: 'Dati anagrafici', href: 'anagrafica', count: count?.active },
        { name: 'Istruzione', href: 'istruzione', count: count?.deactivated },
        { name: 'Servizi', href: 'servizi', count: count?.deactivated },
    ];

    const [activeTab, setActiveTab] = useState(router.asPath.includes('servizi') ? 'servizi' : (router.asPath.includes('istruzione') ? 'istruzione' : 'anagrafica'));

    const [data, setData] = useState([]);
    const [istruzioneData, setIstruzioneData] = useState([]);
    const [serviziData, setServiziData] = useState([]);

    const { data: allievo } = useSWR(`/api/allievi/edit/${aid}`, fetcher);
    const { data: companyId } = useSWR('/api/admin/company/isActive', fetcher);
    const { data: autoscuole } = useSWR(companyId ? `/api/autoscuole/list` : null, fetcher);
    const { data: patenti } = useSWR(companyId ? {
        url: '/api/admin/patenti/list',
        data: companyId.isActive
    } : null, fetcherWithData);
    const { data: tariffe } = useSWR(companyId ? `/api/tariffe/tariffeTipoList` : null, fetcher);

    useEffect(() => {
        const callFunctionServiziData = async () => {
            if (allievo) {
                setData(allievo)
                setIstruzioneData(allievo.AllievoIstruzioni);

                const arr = [];
                allievo.AllievoIstruzioni?.map(item => {
                    item.AllievoServizi?.map(el => {
                        arr.push(el)
                    })

                })

                setServiziData(arr)
            }
        }
        callFunctionServiziData();

    }, [allievo]);

    const anagraficaUpdate = async (dataToUpdate) => {

        delete dataToUpdate.AllievoIstruzioni

        if (dataToUpdate.autoscuolaId === 'Seleziona') {
            notify.error.set({
                title: `Devi selezionare un'autoscuola`
            })
            return
        }

        if (dataToUpdate.nome === '' || dataToUpdate.cognome === '' || dataToUpdate.codFisc === '') {
            notify.error.set({
                title: `Compila i campi obbligatori contrassegnati con asterisco (NOME, COGNOME, CODICE FISCALE)`
            })
            return
        }

        try {
            const res = await fetch(`/api/allievi/update`, {
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
        return (
            <button
                onClick={() => { activeTab === 'anagrafica' ? anagraficaUpdate(data) : (activeTab === 'istruzione' ? router.push(`/allievi/istruzioni/new/${aid}`) : router.push(`/allievi/servizi/new/${aid}`)) }}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:order-1 sm:ml-3">
                {activeTab === 'anagrafica' ? 'Salva anagrafica' : (activeTab === 'istruzione' ? 'Aggiungi istruzione' : 'Aggiungi servizio')}
            </button>
        )
    }

    return (
        <Layout
            page={pageInfo.page}
            createLink={pageInfo.createLink}
            title={pageInfo.title}
            Button1={Button1}
            tableData={activeTab === 'istruzione' ? istruzioneData : (activeTab === 'servizi') ? serviziData : null}
            setTableData={activeTab === 'istruzione' ? setIstruzioneData : (activeTab === 'servizi') ? setServiziData : null}
            activeTab={activeTab}
        >
            {activeTab &&
                <Tabs
                    tabs={tabs}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
            }

            {(allievo && tariffe && patenti && autoscuole) ?

                activeTab === 'anagrafica' ?
                    <Form
                        router={router}
                        data={data}
                        setData={setData}
                        autoscuole={autoscuole}
                        istruzioneData={istruzioneData}
                        setIstruzioneData={setIstruzioneData}
                        serviziData={serviziData}
                        setServiziData={setServiziData}
                        patenti={patenti}
                        tariffe={tariffe}
                        step={activeTab}
                    />
                    :
                    activeTab === 'istruzione' ?
                        <IstruzioniList
                            tableData={istruzioneData}
                            selectedRow={router.query.identifier}
                        />
                        :
                        <ServiziList
                            tableData={serviziData}
                            selectedRow={router.query.identifier}
                            allievoId={aid}
                        />
                :
                <Loader />
            }
        </Layout>
    )
}

export async function getServerSideProps(context) {
    return {
        props: {
            aid: context.query.aid
        }
    }
}