import React, { useContext, useEffect, useState } from 'react'
import NotificationsContext from '@/store/notifications'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import fetcher, { fetcherWithData } from '@/lib/fetch'
import { TrashIcon } from '@heroicons/react/solid'

import Layout from '@/components/layout/layout'
import Loader from '@/components/UI/loader'
import Table from '@/components/admin/patenti/table'

const pageInfo = {
    page: 'admin/patenti',
    createLink: 'new',
    title: 'Patenti'
}

export default function Patenti() {

    const router = useRouter();

    const notify = useContext(NotificationsContext)

    const { data: isActive } = useSWR('/api/admin/company/isActive', fetcher);
    const { data: patenti } = useSWR(isActive ? {
        url: '/api/admin/patenti/list',
        data: { companyId: isActive.isActive }
    } : null, fetcherWithData)

    const [tableData, setTableData] = useState();

    useEffect(() => {
        if (patenti) {
            setTableData(patenti)
        }
    }, [patenti])

    return (
        <Layout
            page={pageInfo.page}
            createLink={pageInfo.createLink}
            title={pageInfo.title}
            tableData={tableData}
            setTableData={setTableData}
        >
            {!tableData && <Loader />}
            {tableData && <Table tableData={tableData} selectedRow={router.query.identifier} />}

        </Layout>
    )
}