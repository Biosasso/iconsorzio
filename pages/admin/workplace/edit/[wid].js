import React, { useContext, useEffect, useState } from 'react'
import NotificationsContext from '@/store/notifications'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import fetcher, { fetcherWithData } from '@/lib/fetch'
import { TrashIcon } from '@heroicons/react/solid'

import Layout from '@/components/layout/layout'
import Loader from '@/components/UI/loader'
import Form from '@/components/admin/workplace/form'

const pageInfo = {
    page: 'admin/workplace/list',
    createLink: '',
    title: 'Modifica workplace'
}

export default function WorkplaceEdit({ wid }) {

    const router = useRouter();

    const notify = useContext(NotificationsContext)

    const { data: isActive } = useSWR('/api/admin/company/isActive', fetcher);
    const { data: workpalce } = useSWR(isActive ? `/api/admin/workplace/edit/${wid}` : null, fetcher);

    const [nome, setNome] = useState();

    const deleteRecord = async () => {

        const data = {
            id: wid
        }
        const res = await fetch('/api/admin/workplace/delete', {
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
                router.push(`/${pageInfo.page}?identifier=${wid}`)
            }, 1000)
        }
        if (result.statusCode === 400) {
            notify.error.set({
                title: result.title
            })
        }
    }

    const updateRecord = async () => {

        const data = {
            id: wid,
            companyId: isActive.isActive,
            nome: nome.toLowerCase()
        }

        if (nome === workpalce.nome) {
            notify.warning.set({
                title: 'Non è stata effettuata nessuna modifica, il nome non è cambiato'
            })
            return
        }

        const res = await fetch('/api/admin/workplace/update', {
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
                router.push(`/${pageInfo.page}?identifier=${wid}`)
            }, 1000)
        }
        if (result.statusCode === 400) {
            notify.error.set({
                title: result.title
            })
        }
    }

    const alertDeleteRecord = () => {
        notify.alert.set({
            title: `Sei sicuro di voler eliminare il workplace?`,
            message: `Eliminando il workpalce non sarà più utilizzabile in nessun'altra sezione del gestionale`,
        })
    }

    useEffect(() => {
        if (workpalce) {
            setNome(workpalce.nome)
        }
    }, [workpalce]);

    const Button1 = () => {
        return (
            <button
                onClick={() => updateRecord()}
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
            {nome && <Form router={router} nome={nome} setNome={setNome} deleteRecord={deleteRecord} alertDeleteRecord={alertDeleteRecord} />}
            {!nome && <Loader />}
        </Layout>
    )
}

export async function getServerSideProps(context) {

    const { wid } = context.query

    return {
        props: {
            wid: wid
        }
    }

}