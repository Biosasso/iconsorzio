import React, { useContext } from 'react'
import NotificationContext from '@/store/notifications'
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { fetcherWithData } from '@/lib/fetch'
import Layout from '@/components/layout/layout'

export default function IstruzioneElimina({ did }) {

    const pageInfo = {
        page: `allievi/servizi/delete/${did}`,
        createLink: 'back',
        title: 'Elimina Servizio'
    }

    const notify = useContext(NotificationContext)

    const router = useRouter();

    const { data: istruzioneDetails } = useSWR({ url: '/api/allievi/servizi/getServizioDetail', data: { id: did } }, fetcherWithData);

    const eliminaIstruzione = async (id) => {

        try {
            const res = await fetch(`/api/allievi/servizi/delete`, {
                body: JSON.stringify({ id: id }),
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST'
            });

            const result = await res.json();

            if (result) {

                notify.success.set({
                    title: 'Servizio eliminato con successo'
                })

                setTimeout(() => {
                    router.push(`/allievi/edit/${router.query.allievoId}#servizi`)
                }, 500)

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
                onClick={() => eliminaIstruzione(did)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:order-1 sm:ml-3">
                Elimina
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

            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                <div className="md:grid md:grid-cols-a md:gap-6">
                    <div className="md:col-span-1">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Vuoi davvero eliminare il servizio per la patente <span className='uppercase'>{istruzioneDetails?.AllievoIstruzione?.patente?.nome} </span> di {istruzioneDetails?.AllievoIstruzione?.allievo?.nome} {istruzioneDetails?.AllievoIstruzione?.allievo?.cognome}?</h3>
                        <p className="mt-1 text-sm text-gray-500">Una volta eliminato non sarà più possibile ripristinarlo</p>
                        <p></p>
                    </div>
                </div>
            </div>


        </Layout>
    )
}


export async function getServerSideProps(context) {
    return {
        props: {
            did: context.query.did
        }
    }
}