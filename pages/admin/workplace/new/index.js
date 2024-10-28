import React, { useContext, useEffect, useState } from 'react'
import NotificationsContext from '@/store/notifications'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import fetcher from '@/lib/fetch'

import Layout from '@/components/layout/layout'
import Form from '@/components/admin/workplace/form'

const pageInfo = {
    page: 'admin/workplace/list',
    createLink: '',
    title: 'Crea workplace'
}

export default function WorkplacerNew() {

    const router = useRouter();

    const notify = useContext(NotificationsContext)

    const { data: isActive } = useSWR('/api/admin/company/isActive', fetcher);

    const [nome, setNome] = useState('');

    const addNewRecord = async () => {

        if (!isActive) {
            notify.error.set({
                title: 'Abbiamo riscontrato un problema interno, ti preghiamo di ricaricare la pagina',
                message: 'Se il problema persiste ti preghiamo di contattare il supporto tecnico, grazie!'
            })
            return
        }
        if (!nome || nome == '') {
            notify.error.set({
                title: 'Devi compilare il campo Nome'
            })
            return
        }
        const data = {
            companyId: isActive.isActive,
            nome: nome.toLowerCase()
        }
        const res = await fetch('/api/admin/workplace/new', {
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
                router.push(`/${pageInfo.page}?identifier=${result.result.id}`)
            }, 1000)
        }
        if (result.statusCode === 400) {
            notify.error.set({
                title: result.title
            })
        }
    }

    const Button1 = () => {
        return (
            <button
                onClick={() => addNewRecord()}
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
            <Form router={router} nome={nome} setNome={setNome} />

        </Layout>
    )
}