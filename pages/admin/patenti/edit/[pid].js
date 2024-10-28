import React, { useContext, useEffect, useState } from 'react'
import NotificationsContext from '@/store/notifications'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import fetcher, { fetcherWithData } from '@/lib/fetch'
import { TrashIcon } from '@heroicons/react/solid'

import Layout from '@/components/layout/layout'
import Loader from '@/components/UI/loader'
import PatenteForm from '@/components/admin/patenti/form'

const pageInfo = {
    page: 'admin/patenti/list',
    createLink: '',
    title: 'Modifica patente'
}

export default function PatentiNew({ pid }) {

    const router = useRouter();

    const notify = useContext(NotificationsContext)

    const { data: isActive } = useSWR('/api/admin/company/isActive', fetcher);
    const { data: patente } = useSWR(isActive ? `/api/admin/patenti/edit/${pid}` : null, fetcher);

    const [nome, setNome] = useState();

    const deletePatente = async () => {

        const data = {
            id: pid
        }
        const res = await fetch('/api/admin/patenti/delete', {
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
                router.push(`/${pageInfo.page}`)
            }, 1000)
        }
        if (result.statusCode === 400) {
            notify.error.set({
                title: result.message
            })
        }
    }

    const updatePatente = async () => {

        const data = {
            id: pid,
            companyId: isActive.isActive,
            nome: nome.toLowerCase()
        }

        if (nome === patente.nome) {
            notify.warning.set({
                title: 'Non è stata effettuata nessuna modifica, il nome non è cambiato'
            })
            return
        }

        const res = await fetch('/api/admin/patenti/update', {
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
                router.push(`/${pageInfo.page}?identifier=${pid}`)
            }, 1000)
        }
        if (result.statusCode === 400) {
            notify.error.set({
                title: result.title
            })
        }
    }

    const alertDeletePatente = () => {
        notify.alert.set({
            title: `Sei sicuro di voler eliminare la patente?`,
            message: `Eliminando la patente non sarà più utilizzabile in nessun'altra sezione del gestionale e verranno eliminate tutte le tariffe associate`,
        })
    }

    useEffect(() => {
        if (patente) {
            setNome(patente.nome)
        }
    }, [patente]);

    const Button1 = () => {
        return (
            <button
                onClick={() => updatePatente()}
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
            {nome && <PatenteForm router={router} nome={nome} setNome={setNome} deletePatente={deletePatente} alertDeletePatente={alertDeletePatente} />}
            {!nome && <Loader />}
        </Layout>
    )
}

export async function getServerSideProps(context) {

    const { pid } = context.query

    return {
        props: {
            pid: pid
        }
    }

}