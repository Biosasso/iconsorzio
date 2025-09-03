import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/layout/layout';
import useSWR from 'swr'
import fetcher, { fetcherWithData } from '@/lib/fetch'
import Loader from '@/components/UI/loader';
import Table from '@/components/allievi/table';
import Tabs from '@/components/allievi/tabs';

const pageInfo = {
    page: 'allievi',
    createLink: 'new',
    title: 'Allievi'
}

export default function Allievi() {

    const router = useRouter();

    const { data: count } = useSWR('/api/allievi/counter', fetcher);

    const [tableData, setTableData] = useState()

    const [activeTab, setActiveTab] = useState('#active');

    const [sorting, setSorting] = useState('foglioRosaAsc');

    const tabs = [
        { name: 'Allievi con istruzioni in corso', href: '#active', current: activeTab, count: count ? count?.active : null },
        { name: 'Allievi con istruzioni archiviate', href: '#deactivated', current: !activeTab, count: count ? count?.deactivated : null },
    ]

    const { data: allievi } = useSWR(activeTab && sorting ? {
        url: `/api/allievi/list`,
        data: {
            activeTab: activeTab,
            sorting: sorting
        }
    } : null, fetcherWithData);

    useEffect(() => {
        if (allievi) {
            setTableData(allievi)
        }
    }, [allievi]);

    return (
        <Layout
            page={pageInfo.page}
            createLink={pageInfo.createLink}
            title={pageInfo.title}
            tableData={tableData ? tableData : null}
            setTableData={setTableData}
            activeTab={'list'}
        >
            {!tableData && <Loader />}
            {count &&
                <Tabs
                    tabs={tabs}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
            }
            {tableData &&
                <Table
                    tableData={tableData}
                    setTableData={setTableData}
                    selectedRow={router.query.identifier}
                    sorting={sorting}
                    setSorting={setSorting}
                />}
        </Layout>
    )
}