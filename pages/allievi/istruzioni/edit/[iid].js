import React, { useEffect, useState, useContext } from 'react'
import NotificationContext from '@/store/notifications'
import { useRouter } from 'next/router';
import useSWR from 'swr';
import fetcher, { fetcherWithData } from '@/lib/fetch'
import Layout from '@/components/layout/layout';
import Form from '@/components/allievi/form';

export default function IstruzioneModifica({ iid }) {

    const notify = useContext(NotificationContext)
    const router = useRouter();

    const [data, setData] = useState([]);

    const { data: istruzione } = useSWR(`/api/allievi/istruzioni/edit/${iid}`, fetcher);

    const { data: companyId } = useSWR('/api/admin/company/isActive', fetcher);

    const { data: patenti } = useSWR(companyId ? {
        url: '/api/admin/patenti/list',
        data: companyId.isActive
    } : null, fetcherWithData);


    useEffect(() => {
        if (istruzione) {
            setData(istruzione)
        }
    }, [istruzione]);

    const updateIstruzione = async (dataToUpdate) => {

        delete dataToUpdate.patente;

        if (dataToUpdate.patenteId === 'Seleziona') {
            notify.error.set({
                title: `Devi selezionare una patente`
            })
            return
        }

        try {
            const res = await fetch(`/api/allievi/istruzioni/update`, {
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
                onClick={() => updateIstruzione(data)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:order-1 sm:ml-3">
                Salva
            </button>
        )
    }

    const pageInfo = {
        page: `allievi/edit/${istruzione && istruzione.allievoId}#istruzione`,
        createLink: 'push',
        title: 'Modifica Istruzione'
    }

    return (
        <Layout
            page={pageInfo.page}
            createLink={pageInfo.createLink}
            title={pageInfo.title}
            Button1={Button1}
        >
            {data &&
                <Form
                    router={router}
                    istruzioneData={data}
                    setIstruzioneData={setData}
                    patenti={patenti}
                    step={'istruzione'}
                />
            }
        </Layout>
    )
}


export async function getServerSideProps(context) {
    return {
        props: {
            iid: context.query.iid
        }
    }
}