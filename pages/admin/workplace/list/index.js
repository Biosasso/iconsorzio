import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import fetcher, { fetcherWithData } from '@/lib/fetch'

import Layout from '@/components/layout/layout'
import Loader from '@/components/UI/loader'
import Table from '@/components/admin/workplace/table'

const pageInfo = {
    page: 'admin/workplace',
    createLink: 'new',
    title: 'Workplace'
}

export default function Workplace() {

    const router = useRouter();

    const { data: isActive } = useSWR('/api/admin/company/isActive', fetcher);
    const { data: workplaces } = useSWR(isActive ? {
        url: '/api/admin/workplace/list',
        data: { companyId: isActive.isActive }
    } : null, fetcherWithData)

    const [tableData, setTableData] = useState();

    useEffect(() => {
        if (workplaces) {
            setTableData(workplaces)
        }
    }, [workplaces])

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