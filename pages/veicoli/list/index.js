import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import fetcher, { fetcherWithData } from '@/lib/fetch'

import Layout from '@/components/layout/layout'
import Loader from '@/components/UI/loader'
import Table from '@/components/veicoli/table'
import Tabs from '@/components/veicoli/tabs'

const pageInfo = {
    page: 'veicoli',
    createLink: 'new',
    title: 'Veicoli'
}

export default function Veicoli() {

    const router = useRouter();

    const { data: isActive } = useSWR('/api/admin/company/isActive', fetcher);

    const { data: veicoli } = useSWR(isActive ? {
        url: '/api/veicoli/list',
        data: { companyId: isActive.isActive }
    } : null, fetcherWithData)

    const { data: count } = useSWR(veicoli ? '/api/veicoli/counter' : null, fetcher);

    const [tableData, setTableData] = useState();

    const [activeTab, setActiveTab] = useState();

    const [veicoliActive, setVeicoliActive] = useState([]);
    const [veicoliDeactivated, setVeicoliDeactivated] = useState([]);

    const tabs = [
        { name: 'Veicoli attivi', href: '#active', current: activeTab, count: count ? count?.active : null },
        { name: 'Veicoli disattivati', href: '#deactivated', current: !activeTab, count: count ? count?.deactivated : null },
    ]

    useEffect(() => {
        if (veicoli) {
            const veicoliActiveTmp = [];
            const veicoliDeactivatedTmp = [];

            veicoli.forEach(item => {
                if (item.isActive) {
                    veicoliActiveTmp.push(item);
                }
                else {
                    veicoliDeactivatedTmp.push(item)
                }
            })
            setVeicoliActive(veicoliActiveTmp);
            setVeicoliDeactivated(veicoliDeactivatedTmp)
            setTableData(veicoliActiveTmp)
        }
    }, [veicoli]);

    useEffect(() => {
        if (veicoli) {
            if (activeTab) {
                setTableData(veicoliActive)
            }
            else {
                setTableData(veicoliDeactivated)
            }
        }
    }, [activeTab])

    useEffect(() => {
        setActiveTab(true)
    }, [])

    return (
        <Layout
            page={pageInfo.page}
            createLink={pageInfo.createLink}
            title={pageInfo.title}
            tableData={tableData}
            setTableData={setTableData}
        >
            {!tableData && <Loader />}
            {count &&
                <Tabs
                    tabs={tabs}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
            }
            {tableData && <Table tableData={tableData} selectedRow={router.query.identifier} />}

        </Layout>
    )
}