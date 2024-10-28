import React, { useEffect, useState, useContext } from 'react'
import NotificationContext from '@/store/notifications'
import { useRouter } from 'next/router';
import useSWR from 'swr';
import fetcher, { fetcherWithData } from '@/lib/fetch'
import Layout from '@/components/layout/layout';
import Form from '@/components/allievi/form';




export default function IstruzioneCrea({ aid }) {

    const pageInfo = {
        page: `allievi/edit/${aid}#istruzione`,
        createLink: 'push',
        title: 'Crea Istruzione'
    }

    const notify = useContext(NotificationContext)
    const router = useRouter();

    const [data, setData] = useState([]);

    const { data: companyId } = useSWR('/api/admin/company/isActive', fetcher);

    const { data: patenti } = useSWR(companyId ? {
        url: '/api/admin/patenti/list',
        data: companyId.isActive
    } : null, fetcherWithData);

    useEffect(() => {
        if (patenti) {
            setData({
                allievoId: aid,
                companyId: companyId.isActive,
                patenteId: 'Seleziona',
                marcaOperativa: '',
                dataEsame: undefined,
                foglioRosaRilascio: undefined,
                foglioRosaScadenza: undefined,
                codiceStatino: '',
                istruzioneCompletata: '' === 'true'
            });
        }
    }, [patenti])

    const creaIstruzione = async (dataToCreate) => {

        if (dataToCreate.patenteId === 'Seleziona') {
            notify.error.set({
                title: `Devi selezionare una patente`
            })
            return
        }

        try {
            const res = await fetch(`/api/allievi/istruzioni/new`, {
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
                    router.push(`/allievi/edit/${aid}?identifier=${result.id}#istruzione`)
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
        return (
            <button
                onClick={() => creaIstruzione(data)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:order-1 sm:ml-3">
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
            {patenti &&
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
            aid: context.query.aid
        }
    }
}