import React, { useContext } from 'react'
import NotificationsContext from '@/store/notifications'
import { useRouter } from 'next/router'
import useSWR, { useSWRConfig } from 'swr'
import fetcher, { fetcherWithData } from '@/lib/fetch'

import Layout from '@/components/layout/layout'
import Loader from '@/components/UI/loader'
import Table from '@/components/admin/limitePrenotazioni/table'


const pageInfo = {
    page: 'admin/limitePrenotazioni/update',
    createLink: false,
    title: 'Modifica il limite/limite di prenotazioni mensili per autoscuola'
}

export default function LimitePrenotazioni() {

    const router = useRouter();

    const { mutate } = useSWRConfig()

    const notify = useContext(NotificationsContext)

    const { data: isActive } = useSWR('/api/admin/company/isActive', fetcher);

    // const { data: getAutoscuole, trigger } = useSWR(isActive ? `/api/admin/limitePrenotazioni/list` : null, fetcher);

    const { data: getAutoscuole } = useSWR(isActive ? {
        url: `/api/admin/limitePrenotazioni/list`,
        data: { companyId: isActive.isActive },
    } : null, fetcherWithData
    )

    const updateLimite = async ({ id, newLimite }) => {

        const data = {
            companyId: isActive.isActive,
            id: id,
            newLimite: newLimite
        }

        const res = await fetch('/api/admin/limitePrenotazioni/update', {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        });

        const result = await res.json();

        if (result.statusCode === 200) {
            mutate('/api/admin/limitePrenotazioni/list')
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

    return (
        <Layout
            page={pageInfo.page}
            createLink={pageInfo.createLink}
            title={pageInfo.title}
        >
            {getAutoscuole ?
                <Table
                    autoscuole={getAutoscuole}
                    updateLimite={updateLimite}
                />
                :
                <Loader />
            }
        </Layout>
    )
}